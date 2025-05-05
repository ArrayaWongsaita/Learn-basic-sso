# Build stage
FROM node:18-alpine as build

WORKDIR /app

# ติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมด
COPY . .

# สร้างไฟล์ .env ถ้ายังไม่มี
RUN echo "VITE_IDP_URL=http://localhost:4000" > .env
RUN echo "VITE_CLIENT_ID=client-one" >> .env

# Build แอพ
RUN npm run build

# Production stage
FROM nginx:alpine

# คัดลอกไฟล์ที่ build แล้วไปยัง nginx
COPY --from=build /app/dist /usr/share/nginx/html

# คัดลอกไฟล์ config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
