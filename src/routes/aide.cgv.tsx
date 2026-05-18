import { createFileRoute } from "@tanstack/react-router";
import { HelpPageShell } from "@/components/HelpPageShell";

export const Route = createFileRoute("/aide/cgv")({
  component: CgvPage,
  head: () => ({
    meta: [
      { title: "Conditions générales de vente · BISP Uniformes" },
      { name: "description", content: "Conditions générales de vente de la boutique uniformes BISP." },
    ],
  }),
});

function CgvPage() {
  return (
    <HelpPageShell
      title="Conditions générales de vente"
      subtitle="Version provisoire — à valider avec la direction et le service juridique de la BISP."
    >
      <p>
        Les présentes conditions générales de vente (CGV) régissent les ventes d'articles
        d'uniformes proposés sur la boutique en ligne de la Bilingual International
        School of Paris (ci-après «&nbsp;la BISP&nbsp;»).
      </p>

      <h2>1. Identité du vendeur</h2>
      <p>
        Bilingual International School of Paris — <em>raison sociale exacte, SIRET, RCS,
        TVA intracommunautaire et adresse du siège à compléter</em>.
      </p>

      <h2>2. Produits</h2>
      <p>
        Les articles proposés sont des pièces d'uniforme à l'écusson de la BISP. Les
        photographies et descriptifs sont fournis à titre indicatif&nbsp;: les coloris
        peuvent légèrement varier selon les écrans.
      </p>

      <h2>3. Prix</h2>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises, hors frais de livraison
        éventuels. La BISP se réserve le droit de modifier ses prix à tout moment, étant
        entendu que le prix applicable est celui en vigueur au jour de la commande.
      </p>

      <h2>4. Commande</h2>
      <p>
        Toute commande implique l'acceptation pleine et entière des présentes CGV. La
        commande n'est définitive qu'après confirmation par e-mail.
      </p>

      <h2>5. Paiement</h2>
      <p>
        Le paiement s'effectue par <em>moyen de paiement à confirmer (carte bancaire,
        prélèvement, virement)</em>. Les transactions sont sécurisées par notre
        prestataire de paiement.
      </p>

      <h2>6. Livraison et retrait</h2>
      <p>
        Les modalités de remise sont détaillées sur la page «&nbsp;Livraison &amp;
        retours&nbsp;». Les délais sont communiqués à titre indicatif.
      </p>

      <h2>7. Droit de rétractation</h2>
      <p>
        Conformément à l'article L.221-18 du Code de la consommation, le client dispose
        d'un délai de 14 jours pour exercer son droit de rétractation, hors articles
        personnalisés (broderies nominatives).
      </p>

      <h2>8. Garanties</h2>
      <p>
        Les articles bénéficient de la garantie légale de conformité et de la garantie
        contre les vices cachés.
      </p>

      <h2>9. Données personnelles</h2>
      <p>
        Les données collectées dans le cadre des commandes sont traitées conformément à
        la politique de confidentialité.
      </p>

      <h2>10. Litiges</h2>
      <p>
        Les présentes CGV sont soumises au droit français. Tout litige relève de la
        compétence des tribunaux français.
      </p>
    </HelpPageShell>
  );
}
