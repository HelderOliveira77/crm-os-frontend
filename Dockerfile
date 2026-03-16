FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# Vital para o Vite ser acessível fora do Docker
CMD ["npm", "run", "dev", "--", "--host"]