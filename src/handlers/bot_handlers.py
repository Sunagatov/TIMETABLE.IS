from telegram import Update
from telegram.ext import ContextTypes
from services import TimezoneService
from .command_handler import CommandHandler
from .callback_handler import CallbackHandler
from .message_handler import MessageHandler
from state import UserStateManager

class BotHandlers:
    def __init__(self):
        self.timezone_service = TimezoneService()
        self.user_state_manager = UserStateManager()
        self.command_handler = CommandHandler(self.timezone_service)
        self.callback_handler = CallbackHandler(self.timezone_service, self.user_state_manager)
        self.message_handler = MessageHandler(self.timezone_service, self.user_state_manager)
    
    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await self.command_handler.start(update, context)
    
    async def help(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await self.command_handler.help(update, context)
    
    async def get_time(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await self.command_handler.start(update, context)
    
    async def time_diff(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await self.command_handler.start(update, context)
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await self.message_handler.handle(update, context)
    
    async def button_handler(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await self.callback_handler.handle(update, context)