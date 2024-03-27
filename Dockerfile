FROM node:20-bookworm-slim
# Install dependencies for both Node.js and Python
RUN apt-get update && \
apt-get install -y \
python3 \
python3-venv \
python3-dev \
gcc \
g++ \
make \
nodejs

# Set working directory
WORKDIR /app

# Copy Node.js dependencies and install
COPY package*.json ./
RUN npm install --quiet --no-progress --no-fund --audit=false --unsafe-perm

# Copy application files
COPY . .

# TypeScript compilation
RUN npx tsc index.ts helper.ts

# Create and activate Python virtual environment
RUN python3 -m venv /venv
# Install Python dependencies
RUN /bin/bash -c "source /venv/bin/activate \
    && pip install --no-cache-dir pandas scikit-learn" 

# Expose port
EXPOSE 8080

# Set environment variable
ENV OMDB_API_KEY=

# Command to start the Node.js application
CMD ["node", "index.js"]
