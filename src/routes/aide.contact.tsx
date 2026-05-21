import { createFileRoute } from "@tanstack/react-router";
import { UnderConstructionPage } from "@/components/UnderConstructionPage";
import { isUnderConstruction } from "@/config/underConstruction";

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
  const title = isUnderConstruction("/aide/contact");
  if (title) return <UnderConstructionPage title={title} />;
  return <UnderConstructionPage title="Contact" />;
}
