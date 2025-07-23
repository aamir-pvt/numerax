FROM python:3.10-bullseye

# Install OS tools required for building certain packages (osqp, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    cmake \
    curl \
    ca-certificates \
    libcurl4-openssl-dev \
    python3-dev \
    pkg-config \
    libblas-dev \
    liblapack-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*




# Set work directory
WORKDIR /app

# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
