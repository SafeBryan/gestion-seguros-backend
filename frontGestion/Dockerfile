# Imagen base con Node.js
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar los archivos estáticos generados
COPY ./dist/front-gestion/browser ./dist

# Instala un servidor HTTP simple
RUN npm install -g http-server

# Expone el puerto 8080 (puedes usar otro si prefieres)
EXPOSE 8080

# Comando para servir la aplicación
CMD ["http-server", "dist", "-p", "8080", "-c-1"]
