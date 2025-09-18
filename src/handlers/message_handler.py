from telegram import Update
from telegram.ext import ContextTypes
from .base_handler import BaseHandler
from keyboards import KeyboardBuilder
from message_formatter import MessageFormatter
from config import logger

class MessageHandler(BaseHandler):
    def __init__(self, timezone_service, user_state_manager):
        self.timezone_service = timezone_service
        self.user_state_manager = user_state_manager
    
    async def handle(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        user_id = update.effective_user.id
        text = update.message.text.strip()
        
        state = self.user_state_manager.get_state(user_id)
        if state:
            if state['action'] == 'compare_waiting_first':
                state['city1'] = text
                state['action'] = 'compare_waiting_second'
                self.user_state_manager.set_state(user_id, state)
                keyboard = KeyboardBuilder.time_selection_menu()
                await update.message.reply_text(
                    f"⏰ First city: {text}\nSelect second city:",
                    reply_markup=keyboard,
                    parse_mode=None
                )
                return
            
            elif state['action'] == 'compare_waiting_second':
                city1 = state['city1']
                city2 = text
                self.user_state_manager.clear_state(user_id)
                await self._compare_cities(update, city1, city2)
                return
        
        await self._show_city_time(update, text)
    
    async def _show_city_time(self, update: Update, city: str):
        try:
            current_time = self.timezone_service.get_current_time(city)
            keyboard = KeyboardBuilder.time_actions()
            
            await update.message.reply_text(
                MessageFormatter.city_time(city, current_time),
                reply_markup=keyboard,
                parse_mode=None
            )
        except Exception as e:
            logger.error(f"Failed to get time for {city}: {e}")
            keyboard = KeyboardBuilder.time_selection_menu()
            await update.message.reply_text(
                MessageFormatter.city_not_found(city),
                reply_markup=keyboard,
                parse_mode=None
            )
    
    async def _compare_cities(self, update: Update, city1: str, city2: str):
        try:
            comparison = self.timezone_service.compare_times(city1, city2)
            keyboard = KeyboardBuilder.compare_actions()
            
            await update.message.reply_text(
                MessageFormatter.time_comparison(comparison),
                reply_markup=keyboard,
                parse_mode=None
            )
        except Exception as e:
            logger.error(f"Failed to compare {city1} and {city2}: {e}")
            await update.message.reply_text(MessageFormatter.comparison_error(), parse_mode=None)