# Base Image
FROM node:20-alpine

# Working Directory
WORKDIR /app

# Install PNPM (Kyunki aap pnpm use kar rahe ho)
RUN npm install -g pnpm

# Copy Package Files
COPY package.json pnpm-lock.yaml* ./

# Install Dependencies
RUN pnpm install

# Copy Full Code
COPY . .

# Build the Server (TypeScript to JS)
RUN pnpm run build:server

# Hugging Face Spaces port 7860 use karta hai
ENV PORT=7860
EXPOSE 7860

# Create a non-root user (Security Requirement for HF)
RUN adduser -D -u 1000 hfuser
RUN chown -R hfuser:hfuser /app
USER hfuser

# Start Command
CMD ["pnpm", "run", "start:server"]