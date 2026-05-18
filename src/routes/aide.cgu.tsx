import { createFileRoute } from "@tanstack/react-router";
import { HelpPageShell } from "@/components/HelpPageShell";

export const Route = createFileRoute("/aide/cgu")({
  component: CguPage,
  head: () => ({
    meta: [
      { title: "Conditions générales d'utilisation · BISP Uniformes" },
      { name: "description", content: "Conditions d'utilisation du portail famille de la boutique uniformes BISP." },
    ],
  }),
});

function CguPage() {
  return (
    <HelpPageShell
      title="Conditions générales d'utilisation"
      subtitle="Version provisoire — à valider avec la direction de la BISP."
    >
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales d'utilisation (CGU) régissent l'accès et
        l'utilisation du portail famille de la boutique uniformes BISP.
      </p>

      <h2>2. Accès au service</h2>
      <p>
        L'accès au portail est réservé aux familles rattachées à la BISP. Un compte est
        créé à partir d'une adresse e-mail valide et d'un mot de passe choisi par
        l'utilisateur.
      </p>

      <h2>3. Compte et confidentialité</h2>
      <p>
        L'utilisateur est responsable de la confidentialité de ses identifiants. Toute
        action effectuée depuis son compte est réputée effectuée par lui-même.
      </p>

      <h2>4. Utilisation conforme</h2>
      <p>
        Le service doit être utilisé conformément à sa finalité&nbsp;: gestion des
        enfants, commande d'uniformes, suivi des commandes. Tout usage abusif ou
        frauduleux pourra entraîner la suspension du compte.
      </p>

      <h2>5. Disponibilité</h2>
      <p>
        La BISP s'efforce d'assurer la disponibilité du service. Des interruptions
        peuvent toutefois survenir pour maintenance ou en cas de force majeure.
      </p>

      <h2>6. Propriété intellectuelle</h2>
      <p>
        Tous les éléments du site (textes, images, écusson, marque BISP) sont protégés
        et restent la propriété exclusive de la BISP ou de ses partenaires.
      </p>
    </HelpPageShell>
  );
}
