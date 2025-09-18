from telegram import Update
from telegram.ext import ContextTypes
from .base_handler import BaseHandler
from keyboards import KeyboardBuilder
from message_formatter import MessageFormatter

class CommandHandler(BaseHandler):
    def __init__(self, timezone_service):
        self.timezone_service = timezone_service
    
    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        keyboard = KeyboardBuilder.main_menu()
        await update.message.reply_text(
            MessageFormatter.welcome_message(),
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def help(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        keyboard = KeyboardBuilder.main_menu()
        await update.message.reply_text(
            MessageFormatter.help_message(),
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def handle(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        pass