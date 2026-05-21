# Porter l'administration complète du projet Dax vers BISP

## Objectif

Reproduire à l'identique l'espace administrateur du projet « Saint-Jacques de
Compostelle — Dax » dans BISP : tableau commandes, suivi & expédition,
gestion des incidents (avec photos), gestion des rôles, et l'espace APEL de
suivi des familles + relance email.

## État actuel BISP vs cible Dax

| Élément | BISP actuel | Cible Dax |
|---|---|---|
| Onglets admin | Commandes / Suivi / Incidents (light) / Rôles (light) | Commandes / Suivi & expédition / Incidents (photos) / Rôles / lien vers APEL |
| `order_incidents` | id, order_id, type, description, status, created_by, resolution_note, resolved_at | + order_item_id, user_id, incident_type, description, quantity, eligible, photos[], updated_at |
| Storage `incident-photos` | absent | bucket privé + RLS |
| Page `/apel` | absente | suivi familles + relance email (admin + apel) |
| RPC `apel_families_overview` | absente | vue agrégée par famille |
| `useStore().isApel` | absent | présent |
| Email `apel-reminder` | absent | template + registry |
| Server fns | quelques unes | `apel.functions.ts`, `email.functions.ts` (status, incidents, apel) |

## Plan d'exécution

### 1. Migration DB (un seul script)

- Étendre `order_incidents` : `order_item_id uuid`, `user_id uuid`, `incident_type text`, `quantity int default 1`, `eligible boolean default false`, `photos text[] default '{}'`, `updated_at timestamptz default now()`. Conserver les colonnes existantes (compat) ; backfill `incident_type` ← `type`, `user_id` ← `created_by`.
- Trigger `set_updated_at` sur `order_incidents`.
- RLS additionnelle : la famille peut INSERT ses propres incidents.
- Ajouter `delivered_at timestamptz` sur `orders`.
- Créer le bucket privé `incident-photos` + policies (lecture admin/apel + owner, upload owner).
- Créer la fonction `public.apel_families_overview(_season_start date)` (SECURITY DEFINER, accessible uniquement aux rôles admin/apel via vérification dans la fonction appelante).

### 2. Code applicatif (port depuis Dax, adapté aux conventions BISP)

Conventions BISP : server fns dans `src/lib/*.functions.ts` (pas `src/server/`),
middleware déjà câblé via `attachSupabaseAuth` dans `src/start.ts`.

- `src/lib/apel.functions.ts` — `apelListFamilies`, `sendApelReminders`, `setUserRole`, `listRoleAssignments`.
- Étendre `src/lib/email-helpers.functions.ts` (ou créer `src/lib/admin-email.functions.ts`) avec `sendOrderStatusUpdate`, `sendIncidentUpdate`, `sendIncidentNotifications`.
- `src/lib/email-templates/apel-reminder.tsx` + enregistrement dans `registry.ts`.
- `src/lib/store.tsx` — ajouter `isApel` (chargement parallèle du rôle `apel`).
- `src/routes/admin.tsx` — réécrire pour porter les 4 onglets Dax + modal incident avec photos signées.
- `src/routes/apel.tsx` — créer la page APEL complète (filtres, recherche, sélection multiple, relance email, export CSV).
- Adapter les libellés école : `BISP` au lieu de `Saint-Jacques`.

### 3. Vérifications

- Build TanStack ne casse pas (route APEL + admin compilent).
- Bucket `incident-photos` créé, policies en place.
- Connexion admin existante → onglets visibles, RPC `apel_families_overview` répond.
- Le rôle `apel` (déjà présent dans `app_role`) est lu côté store.

## Risques / limites

- Les incidents existants en base BISP (s'il y en a) seront conservés mais avec `incident_type` = ancien `type` et `quantity = 1` par défaut.
- L'upload de photos d'incident côté famille n'est pas dans ce lot (UI famille inchangée) — la modal admin sait les afficher si des photos sont déposées plus tard.
- Si vous voulez aussi le formulaire famille de déclaration d'incident avec upload photos, le préciser : c'est un lot suivant.


## État des lieux

**Création de compte (signup)** — Dans Dax comme dans BISP, le signup **ne crée pas** d'entrée `family_parents`. Le trigger `handle_new_user` ne remplit que `profiles`. La différence visible est dans la page **Ma famille** :

- **Dax** : si aucun parent n'existe, affiche une carte "draft" **pré-remplie avec les données du profil** (civilité, prénom, nom, email, téléphone, adresse). À la première sauvegarde → insertion réelle dans `family_parents` avec `is_primary = true`.
- **BISP actuel** : affiche "Aucun parent enregistré" → l'utilisateur doit tout ressaisir manuellement.

C'est ce qui donne l'impression que "le parent n'a pas été créé automatiquement".

## Écarts à corriger

### 1. Schéma `family_parents`
| Champ | BISP actuel | Dax (cible) |
|---|---|---|
| rôle du parent | `lien` | `role` |
| livraison par défaut | `is_default_shipping` | `is_shipping_default` |
| parent principal | absent | `is_primary` |
| adresse alternative | absent | `has_alt_shipping`, `shipping_label`, `shipping_adresse`, `shipping_code_postal`, `shipping_ville` |

→ migration : renommer `lien` → `role`, renommer `is_default_shipping` → `is_shipping_default`, ajouter `is_primary` + 5 colonnes shipping alternatif.

### 2. Store (`src/lib/store.tsx`)
- Ajouter le type `FamilyParent` complet et l'état `parentList`.
- Exposer `parents`, `addParent`, `updateParent`, `removeParent` (mêmes signatures que Dax, incluant unicité de `is_shipping_default` et garde anti-doublon email).
- Charger les parents au login (`loadParents`).

### 3. Page `src/routes/famille.tsx`
Réécriture pour reprendre la structure Dax :
- Bloc "Nom de la famille" indépendant.
- Bloc "Code établissement" en lecture seule (déjà en place — conservé).
- Si `parents.length === 0` → **carte draft pré-remplie depuis le profil** avec `is_primary: true, is_shipping_default: true`. Sauvegarde = `addParent(patch)`.
- Liste des parents existants avec `ParentCard` (édition inline, rôles prédéfinis, civilité, contacts, adresse, option "adresse de livraison alternative").
- Bouton "Ajouter un membre" en bas.
- Aside "Mes enfants" avec lien vers `/enfants`.

### 4. Composant `ParentCard`
Porté tel quel depuis Dax (form inline, gestion `roleSelect`/`roleCustom`, héritage de l'adresse principale pour les parents secondaires, toggle adresse alternative).

### 5. Code appelant `is_default_shipping` / `lien`
Recherche + remplacement dans le reste du code (panier/checkout notamment).

## Plan d'exécution

1. **Migration SQL** (renommages + ajouts de colonnes, préservation des données existantes).
2. Mise à jour du `store.tsx` (type + actions + chargement).
3. Réécriture de `famille.tsx` + portage de `ParentCard`.
4. Mise à jour des références résiduelles (`lien`, `is_default_shipping`) dans le reste du code.
5. Vérification : signup → la page famille affiche bien la carte pré-remplie avec les infos saisies à l'inscription.

## Détails techniques

- La migration garde les données : `ALTER TABLE … RENAME COLUMN`, puis `ADD COLUMN … DEFAULT false`.
- Le premier parent rétroactif (s'il existe déjà) sera marqué `is_primary = true` via une mise à jour basée sur `position = 0`.
- Pas de changement au trigger `handle_new_user` — la logique "pré-remplissage" reste côté UI comme dans Dax.
