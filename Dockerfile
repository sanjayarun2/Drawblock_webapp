# 1. Use an official lightweight Python image
FROM python:3.10-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. CRITICAL: Install system dependencies for CairoSVG
# FIX: Changed 'libgdk-pixbuf2.0-0' to 'libgdk-pixbuf-2.0-0' (added dash)
# FIX: This is the correct package name for Debian Bookworm (used by python:3.10-slim)
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

# 4. Copy the requirements file and install Python libraries
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy the rest of your application code
COPY . .

# 6. Expose the port the app runs on
EXPOSE 8000

# 7. Command to run the application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]