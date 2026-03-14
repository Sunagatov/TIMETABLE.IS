# =============================================================================
# BUILD STAGE
# =============================================================================
FROM python:3.12-slim AS build

WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# =============================================================================
# RUNTIME STAGE
# =============================================================================
FROM python:3.12-slim

# Metadata
LABEL maintainer="TIMETABLE.IS Team" \
      description="Telegram Time Bot"

WORKDIR /app

# Copy installed dependencies from build stage
COPY --from=build /root/.local /root/.local

# Copy application code
COPY src/ ./src/

# Set Python path
ENV PYTHONPATH=/app
ENV PATH=/root/.local/bin:$PATH

# Run the bot
CMD ["python", "src/time_bot.py"]
