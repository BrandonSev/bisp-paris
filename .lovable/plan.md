# Aligner la gestion famille sur le projet Dax

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
