import { createFileRoute } from "@tanstack/react-router";
import { UnderConstructionPage } from "@/components/UnderConstructionPage";

export const Route = createFileRoute("/aide/contact")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Contact · BISP Uniformes" },
      { name: "description", content: "Page en cours de construction." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function Page() {
  return <UnderConstructionPage title="Contact" />;
}
