import { createFileRoute } from "@tanstack/react-router";
import { UnderConstructionPage } from "@/components/UnderConstructionPage";

export const Route = createFileRoute("/aide/guide-tailles")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Guide des tailles · BISP Uniformes" },
      { name: "description", content: "Page en cours de construction." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function Page() {
  return <UnderConstructionPage title="Guide des tailles" />;
}
