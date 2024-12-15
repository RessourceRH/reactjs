# Utiliser une image de base de Node.js v20
FROM node:20-alpine

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Compiler l'application pour la production
RUN npm run build

# Installer un serveur HTTP léger pour servir l'application
RUN npm install -g serve

# Exposer le port pour le serveur HTTP
EXPOSE 3030

# Utiliser le serveur HTTP pour servir l'application React
CMD ["serve", "-s", "build", "-l", "3030"]
