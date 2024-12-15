# Utiliser une image de base de Node.js v20
FROM node:20-alpine

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Copier le reste des fichiers du projet
COPY . .

# Compiler l'application pour la production
RUN npm run build

# Étape 2 : Image finale pour l'exécution
FROM node:20-alpine AS runner
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour exécuter l'application
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Définir les variables d'environnement

# Exposer le port pour le serveur HTTP
EXPOSE 3030

# Utiliser le serveur HTTP pour servir l'application React
CMD ["serve", "-s", "build", "-l", "3030"]
