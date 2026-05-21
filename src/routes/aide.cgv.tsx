import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageShell } from "@/components/LegalPageShell";
import { UnderConstructionPage } from "@/components/UnderConstructionPage";
import { isUnderConstruction } from "@/config/underConstruction";

export const Route = createFileRoute("/aide/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions Générales de Vente · France Uniformes" },
      {
        name: "description",
        content:
          "Conditions Générales de Vente de France Uniformes : commande, paiement, livraison, retours et garanties.",
      },
    ],
  }),
  component: CgvPage,
});

function CgvPage() {
  const wipTitle = isUnderConstruction("/aide/cgv");
  if (wipTitle) return <UnderConstructionPage title={wipTitle} />;
  return (
    <LegalPageShell title="Conditions Générales de Vente — Familles" updatedAt="mai 2026">
      <h2>1. Vendeur</h2>
      <p>
        <strong>France Uniformes (FU)</strong><br />
        Société par Actions Simplifiée (SAS) au capital de 2 500 €<br />
        Siège social : 2 Rue Percheronne, 28000 Chartres<br />
        RCS Chartres n° 983 587 932 — SIRET : 983 587 932 00010<br />
        TVA intracommunautaire : FR43983587932<br />
        Contact : <a href="mailto:info@franceuniforme.fr">info@franceuniforme.fr</a>
      </p>

      <h2>2. Objet et champ d'application</h2>
      <p>
        Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre France
        Uniformes et toute personne physique (ci-après « le Client » ou « la Famille ») effectuant un achat via la
        plateforme boutique en ligne de France Uniformes.
      </p>
      <p>
        L'accès à la boutique est strictement réservé aux familles des élèves scolarisés dans l'établissement scolaire
        partenaire concerné. Il requiert la création d'un espace famille et la saisie d'un code d'établissement
        communiqué par la direction ou l'association des parents d'élèves. Les présentes CGV s'appliquent à toute
        commande passée via cet espace.
      </p>
      <p>
        Les produits proposés à la vente sont des uniformes et vêtements scolaires dont les modèles et tarifs ont été
        validés par l'établissement scolaire partenaire concerné. France Uniformes s'engage à privilégier la
        fabrication française pour l'ensemble de sa gamme.
      </p>
      <p>
        La mention « Fabrication française » figurant sur les étiquettes et fiches produits atteste que la coupe et la
        confection du vêtement sont réalisées dans des ateliers situés en France. Pour certaines pièces, d'autres
        étapes du processus textile (tricotage, tissage) sont également réalisées en France. L'origine des matières
        premières n'est pas couverte par cette mention.
      </p>
      <p>
        L'origine de fabrication de chaque article est indiquée sur sa fiche produit. Dans le cas où un article serait
        confectionné hors de France — notamment pour répondre à des besoins spécifiques de trousseau ou à des
        contraintes techniques particulières — cette information est explicitement mentionnée sur la fiche produit
        concernée.
      </p>
      <p>
        En validant une commande, le Client reconnaît avoir pris connaissance des présentes CGV et les accepter sans
        réserve.
      </p>

      <h2>3. Produits</h2>
      <h3>3.1 Caractéristiques</h3>
      <p>
        Les produits présentés sur la boutique correspondent aux modèles validés par l'établissement scolaire
        partenaire. Les photographies et descriptions sont données à titre illustratif et peuvent légèrement différer
        du produit final sans que cela constitue un défaut.
      </p>
      <h3>3.2 Disponibilité</h3>
      <p>
        Les produits sont fabriqués à la commande dans des ateliers français partenaires de France Uniformes. Ils ne
        sont pas stockés en quantité illimitée. France Uniformes se réserve le droit de limiter les quantités
        disponibles par taille.
      </p>
      <h3>3.3 Recommandations de tailles</h3>
      <p>
        Les recommandations de tailles générées par la plateforme à partir des mensurations saisies sont fournies à
        titre indicatif uniquement. France Uniformes ne saurait être tenu responsable d'un défaut d'ajustement
        résultant de mesures inexactes ou d'une évolution morphologique de l'enfant depuis la dernière mise à jour des
        mensurations.
      </p>

      <h2>4. Commande</h2>
      <h3>4.1 Processus de commande</h3>
      <p>
        La commande est réalisée en ligne via la plateforme boutique. Elle est définitivement enregistrée et transmise
        en fabrication uniquement après :
      </p>
      <ul>
        <li>Sélection des produits et tailles dans le panier ;</li>
        <li>Validation du récapitulatif de commande ;</li>
        <li>Paiement intégral du montant dû (sauf modalité spécifique indiquée sur la boutique).</li>
      </ul>
      <h3>4.2 Confirmation</h3>
      <p>
        Un e-mail de confirmation de commande est envoyé à l'adresse indiquée lors de la création du compte. Cet
        e-mail vaut accusé de réception, mais ne constitue pas une acceptation de la commande par France Uniformes
        jusqu'à confirmation de la mise en fabrication.
      </p>
      <h3>4.3 Annulation</h3>
      <p>
        Toute commande validée et payée est transmise en fabrication. En raison de la nature personnalisée des
        articles (uniformes fabriqués à la commande pour un établissement spécifique), aucune annulation n'est
        possible après validation du paiement, sauf en cas de défaut avéré du produit (article 9).
      </p>

      <h2>5. Prix</h2>
      <h3>5.1 Tarifs</h3>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises (TTC), et correspondent aux tarifs en vigueur au
        moment de la commande. France Uniformes se réserve le droit de modifier ses tarifs à tout moment, notamment en
        raison de l'évolution du coût des matières premières, des conditions de fabrication ou de toute autre
        contrainte économique indépendante de sa volonté. Sauf accord tarifaire spécifique conclu entre France
        Uniformes et l'établissement scolaire partenaire pour une période déterminée, les prix affichés sur la
        boutique sont susceptibles d'évoluer sans préavis. Seul le prix affiché au moment de la validation du panier
        fait foi.
      </p>
      <h3>5.2 Frais de livraison</h3>
      <p>
        <strong>Livraison groupée à l'établissement :</strong> selon l'accord conclu entre France Uniformes et
        l'établissement scolaire partenaire, la livraison groupée peut être incluse dans le prix de vente ou faire
        l'objet d'une participation forfaitaire aux frais de livraison. Le montant applicable (le cas échéant) est
        indiqué sur la boutique au moment de la commande, avant validation du paiement.
      </p>
      <p>
        <strong>Expédition individuelle au domicile :</strong> des frais de port et d'emballage s'ajoutent au prix du
        produit. Leur montant est calculé et affiché au moment de la commande, avant validation du paiement.
      </p>

      <h2>6. Paiement</h2>
      <h3>6.1 Modalités</h3>
      <p>
        Le paiement s'effectue en ligne par carte bancaire via le prestataire de paiement sécurisé PayPlug. Le débit
        est effectué au moment de la validation de la commande.
      </p>
      <p>
        France Uniformes ne stocke aucune donnée bancaire. Les transactions sont entièrement sécurisées par PayPlug
        (protocole SSL/TLS, conformité PCI-DSS).
      </p>
      <h3>6.2 Défaut de paiement</h3>
      <p>
        En cas d'échec ou de refus du paiement, la commande n'est pas enregistrée et aucune fabrication n'est lancée.
        Le Client est invité à renouveler sa tentative de paiement.
      </p>

      <h2>7. Livraison</h2>
      <h3>7.1 Modalités selon l'établissement</h3>
      <p>
        Les modalités de livraison applicables à chaque commande sont déterminées par l'accord passé entre France
        Uniformes et l'établissement scolaire partenaire. Elles sont indiquées sur la boutique concernée au moment de
        la commande et peuvent inclure :
      </p>
      <ul>
        <li>
          <strong>Livraison groupée à l'établissement :</strong> toutes les commandes sont regroupées et livrées en
          une seule fois à l'établissement, qui assure ensuite la distribution aux familles (généralement via
          l'association des parents d'élèves).
        </li>
        <li>
          <strong>Précommande groupée :</strong> les commandes sont regroupées et la fabrication est lancée une fois
          un seuil de commandes atteint. Le Client est informé du délai prévisionnel de livraison au moment de la
          commande.
        </li>
        <li>
          <strong>Expédition individuelle au domicile :</strong> les articles sont expédiés directement à l'adresse
          indiquée par le Client, avec frais de port à sa charge.
        </li>
      </ul>
      <h3>7.2 Délais de fabrication et livraison</h3>
      <p>Les articles étant fabriqués à la commande dans nos ateliers français :</p>
      <ul>
        <li>
          <strong>Délai de fabrication standard :</strong> 10 à 12 semaines à compter de la date de démarrage effectif
          de la fabrication, entendue comme la date à laquelle l'ensemble des éléments nécessaires au lancement ont
          été validés : confirmation de commande, choix définitif des coloris, matières et tissus, et validation des
          bons à tirer (BAT) le cas échéant. Tout retard dans la transmission ou la validation de ces éléments par
          l'établissement ou la famille entraîne un décalage équivalent du délai de fabrication.
        </li>
        <li>
          <strong>Périodes de fermeture :</strong> nos ateliers, comme la quasi-totalité des ateliers de confection
          français et européens, sont fermés pendant les principales périodes de congés (notamment les trois premières
          semaines d'août, les vacances scolaires d'hiver, ainsi que les jours fériés et ponts). Ces périodes ne sont
          pas comptabilisées dans le délai de fabrication et peuvent allonger le délai total de livraison.
        </li>
        <li>
          <strong>Délai réduit :</strong> si le produit commandé est disponible en stock, le délai peut être ramené à
          1 à 2 semaines, voire moins selon les capacités disponibles au moment de la commande.
        </li>
      </ul>
      <p>France Uniformes s'engage à informer le Client de tout retard significatif affectant sa commande.</p>
      <h3>7.3 Dates limites de commande</h3>
      <p>
        Afin de garantir la fabrication et la livraison pour une rentrée scolaire donnée, des dates limites de
        commande peuvent être définies et affichées sur la boutique. Les commandes passées après ces dates seront
        traitées dans la mesure du possible, sans garantie de livraison pour la date souhaitée.
      </p>

      <h2>8. Droit de rétractation</h2>
      <p>
        Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux
        commandes passées sur la présente boutique. Les articles proposés sont fabriqués à la commande selon les
        spécifications validées par l'établissement scolaire partenaire (modèles, coloris, broderies spécifiques) et
        sont nettement personnalisés au sens de la loi : ils ne peuvent être ni revendus ni réaffectés à un autre
        établissement.
      </p>
      <p>
        En cas de défaut avéré (malfaçon, erreur d'expédition, article non conforme à la commande), le Client
        bénéficie des garanties légales prévues aux articles 9 et 10 des présentes CGV.
      </p>

      <h2>9. Garanties légales</h2>
      <h3>9.1 Garantie de conformité</h3>
      <p>
        France Uniformes est tenu de livrer un article conforme au contrat et répond des défauts de conformité
        existant lors de la délivrance. Conformément aux articles L217-4 à L217-14 du Code de la consommation, le
        Client bénéficie d'une garantie légale de conformité de 2 ans à compter de la délivrance de l'article.
      </p>
      <p>
        En cas de défaut de conformité, le Client peut exiger la réparation ou le remplacement de l'article. Si ces
        remèdes sont impossibles ou disproportionnés, le Client peut obtenir une réduction du prix ou la résolution du
        contrat.
      </p>
      <h3>9.2 Garantie contre les vices cachés</h3>
      <p>
        France Uniformes répond des vices cachés de la chose vendue, conformément aux articles 1641 à 1649 du Code
        civil. Le Client peut choisir entre la résolution de la vente ou une réduction du prix de vente.
      </p>

      <h2>10. Service après-vente et réclamations</h2>
      <p>
        En cas de problème constaté sur un article reçu (malfaçon, erreur d'expédition, article manquant, défaut de
        couture, etc.) :
      </p>
      <ul>
        <li>Connectez-vous à votre espace famille sur la boutique ;</li>
        <li>Rendez-vous dans « Mes commandes » ;</li>
        <li>Ouvrez la commande concernée et cliquez sur « Déclarer un incident » à côté de l'article concerné ;</li>
        <li>Sélectionnez la quantité concernée, le type d'incident et décrivez le problème (photos appréciées).</li>
      </ul>
      <p>
        France Uniformes s'engage à traiter les réclamations dans un délai de 10 jours ouvrés. Selon la nature de
        l'incident, une solution de remplacement, un avoir ou un remboursement partiel pourra être proposé.
      </p>
      <p>Aucun article porté, lavé ou endommagé par l'usage ne peut être retourné ni échangé.</p>

      <h2>11. Transfert de propriété</h2>
      <p>
        Le transfert de propriété et de risques intervient à la livraison effective de l'article au Client.
      </p>

      <h2>12. Responsabilité</h2>
      <p>
        France Uniformes ne saurait être tenu responsable des retards ou inexécutions résultant d'un cas de force
        majeure (catastrophe naturelle, grève, pandémie, défaillance d'un fournisseur indépendante de sa volonté,
        etc.).
      </p>
      <p>La responsabilité de France Uniformes est limitée au montant de la commande concernée.</p>

      <h2>13. Données personnelles</h2>
      <p>
        Les données personnelles collectées dans le cadre de la commande (nom, adresse, e-mail, informations enfant)
        sont traitées par France Uniformes pour les finalités suivantes : traitement de la commande, relation client,
        respect des obligations légales. Pour exercer vos droits, consultez notre{" "}
        <Link to="/aide/confidentialite">Politique de confidentialité</Link>{" "}
        ou contactez : <a href="mailto:dpo@franceuniforme.fr">dpo@franceuniforme.fr</a>.
      </p>

      <h2>14. Médiation et règlement des litiges</h2>
      <p>
        En cas de litige non résolu amiablement, le Client peut recourir gratuitement à un médiateur de la
        consommation. France Uniformes adhère au service de médiation du{" "}
        <strong>CM2C — Centre de la Médiation de la Consommation de Conciliateurs de justice</strong>, 49 rue de
        Ponthieu, 75008 Paris —{" "}
        <a href="https://www.cm2c.net" target="_blank" rel="noopener noreferrer">www.cm2c.net</a>.
      </p>
      <p>
        Le Client peut également accéder à la plateforme européenne de résolution en ligne des litiges :{" "}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>
      </p>

      <h2>15. Droit applicable et juridiction</h2>
      <p>
        Les présentes CGV sont soumises au droit français. En cas de litige persistant après tentative de règlement
        amiable, les tribunaux compétents du ressort de Chartres (28000) seront seuls compétents.
      </p>

      <p>
        Pour toute question, contactez-nous à{" "}
        <a href="mailto:info@franceuniforme.fr">info@franceuniforme.fr</a>.
      </p>
    </LegalPageShell>
  );
}