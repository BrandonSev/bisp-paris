import { createFileRoute } from "@tanstack/react-router";
import { UnderConstructionPage } from "@/components/UnderConstructionPage";

export const Route = createFileRoute("/aide/livraison")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Livraison & retours · BISP Uniformes" },
      { name: "description", content: "Page en cours de construction." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function Page() {
  return <UnderConstructionPage title="Livraison & retours" />;
}
