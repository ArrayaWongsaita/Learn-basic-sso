# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# ติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมด
COPY . .

# สร้างไฟล์ .env.local สำหรับ build
RUN echo "NEXT_PUBLIC_IDP_URL=http://localhost:4000" > .env.local
RUN echo "NEXT_PUBLIC_CLIENT_ID=client-two" >> .env.local

# Build แอพ
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# ตั้งค่า environment เป็น production
ENV NODE_ENV=production

# คัดลอกไฟล์ที่จำเป็นจาก build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.local ./.env.local
COPY --from=builder /app/node_modules ./node_modules

# เปิดพอร์ต 3001
EXPOSE 3001

# รัน Next.js
CMD ["npm", "start", "--", "-p", "3001"]
