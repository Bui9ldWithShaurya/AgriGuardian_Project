import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy path from the previous app: /scan is the same page as /detection.
export const Route = createFileRoute("/scan")({
  beforeLoad: () => {
    throw redirect({ to: "/detection" });
  },
});
