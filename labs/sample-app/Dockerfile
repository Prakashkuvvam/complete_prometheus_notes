# ──────────────────────────────────────────────
# Sample App Dockerfile — PCA Study Lab
# ──────────────────────────────────────────────
# Uses multi-stage build for smaller final image

# ── Build Stage ──
FROM python:3.11-slim AS builder

WORKDIR /app

# Copy requirements first for better layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Runtime Stage ──
FROM python:3.11-slim AS runtime

# Create non-root user
RUN addgroup --system app && \
    adduser --system --ingroup app app

WORKDIR /app

# Copy only required Python packages (not pip cache)
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY app.py .

# Run as non-root user
USER app

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')" || exit 1

# Run the application
CMD ["python", "app.py"]
