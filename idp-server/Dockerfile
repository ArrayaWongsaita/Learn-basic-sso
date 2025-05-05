FROM node:18-alpine

WORKDIR /app

# ติดตั้ง dependencies ก่อน (เพื่อใช้ประโยชน์จาก Docker layer caching)
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมด
COPY . .

# สร้างไฟล์ .env ถ้ายังไม่มี
RUN if [ ! -f .env ]; then \
  echo "JWT_SECRET=docker-dev-secret" > .env; \
  fi

EXPOSE 4000

CMD ["npm", "start"]
