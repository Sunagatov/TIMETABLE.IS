from telegram import Update
from telegram.ext import ContextTypes
from .base_handler import BaseHandler
from .callback import MenuHandler, ContinentHandler, CityHandler

class CallbackHandler(BaseHandler):
    def __init__(self, timezone_service, user_state_manager):
        self.menu_handler = MenuHandler(timezone_service, user_state_manager)
        self.continent_handler = ContinentHandler(timezone_service)
        self.city_handler = CityHandler(timezone_service, user_state_manager)
    
    async def handle(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        query = update.callback_query
        await query.answer()
        
        data = query.data
        user_id = update.effective_user.id
        
        if data == "get_time":
            await self.menu_handler.handle_get_time(query)
        elif data == "compare_time":
            await self.menu_handler.handle_compare_time(query, user_id)
        elif data == "main_menu":
            await self.menu_handler.handle_main_menu(query)
        elif data == "popular_cities":
            await self.menu_handler.handle_popular_cities(query)
        elif data == "continents":
            await self.continent_handler.handle_continents(query)
        elif data.startswith("continent_"):
            await self.continent_handler.handle_continent_selection(query, data)
        elif data.startswith("countries_"):
            await self.continent_handler.handle_countries_pagination(query, data)
        elif data.startswith("country_"):
            await self.continent_handler.handle_country_selection(query, data)
        elif data.startswith("cities_"):
            await self.continent_handler.handle_cities_pagination(query, data)
        elif data.startswith("city_"):
            await self.city_handler.handle_city_selection(query, data, user_id)
    
