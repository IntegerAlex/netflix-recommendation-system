# Use Node.js 20 with Debian Bookworm slim as the base image
FROM node:20-bookworm-slim

# Install dependencies for both Node.js and Python
RUN apt-get update && \
    apt-get install -y \
    python3 \
    python3-venv \
    python3-dev \
    gcc \
    g++ \
    make

# Set working directory
WORKDIR /app

# Copy Node.js dependencies and install
COPY package*.json ./
RUN npm install --quiet --no-progress --no-fund --audit=false --unsafe-perm

# Copy application files
COPY . .

# TypeScript compilation (if needed)
# Replace index.ts and helper.ts with your TypeScript files
RUN npx tsc index.ts helper.ts

# Create and activate Python virtual environment
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"
# RUN source ~/venv/bin

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Expose port (if needed)
EXPOSE 8080

# Set environment variable (if needed)
ENV OMDB_API_KEY=

# Command to start the Node.js application
CMD ["node", "index.js"]
