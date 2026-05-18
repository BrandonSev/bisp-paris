import { createFileRoute } from "@tanstack/react-router";
import { HelpPageShell } from "@/components/HelpPageShell";

export const Route = createFileRoute("/aide/confidentialite")({
  component: ConfidentialitePage,
  head: () => ({
    meta: [
      { title: "Politique de confidentialité · BISP Uniformes" },
      { name: "description", content: "Politique de confidentialité et de traitement des données personnelles de la boutique uniformes BISP." },
    ],
  }),
});

function ConfidentialitePage() {
  return (
    <HelpPageShell
      title="Politique de confidentialité"
      subtitle="Traitement des données personnelles dans le cadre de la boutique uniformes BISP."
    >
      <h2>Responsable de traitement</h2>
      <p>
        Le responsable de traitement est la Bilingual International School of Paris
        (BISP), <em>raison sociale et SIRET à compléter</em>.
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>Identité&nbsp;: civilité, nom, prénom, e-mail, téléphone.</li>
        <li>Adresse de livraison (si applicable).</li>
        <li>Informations relatives aux enfants&nbsp;: prénom, nom, classe, section, mensurations.</li>
        <li>Historique de commandes et préférences de taille.</li>
      </ul>

      <h2>Finalités</h2>
      <ul>
        <li>Gestion des comptes famille et des enfants rattachés.</li>
        <li>Traitement et suivi des commandes d'uniformes.</li>
        <li>Recommandations de taille personnalisées.</li>
        <li>Communication relative aux commandes et au service.</li>
      </ul>

      <h2>Base légale</h2>
      <p>
        Les traitements reposent sur l'exécution du contrat conclu avec la famille
        (commande d'uniformes) et, pour certains traitements, sur l'intérêt légitime de
        la BISP à offrir un service de qualité.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les données du compte sont conservées pendant la scolarité de l'enfant à la BISP,
        puis archivées selon les obligations légales (notamment comptables) avant
        suppression.
      </p>

      <h2>Destinataires</h2>
      <p>
        Les données sont destinées aux équipes BISP en charge de la boutique et, le cas
        échéant, aux prestataires de paiement et de livraison strictement nécessaires à
        l'exécution du service.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification,
        d'effacement, d'opposition, de limitation et de portabilité. Pour exercer ces
        droits, écrivez à <strong>operations@bisparis.com</strong>.
      </p>

      <h2>Cookies</h2>
      <p>
        Le portail utilise uniquement des cookies strictement nécessaires au
        fonctionnement du service (session de connexion). Aucun cookie publicitaire ou
        de mesure tierce n'est déposé.
      </p>
    </HelpPageShell>
  );
}
