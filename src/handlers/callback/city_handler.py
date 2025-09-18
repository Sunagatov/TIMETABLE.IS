from ui import KeyboardBuilder, MessageFormatter
from config import logger

class CityHandler:
    def __init__(self, timezone_service, user_state_manager):
        self.timezone_service = timezone_service
        self.user_state_manager = user_state_manager
    
    async def handle_city_selection(self, query, data, user_id):
        city = data[5:].replace("_", " ")
        
        state = self.user_state_manager.get_state(user_id)
        if state:
            if state['action'] == 'compare_waiting_first':
                state['city1'] = city
                state['action'] = 'compare_waiting_second'
                self.user_state_manager.set_state(user_id, state)
                keyboard = KeyboardBuilder.time_selection_menu()
                await query.edit_message_text(
                    f"⏰ First city: {city}\nSelect second city:",
                    reply_markup=keyboard,
                    parse_mode=None
                )
                return
            
            elif state['action'] == 'compare_waiting_second':
                city1 = state['city1']
                self.user_state_manager.clear_state(user_id)
                await self._compare_cities_from_callback(query, city1, city)
                return
        
        await self._show_city_time_from_callback(query, city)
    
    async def _show_city_time_from_callback(self, query, city: str):
        try:
            current_time = self.timezone_service.get_current_time(city)
            keyboard = KeyboardBuilder.time_actions()
            
            await query.edit_message_text(
                MessageFormatter.city_time(city, current_time),
                reply_markup=keyboard,
                parse_mode=None
            )
        except Exception as e:
            logger.error(f"Failed to get time for {city}: {e}")
            keyboard = KeyboardBuilder.time_selection_menu()
            await query.edit_message_text(
                MessageFormatter.city_not_found(city),
                reply_markup=keyboard,
                parse_mode=None
            )
    
    async def _compare_cities_from_callback(self, query, city1: str, city2: str):
        try:
            comparison = self.timezone_service.compare_times(city1, city2)
            keyboard = KeyboardBuilder.compare_actions()
            
            await query.edit_message_text(
                MessageFormatter.time_comparison(comparison),
                reply_markup=keyboard,
                parse_mode=None
            )
        except Exception as e:
            logger.error(f"Failed to compare {city1} and {city2}: {e}")
            await query.edit_message_text(MessageFormatter.comparison_error(), parse_mode=None)