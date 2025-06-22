import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma";
import { organization } from "better-auth/plugins"

const prisma = new PrismaClient();

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true
    },
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: ["http://localhost:5173"],
    plugins: [
        organization() 
    ]
})