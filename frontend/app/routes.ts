import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/home", "routes/home.tsx"),
  route("/org", "routes/org.tsx"),
  route("/org-advanced", "routes/org-advanced.tsx"),
] satisfies RouteConfig;
