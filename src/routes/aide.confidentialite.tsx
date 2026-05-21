import { createFileRoute } from "@tanstack/react-router";
import { LegalPageShell } from "@/components/LegalPageShell";
import { UnderConstructionPage } from "@/components/UnderConstructionPage";
import { isUnderConstruction } from "@/config/underConstruction";

export const Route = createFileRoute("/aide/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité · BISP" },
      { name: "description", content: "Politique de protection des données personnelles." },
    ],
  }),
  component: ConfidentialitePage,
});

function ConfidentialitePage() {
  const wipTitle = isUnderConstruction("/aide/confidentialite");
  if (wipTitle) return <UnderConstructionPage title={wipTitle} />;
  return (
    <LegalPageShell title="Politique de confidentialité" updatedAt="mai 2026">
      <h2>Données collectées</h2>
      <p>
        Dans le cadre de l'utilisation de la plateforme boutique France Uniformes, nous collectons les données
        suivantes :
      </p>
      <ul>
        <li>
          <strong>Compte famille :</strong> civilité, nom, prénom, adresse e-mail, numéro de téléphone, adresse postale
        </li>
        <li>
          <strong>Profils enfants :</strong> prénom, classe, mensurations (tour de poitrine, tour de taille, tour de
          hanches, hauteur) utilisées pour générer des recommandations de tailles indicatives
        </li>
        <li>
          <strong>Données de commande :</strong> articles commandés, tailles, historique d'achats, mode de livraison
        </li>
        <li>
          <strong>Données de navigation :</strong> aucun cookie n'est utilisé — la session est gérée via le
          localStorage du navigateur
        </li>
      </ul>

      <h2>Finalités et bases légales</h2>
      <ul>
        <li>Gestion du compte famille et traitement des commandes — <em>Exécution du contrat</em></li>
        <li>Livraison des articles — <em>Exécution du contrat</em></li>
        <li>Service après-vente et réclamations — <em>Exécution du contrat</em></li>
        <li>Respect des obligations comptables et fiscales — <em>Obligation légale</em></li>
        <li>Sécurité et bon fonctionnement de la plateforme — <em>Intérêt légitime</em></li>
      </ul>

      <h2>Destinataires des données</h2>
      <p>
        Vos données sont traitées par France Uniformes et partagées uniquement avec les sous-traitants strictement
        nécessaires à l'exécution du service :
      </p>
      <ul>
        <li>
          <strong>OVHcloud SAS</strong> (2 Rue Kellermann, 59100 Roubaix) — hébergement de la plateforme
        </li>
        <li>
          <strong>PayPlug</strong> — traitement des paiements par carte bancaire (données bancaires non stockées par
          France Uniformes)
        </li>
      </ul>
      <p>Vos données ne sont jamais vendues ni transmises à des tiers à des fins commerciales.</p>

      <h2>Durée de conservation</h2>
      <ul>
        <li>
          <strong>Données de compte et de commande :</strong> durée de la relation contractuelle + 3 ans après la
          dernière commande (délai de prescription)
        </li>
        <li>
          <strong>Données comptables :</strong> 10 ans (obligation légale)
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        La plateforme n'utilise aucun cookie. La gestion de session est assurée par le localStorage du navigateur
        (stockage local), qui ne dépose rien sur votre appareil au sens de la réglementation cookies et ne transmet
        aucune donnée à des tiers.
      </p>
      <p>
        Si des cookies venaient à être mis en place à l'avenir (analyse d'audience, performance, etc.), vous en seriez
        informé préalablement et un mécanisme de consentement conforme aux recommandations de la CNIL vous serait
        proposé.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD (Règlement UE 2016/679) et à la loi Informatique et Libertés, vous disposez des droits
        suivants :
      </p>
      <ul>
        <li><strong>Accès :</strong> obtenir une copie de vos données</li>
        <li><strong>Rectification :</strong> corriger des données inexactes</li>
        <li><strong>Suppression :</strong> demander l'effacement de vos données</li>
        <li><strong>Portabilité :</strong> recevoir vos données dans un format structuré</li>
        <li><strong>Limitation :</strong> restreindre temporairement leur traitement</li>
        <li><strong>Opposition :</strong> vous opposer à certains traitements</li>
      </ul>
      <p>
        Pour exercer ces droits :{" "}
        <a href="mailto:dpo@franceuniforme.fr">dpo@franceuniforme.fr</a>
      </p>
      <p>
        En cas de réclamation non résolue, vous pouvez saisir la CNIL :{" "}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
      </p>
    </LegalPageShell>
  );
}