# Vesper Vale

Boutique statique de pré-lancement pour Vesper Vale, maison anonyme de streetwear dark romantic, exclusivement hoodies et sweatshirts unisexes. Prix prévus : sweatshirt 59 €, hoodie 69 €, édition spéciale 79 € TTC, livraison en sus. Trois références sont au lancement; trois concepts restent non vendables. Le paiement est désactivé.

## Aperçu local

Ouvrir `index.html` dans un navigateur ou lancer un serveur statique depuis ce dossier : `python3 -m http.server 8000`. La boutique est alors accessible sur `http://localhost:8000`.

## Dossiers

- `index.html`, `styles.css`, `app.js` : boutique sans dépendance de build.
- `assets/mark.svg` : emblème Scorpion et favicon.
- `assets/stock/` et `IMAGE_SOURCES.md` : images d'archive d'ambiance et crédits; elles ne montrent pas les produits.
- `pages/` : pages éditoriales et documents de vente à compléter.
- `BRAND_BOOK.md`, `CATALOGUE.md`, `VISUELS.md` : identité, six concepts dont trois au lancement, briefs d'images.
- `MARKETING.md`, `SOCIAL_MEDIA.md`, `VIDEO_PROMPTS.md`, `EMAIL_MARKETING.md` : lancement et contenus.
- `FOURNISSEURS.md`, `FINANCES.md`, `CHECKLIST.md` : fabrication, calculs et opérations requises.

## Avant toute vente

1. Vérifier la disponibilité de Vesper Vale auprès de l'INPI, de l'EUIPO, des registres nationaux et des domaines/réseaux concernés. Ce nom n'a pas été vérifié ni réservé.
2. Obtenir et tester des échantillons, devis, composition, grammage, tolérances, conformité et autorisations des motifs.
3. Renseigner l'entreprise, l'adresse, les contacts, l'immatriculation, les délais et politiques dans les pages légales et de service ; faire relire les documents pour les marchés desservis.
4. Choisir domaine, hébergement, transporteur, outil newsletter et solution de paiement. Le panier actuel ne transmet pas de commande et le paiement n'est pas branché.
5. Valider les coûts réels par SKU selon les plafonds de `FINANCES.md`.
6. Photographier les prototypes approuvés : les images d'archive du site sont des références éditoriales et non des photos produit.

## Architecture de paiement recommandée

Pour un lancement sans abonnement mensuel inutile, conserver le site statique et ajouter une fonction serveur (Cloudflare Workers, Netlify Functions ou équivalent) qui valide le SKU, prix, taille et disponibilité côté serveur, puis crée une session Stripe Checkout. Ne jamais placer de secret Stripe dans `app.js`. Configurer `STRIPE_SECRET_KEY` côté serveur, les trois prix, le port, les URL de retour, les webhooks signés et les taxes avec un professionnel. Utiliser uniquement des clés de test jusqu'à validation complète. Prévoir un vrai service backend pour le stock, les confirmations, remboursements et données personnelles.

Le compte Stripe, le domaine, la société vendeuse, les prix taxes/livraison, les clés, le suivi et les intégrations restent à fournir par le propriétaire. Aucun n'est créé ou connecté ici.