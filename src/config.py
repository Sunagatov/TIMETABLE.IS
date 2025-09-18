import os
import logging
from dotenv import load_dotenv

load_dotenv()

# Bot configuration
BOT_TOKEN = os.getenv("BOT_TOKEN")

# Logging configuration
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Suppress verbose third-party logs
logging.getLogger('httpx').setLevel(logging.WARNING)

# Validate token
if not BOT_TOKEN:
    logger.error("BOT_TOKEN environment variable not set")
    raise ValueError("BOT_TOKEN is required")