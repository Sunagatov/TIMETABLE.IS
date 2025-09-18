from ui import KeyboardBuilder, MessageFormatter

class MenuHandler:
    def __init__(self, timezone_service, user_state_manager):
        self.timezone_service = timezone_service
        self.user_state_manager = user_state_manager
    
    async def handle_get_time(self, query):
        keyboard = KeyboardBuilder.time_selection_menu()
        await query.edit_message_text(
            "🕐 Get Time - Choose an option:",
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def handle_compare_time(self, query, user_id):
        self.user_state_manager.set_state(user_id, {'action': 'compare_waiting_first'})
        keyboard = KeyboardBuilder.time_selection_menu()
        await query.edit_message_text(
            "⏰ Compare Times - Select first city:",
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def handle_main_menu(self, query):
        keyboard = KeyboardBuilder.main_menu()
        await query.edit_message_text(
            MessageFormatter.welcome_message(),
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def handle_popular_cities(self, query):
        cities = self.timezone_service.get_popular_cities()
        keyboard = KeyboardBuilder.popular_cities(cities)
        await query.edit_message_text(
            "🌟 Popular Cities:",
            reply_markup=keyboard,
            parse_mode=None
        )