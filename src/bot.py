from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackQueryHandler
from telegram import Update
from telegram.ext import ContextTypes
from config import BOT_TOKEN, logger
from handlers import BotHandlers

class TimeBot:
    def __init__(self):
        self.app = Application.builder().token(BOT_TOKEN).build()
        self.handlers = BotHandlers()
        self._setup_handlers()
        self.app.add_error_handler(self._error_handler)
    
    def _setup_handlers(self):
        self.app.add_handler(CommandHandler("start", self.handlers.start))
        self.app.add_handler(CommandHandler("help", self.handlers.help))
        self.app.add_handler(CommandHandler("time", self.handlers.get_time))
        self.app.add_handler(CommandHandler("diff", self.handlers.time_diff))
        self.app.add_handler(CallbackQueryHandler(self.handlers.button_handler))
        self.app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handlers.handle_message))
    
    async def _error_handler(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        logger.error(f"Exception while handling update: {context.error}")
    
    def run(self):
        logger.info("Starting TimeBot...")
        try:
            self.app.run_polling(allowed_updates=None, drop_pending_updates=True)
        except KeyboardInterrupt:
            logger.info("Bot stopped by user")
        except Exception as e:
            logger.error(f"Bot error: {e}")