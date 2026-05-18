import { createFileRoute } from "@tanstack/react-router";
import { HelpPageShell } from "@/components/HelpPageShell";

export const Route = createFileRoute("/aide/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact · BISP Uniformes" },
      { name: "description", content: "Contactez l'équipe boutique uniformes de la Bilingual International School of Paris." },
    ],
  }),
});

function ContactPage() {
  return (
    <HelpPageShell
      title="Contact"
      subtitle="Une question sur votre commande, une taille, une livraison ? Notre équipe répond sous 48 h ouvrées."
    >
      <h2>Boutique uniformes BISP</h2>
      <p>
        Pour toute demande relative à la boutique uniformes (commande, retrait, échange,
        facturation), écrivez-nous à&nbsp;:
      </p>
      <p>
        <strong>operations@bisparis.com</strong>
      </p>

      <h3>Adresse de retrait</h3>
      <p>
        Bilingual International School of Paris<br />
        <em>Adresse précise à confirmer</em><br />
        75015 Paris, France
      </p>

      <h3>Horaires d'ouverture de la boutique</h3>
      <p>
        Les créneaux de retrait sont communiqués par e-mail à la préparation de la
        commande. En période de rentrée (août - septembre), des permanences spécifiques
        sont organisées.
      </p>

      <h2>English</h2>
      <p>
        For any inquiry regarding the BISP uniform shop (orders, pickup, exchanges,
        billing), please contact us at <strong>operations@bisparis.com</strong>. Our team
        will reply within 2 working days.
      </p>
    </HelpPageShell>
  );
}
