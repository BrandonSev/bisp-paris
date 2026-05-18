import { createFileRoute } from "@tanstack/react-router";
import { HelpPageShell } from "@/components/HelpPageShell";

export const Route = createFileRoute("/aide/mentions-legales")({
  component: MentionsPage,
  head: () => ({
    meta: [
      { title: "Mentions légales · BISP Uniformes" },
      { name: "description", content: "Mentions légales du site boutique uniformes de la Bilingual International School of Paris." },
    ],
  }),
});

function MentionsPage() {
  return (
    <HelpPageShell
      title="Mentions légales"
      subtitle="Informations à compléter avec les données officielles de l'établissement."
    >
      <h2>Éditeur du site</h2>
      <p>
        Bilingual International School of Paris (BISP)<br />
        <em>Forme juridique, capital social, SIRET, RCS, TVA intracommunautaire à
        compléter</em><br />
        Adresse du siège&nbsp;: <em>à compléter</em>, 75015 Paris<br />
        E-mail&nbsp;: operations@bisparis.com
      </p>

      <h2>Directeur de la publication</h2>
      <p><em>Nom et qualité du directeur de la publication à compléter</em>.</p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé sur l'infrastructure Lovable Cloud, opérée par Lovable AB.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur le site (textes, photos, écusson, marque
        BISP, design) est protégé par le droit d'auteur et le droit des marques. Toute
        reproduction sans autorisation est interdite.
      </p>

      <h2>Crédits</h2>
      <p>
        Conception et développement&nbsp;: équipe BISP avec l'aide de Lovable.
      </p>
    </HelpPageShell>
  );
}
