import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageShell } from "@/components/LegalPageShell";
import { UnderConstructionPage } from "@/components/UnderConstructionPage";
import { isUnderConstruction } from "@/config/underConstruction";

export const Route = createFileRoute("/aide/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales · BISP" },
      { name: "description", content: "Informations légales relatives à l'éditeur et à l'hébergeur du site." },
    ],
  }),
  component: MentionsPage,
});

function MentionsPage() {
  const wipTitle = isUnderConstruction("/aide/mentions-legales");
  if (wipTitle) return <UnderConstructionPage title={wipTitle} />;
  return (
    <LegalPageShell title="Mentions légales" updatedAt="mai 2026">
      <h2>Éditeur du site</h2>
      <p>
        <strong>France Uniformes</strong><br />
        Société par Actions Simplifiée (SAS) au capital de 2 500 €<br />
        Siège social : 2 Rue Percheronne, 28000 Chartres<br />
        RCS Chartres n° 983 587 932 — SIRET : 983 587 932 00010<br />
        TVA intracommunautaire : FR43983587932<br />
        Email : <a href="mailto:info@franceuniforme.fr">info@franceuniforme.fr</a>
      </p>

      <h2>Directeur de la publication</h2>
      <p>Paul Baudinet, Directeur Général de France Uniformes</p>

      <h2>Hébergement</h2>
      <p>
        <strong>OVHcloud SAS</strong><br />
        2 Rue Kellermann, 59100 Roubaix, France<br />
        <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer">www.ovhcloud.com</a>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur la plateforme (textes, images, logos, graphismes, interface, structure)
        est la propriété exclusive de France Uniformes ou de ses partenaires et est protégé par les lois françaises
        et internationales relatives à la propriété intellectuelle. Toute reproduction, représentation ou exploitation
        sans autorisation préalable écrite est strictement interdite.
      </p>

      <h2>Protection des données personnelles</h2>
      <p>
        Le traitement des données personnelles est décrit dans notre{" "}
        <Link to="/aide/confidentialite">Politique de confidentialité</Link>{" "}
        accessible sur cette plateforme. Pour toute question :{" "}
        <a href="mailto:dpo@franceuniforme.fr">dpo@franceuniforme.fr</a>
      </p>

      <h2>Médiation</h2>
      <p>
        En cas de litige lié à un achat, France Uniformes adhère au service de médiation du{" "}
        <strong>CM2C — Centre de la Médiation de la Consommation de Conciliateurs de justice</strong>,
        49 rue de Ponthieu, 75008 Paris —{" "}
        <a href="https://www.cm2c.net" target="_blank" rel="noopener noreferrer">www.cm2c.net</a>.
      </p>
    </LegalPageShell>
  );
}