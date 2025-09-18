from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackQueryHandler
from config import BOT_TOKEN, logger
from handlers import BotHandlers

class TimeBot:
    def __init__(self):
        self.app = Application.builder().token(BOT_TOKEN).build()
        self.handlers = BotHandlers()
        self._setup_handlers()
    
    def _setup_handlers(self):
        self.app.add_handler(CommandHandler("start", self.handlers.start))
        self.app.add_handler(CommandHandler("help", self.handlers.help))
        self.app.add_handler(CommandHandler("time", self.handlers.get_time))
        self.app.add_handler(CommandHandler("diff", self.handlers.time_diff))
        self.app.add_handler(CallbackQueryHandler(self.handlers.button_handler))
        self.app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handlers.handle_message))
    
    def run(self):
        logger.info("Starting TimeBot...")
        self.app.run_polling(allowed_updates=None)