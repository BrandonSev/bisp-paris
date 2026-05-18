import { createFileRoute } from "@tanstack/react-router";
import { HelpPageShell } from "@/components/HelpPageShell";

export const Route = createFileRoute("/aide/livraison")({
  component: LivraisonPage,
  head: () => ({
    meta: [
      { title: "Livraison & retours · BISP Uniformes" },
      { name: "description", content: "Modalités de livraison, retrait à l'école et politique de retour des uniformes BISP." },
    ],
  }),
});

function LivraisonPage() {
  return (
    <HelpPageShell
      title="Livraison & retours"
      subtitle="Tout ce qu'il faut savoir sur la remise des commandes, les délais et les échanges de taille."
    >
      <h2>Modes de remise</h2>
      <h3>Retrait à l'école</h3>
      <p>
        Mode de remise privilégié. Les commandes sont préparées et tenues à disposition
        au secrétariat de la BISP. Un e-mail vous indique la fenêtre de retrait dès que
        votre commande est prête.
      </p>
      <h3>Livraison à domicile (optionnelle)</h3>
      <p>
        Lorsque la livraison à domicile est activée, elle est assurée par notre
        transporteur partenaire sous 5 à 8 jours ouvrés en France métropolitaine. Les
        frais et conditions précis sont indiqués au moment du choix du mode de livraison
        dans le panier.
      </p>

      <h2>Délais de préparation</h2>
      <p>
        En période courante : 3 à 5 jours ouvrés. En période de rentrée scolaire (août -
        mi-septembre), les délais peuvent être étendus à 10 jours ouvrés, le temps
        d'absorber le pic de commandes.
      </p>

      <h2>Échanges de taille</h2>
      <p>
        Les échanges de taille sont possibles dans un délai de 30 jours après réception
        de la commande, sous réserve que les articles soient&nbsp;:
      </p>
      <ul>
        <li>non portés, non lavés, non brodés à un nom autre que générique,</li>
        <li>dans leur emballage d'origine,</li>
        <li>accompagnés de la preuve d'achat.</li>
      </ul>
      <p>
        Pour initier un échange, écrivez à <strong>operations@bisparis.com</strong> en
        indiquant le numéro de commande et l'article concerné.
      </p>

      <h2>Retours et remboursements</h2>
      <p>
        Conformément à la réglementation, vous disposez d'un délai de 14 jours après
        réception pour exercer votre droit de rétractation, hors articles personnalisés
        (broderies au nom de l'élève notamment).
      </p>

      <h2>English summary</h2>
      <p>
        Orders are primarily picked up at the BISP campus. Home delivery may be offered
        depending on the period, with a 5–8 working-day lead time. Size exchanges are
        accepted within 30 days on unworn items. Personalised items (name embroidery)
        are non-refundable.
      </p>
    </HelpPageShell>
  );
}
