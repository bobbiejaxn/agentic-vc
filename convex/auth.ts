import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    {
      id: "email",
      name: "Email",
      type: "email",
      from: "noreply@vcportfolioos.com",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sendVerificationRequest: async ({ identifier: email, url }) => {
        // TODO: Implement email sending
        console.log(`Send login link to ${email}: ${url}`);
      },
    },
  ],
});
