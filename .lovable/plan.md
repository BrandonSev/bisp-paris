# Reprise de la logique du projet "Saint-Jacques-de-Compostelle - Dax" vers BISP

Objectif : adapter **toute la logique métier** du projet Dax au projet BISP **sans toucher aux visuels actuels** (SiteHeader, cards, couleurs, layout, pages déjà stylées). On garde le design system BISP intact. Tout est livré en **phases validées une par une** — on n'avance à la phase suivante qu'après ton OK et un test rapide.

## Hypothèses

- Données existantes conservées (migrations additives uniquement, aucune table cassée).
- Adaptation visuelle minimale tolérée uniquement pour les nouveaux champs/sections inévitables (ex. ajout d'une option de livraison dans le panier), toujours dans ton style actuel.
- Le nom de l'établissement, l'adresse de retrait et les couleurs PDF resteront BISP (pas Saint-Jacques).

## Plan par phases (chacune = un message + un commit logique)

### Phase 1 — Foundation panier serveur + mesures enrichies enfants
- Migration : table `cart_items` (panier persistant en DB, fusion avec localStorage à la connexion).
- Migration : nouvelles colonnes `children` : `tour_taille`, `tour_bassin`, `genre`.
- Adapter `src/lib/store.tsx` : panier serveur, fusion local→DB, purge des items orphelins, types `Child` enrichis.
- Pas de changement visuel ; le store gère tout en arrière-plan.

### Phase 2 — Recommandation de taille + guide tailles
- `src/lib/sizeRecommendation.ts` (table officielle + algorithme).
- Composant `SizeBadge` (badge discret affichable dans les formulaires enfant).
- Branchement dans la page Enfants existante (affichage d'une suggestion sous les mesures) — **sans refondre le formulaire**.
- Nouvelle route `/aide/guide-tailles` (tableau de tailles).

### Phase 3 — Historique d'achat par enfant
- `src/lib/purchaseHistory.ts` (fetch + seuils de remplacement par catégorie produit).
- Nouvelle route `/enfants/$childId/historique` (liste des produits achetés, dates, suggestion "à remplacer").
- Composant léger `PurchaseHistoryPreview` (utilisé en option sur la fiche enfant).

### Phase 4 — Pages d'aide statiques
- Routes : `/aide/cgv`, `/aide/cgu`, `/aide/mentions-legales`, `/aide/confidentialite`, `/aide/livraison`, `/aide/contact`.
- Contenu adapté au contexte BISP (raison sociale, adresse, contact à confirmer avec toi).
- Reprise du markup mais habillage avec ton `SiteHeader` actuel.

### Phase 5 — Options de livraison + checkout enrichi
- Migration : table `delivery_options` (code, label, description, active, position).
- Migration : colonnes `orders` : `shipping_mode`, `shipping_recipient`, `shipping_address`, `shipping_postal`, `shipping_city`, `shipping_label`, `paid_at`, `tracking_number`, `tracking_carrier`.
- `src/config/featureFlags.ts` (toggle livraison domicile/établissement).
- `src/lib/deliveryOptions.ts` (filtrage + fallback).
- Adaptation `panier.tsx` : modal de confirmation avec choix livraison (home/pickup), reprise du code Dax mais conservation de ton UI panier actuelle.

### Phase 6 — Génération PDF de commande
- Dépendance : `jspdf` + `jspdf-autotable`.
- `src/lib/orderPdf.ts` adapté aux couleurs et mentions BISP (au lieu de France Uniformes / Saint-Jacques).
- Bouton "Télécharger PDF" dans `/commandes` et `/admin`.

### Phase 7 — Reset password complet
- Route publique `/mot-de-passe-oublie` (formulaire envoi e-mail).
- Route publique `/reset-password` (formulaire nouveau mot de passe, vérifie `type=recovery`).
- Lien "Mot de passe oublié" sur `/login`.

### Phase 8 — Espace famille + parents multiples
- Migration : table `family_parents` (plusieurs parents par compte, adresse de livraison alternative).
- Route `/famille` (gestion des parents, adresse de livraison par défaut).
- Extension `profiles` : `family_name`, `code_etablissement`.

### Phase 9 — Paiement en ligne PayPlug (optionnel — à confirmer)
- Server functions `src/server/payplug.functions.ts` + `payplug.server.ts`.
- Route `/commandes/retour-paiement` (callback après paiement).
- Webhook `src/routes/api/public/payplug-webhook.ts` (notification IPN).
- Secret requis : `PAYPLUG_SECRET_KEY` + `PUBLIC_APP_URL`.
- ⚠️ Question : tu veux PayPlug, ou plutôt **Stripe** (intégré nativement à Lovable Cloud) ?

### Phase 10 — Emails transactionnels (optionnel — à confirmer)
- Infrastructure email (domaine vérifié requis).
- Templates : confirmation commande, mise à jour statut, reset password.
- Server functions `src/server/email.functions.ts`.
- ⚠️ Requiert un domaine vérifié pour l'envoi.

### Phase 11 — Admin enrichi
- Reprendre tableau admin Dax : mise à jour statut commande, gestion incidents, gestion rôles APEL.
- Conservation de ton admin actuel + ajout des sections.

### Phase 12 — Feature flags + segmentation établissement
- `src/config/featureFlags.ts` étendu (multi-tenant léger).
- `establishment.functions.ts` pour préparer la migration vers template maître.

## Phases que je propose de **NE PAS reprendre** (spécifique à Saint-Jacques)

- Routes `/maternelle`, `/college`, `/lycee`, `/blouse-officielle`, `/apel` → BISP a déjà sa boutique structurée différemment (UK/FR + Petite Section/Nursery). On les ignore sauf demande explicite.
- Composants visuels Dax : `AuthHeroBackground`, `DirectorQuote`, `HeadteacherQuote`, `FrenchFlag`, `PageWatermark` → ne s'intègrent pas à ton style actuel BISP.
- Charte PDF "France Uniformes" → remplacée par les couleurs/mentions BISP.

## Ordre de livraison recommandé

On commence par **Phase 1** (foundation panier serveur) car elle débloque tout le reste sans rien casser visuellement. Puis Phases 2, 3, 4 en série (faciles et sans impact visuel). Ensuite décision sur 5–10 selon priorités business.

## Questions ouvertes (à valider avant Phase 5 et au-delà)

1. **Paiement** : PayPlug (comme Dax) ou Stripe (recommandé sur Lovable) ?
2. **Emails** : as-tu un domaine vérifié à disposition (ex. `bisp.fr`) ?
3. **PDF** : couleurs BISP à utiliser (hex précis du primary/navy/accent) ?
4. **Adresse de retrait** : adresse exacte de la BISP pour le mode "pickup" et le PDF.
5. **Pages d'aide** : raison sociale, SIRET, contact pour CGV/mentions légales.

## Démarrage

Si tu valides ce plan, je commence par la **Phase 1** (migration + adaptation du store). Je te ping après chaque phase pour test + validation avant de passer à la suivante.