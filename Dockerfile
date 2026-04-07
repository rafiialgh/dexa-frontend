FROM node:22 as build

ARG MODE

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN ls -R /app/src/components/
RUN echo "Building Frontend with MODE: $MODE"
RUN npm run build -- --mode $MODE

FROM nginx:alpine as production

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]