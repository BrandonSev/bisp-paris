import { createFileRoute } from "@tanstack/react-router";
import { UnderConstructionPage } from "@/components/UnderConstructionPage";

export const Route = createFileRoute("/aide/confidentialite")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Confidentialité · BISP Uniformes" },
      { name: "description", content: "Page en cours de construction." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function Page() {
  return <UnderConstructionPage title="Confidentialité" />;
}
