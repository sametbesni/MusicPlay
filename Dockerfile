# Dockerfile
FROM node:14

# Çalışma dizinini ayarla
WORKDIR /app

# Paket dosyalarını kopyala ve bağımlılıkları yükle
COPY package*.json ./
RUN npm install

# Uygulama kodunu kopyala
COPY . .

# Uygulamanın çalışacağı portu belirt
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "server.js"]