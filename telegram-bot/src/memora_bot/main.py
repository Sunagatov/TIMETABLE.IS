from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes
from .config import load_settings


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(
            "Memora bot starter is running. "
            "Real ingestion flow will forward accepted messages to backend."
        )


def main() -> None:
    settings = load_settings()
    app = Application.builder().token(settings.bot_token).build()
    app.add_handler(CommandHandler("start", start))
    app.run_polling()


if __name__ == "__main__":
    main()
