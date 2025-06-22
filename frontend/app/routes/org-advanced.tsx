import { authClient } from "../lib/auth-client";
import slug from "slug";
import { useState, useEffect } from "react";

const OrgAdvanced = () => {
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [teamName, setTeamName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [orgLogo, setOrgLogo] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("members");

  // Check slug availability
  const checkSlug = async (slug: string) => {
    if (!slug) return;
    setIsCheckingSlug(true);
    try {
      await authClient.organization.checkSlug({ slug });
      setSlugAvailable(true);
    } catch (error) {
      setSlugAvailable(false);
    } finally {
      setIsCheckingSlug(false);
    }
  };

  // Create organization
  const handleCreateOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const org = await authClient.organization.create({
        name: orgName,
        slug: orgSlug,
        logo: orgLogo || undefined
      });
      console.log("Created organization:", org);
      setShowCreateForm(false);
      setOrgName("");
      setOrgSlug("");
      setOrgLogo("");
      setSelectedOrg(org);
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  // Update organization
  const handleUpdateOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrg) return;
    try {
      const updatedOrg = await authClient.organization.update({
        organizationId: selectedOrg.id,
        data: {
          name: orgName,
          slug: orgSlug,
          logo: orgLogo || undefined,
          metadata: {
            updatedAt: new Date().toISOString()
          }
        }
      });
      console.log("Updated organization:", updatedOrg);
      setSelectedOrg(updatedOrg);
      setShowEditForm(false);
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  // Delete organization
  const handleDeleteOrg = async () => {
    if (!selectedOrg) return;
    if (confirm("Are you sure you want to delete this organization? This action cannot be undone.")) {
      try {
        await authClient.organization.delete({ organizationId: selectedOrg.id });
        console.log("Deleted organization");
        setSelectedOrg(null);
      } catch (error) {
        console.error("Error deleting organization:", error);
      }
    }
  };

  // Set active organization
  const handleSetActiveOrg = async (org: any) => {
    try {
      await authClient.organization.setActive({ organizationId: org.id });
      console.log("Set active organization:", org.name);
    } catch (error) {
      console.error("Error setting active organization:", error);
    }
  };

  // Get full organization details
  const handleGetFullOrg = async (org: any) => {
    try {
      const fullOrg = await authClient.organization.getFullOrganization({
        query: { organizationId: org.id }
      });
      console.log("Full organization details:", fullOrg);
      setSelectedOrg(fullOrg);
    } catch (error) {
      console.error("Error getting full organization:", error);
    }
  };

  // Invite member
  const handleInviteMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrg) return;
    try {
      const invitation = await authClient.organization.inviteMember({
        email: inviteEmail,
        role: inviteRole as any,
        organizationId: selectedOrg.id
      });
      console.log("Invited member:", invitation);
      setShowInviteForm(false);
      setInviteEmail("");
      setInviteRole("member");
      setSelectedTeam(null);
      // Refresh organization data
      handleGetFullOrg(selectedOrg);
    } catch (error) {
      console.error("Error inviting member:", error);
    }
  };

  // Create team
  const handleCreateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrg) return;
    try {
      const team = await authClient.organization.createTeam({
        name: teamName,
        organizationId: selectedOrg.id
      });
      console.log("Created team:", team);
      setShowTeamForm(false);
      setTeamName("");
      // Refresh organization data
      handleGetFullOrg(selectedOrg);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  // Update team
  const handleUpdateTeam = async (team: any) => {
    const newName = prompt("Enter new team name:", team.name);
    if (!newName || !selectedOrg) return;
    try {
      const updatedTeam = await authClient.organization.updateTeam({
        teamId: team.id,
        data: { name: newName }
      });
      console.log("Updated team:", updatedTeam);
      handleGetFullOrg(selectedOrg);
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  // Remove team
  const handleRemoveTeam = async (team: any) => {
    if (!selectedOrg) return;
    if (confirm(`Are you sure you want to delete team "${team.name}"?`)) {
      try {
        await authClient.organization.removeTeam({
          teamId: team.id,
          organizationId: selectedOrg.id
        });
        console.log("Removed team:", team.name);
        handleGetFullOrg(selectedOrg);
      } catch (error) {
        console.error("Error removing team:", error);
      }
    }
  };

  // Remove member
  const handleRemoveMember = async (member: any) => {
    if (!selectedOrg) return;
    if (confirm(`Are you sure you want to remove ${member.user.email}?`)) {
      try {
        await authClient.organization.removeMember({
          memberId: member.id,
          organizationId: selectedOrg.id
        });
        console.log("Removed member:", member.user.email);
        handleGetFullOrg(selectedOrg);
      } catch (error) {
        console.error("Error removing member:", error);
      }
    }
  };

  // Update member role
  const handleUpdateMemberRole = async (member: any) => {
    const newRole = prompt("Enter new role (owner/admin/member):", member.role);
    if (!newRole || !selectedOrg) return;
    try {
      const updatedMember = await authClient.organization.updateMemberRole({
        memberId: member.id,
        role: newRole as any,
        organizationId: selectedOrg.id
      });
      console.log("Updated member role:", updatedMember);
      handleGetFullOrg(selectedOrg);
    } catch (error) {
      console.error("Error updating member role:", error);
    }
  };

  // Leave organization
  const handleLeaveOrg = async () => {
    if (!selectedOrg) return;
    if (confirm("Are you sure you want to leave this organization?")) {
      try {
        await authClient.organization.leaveOrganization({
          organizationId: selectedOrg.id
        });
        console.log("Left organization");
        setSelectedOrg(null);
      } catch (error) {
        console.error("Error leaving organization:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Advanced Organization Management</h1>
        
        {/* Active Organization Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Active Organization</h2>
          {activeOrganization ? (
            <div className="flex items-center space-x-4">
              {activeOrganization.logo && (
                <img src={activeOrganization.logo} alt="Logo" className="w-12 h-12 rounded" />
              )}
              <div>
                <p className="font-medium">{activeOrganization.name}</p>
                <p className="text-sm text-gray-500">@{activeOrganization.slug}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No active organization selected</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Organizations List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Organizations</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Create New
                </button>
              </div>
              
              <div className="space-y-3">
                {organizations?.map((org) => (
                  <div
                    key={org.id}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      selectedOrg?.id === org.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedOrg(org)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-sm text-gray-500">@{org.slug}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetActiveOrg(org);
                          }}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                        >
                          Set Active
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGetFullOrg(org);
                          }}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="lg:col-span-2">
            {selectedOrg ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedOrg.name}</h2>
                    <p className="text-gray-500">@{selectedOrg.slug}</p>
                    {selectedOrg.logo && (
                      <img src={selectedOrg.logo} alt="Logo" className="w-16 h-16 rounded mt-2" />
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setOrgName(selectedOrg.name);
                        setOrgSlug(selectedOrg.slug);
                        setOrgLogo(selectedOrg.logo || "");
                        setShowEditForm(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteOrg}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={handleLeaveOrg}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Leave
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab("members")}
                      className={`py-2 px-1 text-sm font-medium border-b-2 ${
                        activeTab === "members"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Members
                    </button>
                    <button
                      onClick={() => setActiveTab("teams")}
                      className={`py-2 px-1 text-sm font-medium border-b-2 ${
                        activeTab === "teams"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Teams
                    </button>
                    <button
                      onClick={() => setActiveTab("invitations")}
                      className={`py-2 px-1 text-sm font-medium border-b-2 ${
                        activeTab === "invitations"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Invitations
                    </button>
                  </nav>
                </div>

                {/* Members Section */}
                {activeTab === "members" && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Members</h3>
                      <button
                        onClick={() => setShowInviteForm(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Invite Member
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedOrg.members?.map((member: any) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{member.user.email}</p>
                            <p className="text-sm text-gray-500">Role: {member.role}</p>
                            {member.team && (
                              <p className="text-xs text-gray-400">Team: {member.team.name}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateMemberRole(member)}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                            >
                              Change Role
                            </button>
                            <button
                              onClick={() => handleRemoveMember(member)}
                              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teams Section */}
                {activeTab === "teams" && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Teams</h3>
                      <button
                        onClick={() => setShowTeamForm(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                      >
                        Create Team
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedOrg.teams?.map((team: any) => (
                        <div key={team.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{team.name}</p>
                            <p className="text-sm text-gray-500">
                              {team.members?.length || 0} members
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateTeam(team)}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemoveTeam(team)}
                              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Invitations Section */}
                {activeTab === "invitations" && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Pending Invitations</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedOrg.invitations?.map((invitation: any) => (
                        <div key={invitation.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{invitation.email}</p>
                            <p className="text-sm text-gray-500">Role: {invitation.role}</p>
                            <p className="text-xs text-gray-400">
                              Invited by: {invitation.inviter.email}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(invitation.expiresAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {(!selectedOrg.invitations || selectedOrg.invitations.length === 0) && (
                        <p className="text-gray-500 text-center py-4">No pending invitations</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64">
                <p className="text-gray-500">Select an organization to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Organization Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create Organization</h3>
              <form onSubmit={handleCreateOrg} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={orgSlug}
                    onChange={(e) => {
                      const newSlug = slug(e.target.value);
                      setOrgSlug(newSlug);
                      checkSlug(newSlug);
                    }}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  {isCheckingSlug && <p className="text-sm text-gray-500">Checking...</p>}
                  {slugAvailable === true && <p className="text-sm text-green-600">✓ Available</p>}
                  {slugAvailable === false && <p className="text-sm text-red-600">✗ Taken</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo URL (optional)</label>
                  <input
                    type="url"
                    value={orgLogo}
                    onChange={(e) => setOrgLogo(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Organization Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Organization</h3>
              <form onSubmit={handleUpdateOrg} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={orgSlug}
                    onChange={(e) => {
                      const newSlug = slug(e.target.value);
                      setOrgSlug(newSlug);
                      checkSlug(newSlug);
                    }}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  {isCheckingSlug && <p className="text-sm text-gray-500">Checking...</p>}
                  {slugAvailable === true && <p className="text-sm text-green-600">✓ Available</p>}
                  {slugAvailable === false && <p className="text-sm text-red-600">✗ Taken</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo URL (optional)</label>
                  <input
                    type="url"
                    value={orgLogo}
                    onChange={(e) => setOrgLogo(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invite Member Modal */}
        {showInviteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Invite Member</h3>
              <form onSubmit={handleInviteMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                {selectedOrg?.teams?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Team (optional)</label>
                    <select
                      value={selectedTeam?.id || ""}
                      onChange={(e) => {
                        const team = selectedOrg.teams.find((t: any) => t.id === e.target.value);
                        setSelectedTeam(team);
                      }}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">No team</option>
                      {selectedOrg.teams.map((team: any) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Send Invitation
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Team Modal */}
        {showTeamForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create Team</h3>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                  >
                    Create Team
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTeamForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgAdvanced; 