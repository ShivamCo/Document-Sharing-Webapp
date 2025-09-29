FROM node:alpine

# ENV DEBIAN_FRONTEND=noninteractive


# RUN apt-get update && apt-get install -y curl gnupg && \
#     curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
#     apt-get install -y nodejs && \
#     apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app


COPY package*.json ./
RUN npm install


COPY . .

ENV PORT=8080

EXPOSE 8080
CMD ["npm", "start"]
