# Sử dụng image Node.js chính thức
FROM node:20.15.0

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependency
RUN npm install

# Copy toàn bộ project vào thư mục làm việc
COPY . .

# Build ứng dụng
RUN npm run build

# Expose port 3000 để có thể truy cập ứng dụng từ bên ngoài
EXPOSE 3000

# Command để chạy ứng dụng
CMD ["npm", "run", "start:prod"]
