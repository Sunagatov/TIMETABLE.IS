from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    bot_token: str
    backend_base_url: str
    owner_telegram_user_id: str


def load_settings() -> Settings:
    return Settings(
        bot_token=os.environ.get("TELEGRAM_BOT_TOKEN", ""),
        backend_base_url=os.environ.get("BACKEND_BASE_URL", "http://localhost:8080"),
        owner_telegram_user_id=os.environ.get("OWNER_TELEGRAM_USER_ID", "")
    )
