import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(basicRoutes)/donate")({
  beforeLoad: () => {
    // Redirect to external donation URL
    throw redirect({ href: "https://donate.stripe.com/6oE4jK1iPcPT1m89AA" });
  },
});
