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

# Exposer le port sur lequel l'application sera exécutée
EXPOSE 3131

# Démarrer l'application
CMD ["npm", "start"]