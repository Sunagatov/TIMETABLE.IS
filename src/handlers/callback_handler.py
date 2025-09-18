from telegram import Update
from telegram.ext import ContextTypes
from .base_handler import BaseHandler
from keyboards import KeyboardBuilder
from message_formatter import MessageFormatter
from config import logger

class CallbackHandler(BaseHandler):
    def __init__(self, timezone_service, user_state_manager):
        self.timezone_service = timezone_service
        self.user_state_manager = user_state_manager
    
    async def handle(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        query = update.callback_query
        await query.answer()
        
        data = query.data
        user_id = update.effective_user.id
        
        if data == "get_time":
            await self._handle_get_time(query)
        elif data == "compare_time":
            await self._handle_compare_time(query, user_id)
        elif data == "main_menu":
            await self._handle_main_menu(query)
        elif data == "popular_cities":
            await self._handle_popular_cities(query)
        elif data == "continents":
            await self._handle_continents(query)
        elif data.startswith("continent_"):
            await self._handle_continent_selection(query, data)
        elif data.startswith("countries_"):
            await self._handle_countries_pagination(query, data)
        elif data.startswith("country_"):
            await self._handle_country_selection(query, data)
        elif data.startswith("cities_"):
            await self._handle_cities_pagination(query, data)
        elif data.startswith("city_"):
            await self._handle_city_selection(query, data, user_id)
    
    async def _handle_get_time(self, query):
        keyboard = KeyboardBuilder.time_selection_menu()
        await query.edit_message_text(
            "🕐 Get Time - Choose an option:",
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def _handle_compare_time(self, query, user_id):
        self.user_state_manager.set_state(user_id, {'action': 'compare_waiting_first'})
        keyboard = KeyboardBuilder.time_selection_menu()
        await query.edit_message_text(
            "⏰ Compare Times - Select first city:",
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def _handle_main_menu(self, query):
        keyboard = KeyboardBuilder.main_menu()
        await query.edit_message_text(
            MessageFormatter.welcome_message(),
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def _handle_popular_cities(self, query):
        cities = self.timezone_service.get_popular_cities()
        keyboard = KeyboardBuilder.popular_cities(cities)
        await query.edit_message_text(
            "🌟 Popular Cities:",
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def _handle_continents(self, query):
        continents = self.timezone_service.get_continents()
        keyboard = KeyboardBuilder.continents(continents)
        await query.edit_message_text(
            "🗺️ Select Continent:",
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def _handle_continent_selection(self, query, data):
        continent = data[10:]
        countries = self.timezone_service.get_countries(continent)
        keyboard = KeyboardBuilder.countries(countries, continent)
        await query.edit_message_text(
            MessageFormatter.select_country(continent),
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def _handle_countries_pagination(self, query, data):
        parts = data.split("_")
        continent, page = parts[1], int(parts[2])
        countries = self.timezone_service.get_countries(continent)
        keyboard = KeyboardBuilder.countries(countries, continent, page)
        await query.edit_message_text(
            MessageFormatter.select_country(continent),
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def _handle_country_selection(self, query, data):
        parts = data.split("_")
        continent, country = parts[1], parts[2]
        cities = self.timezone_service.get_cities(continent, country)
        keyboard = KeyboardBuilder.cities(cities, continent, country)
        await query.edit_message_text(
            f"🏙️ Cities in {country}:",
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def _handle_cities_pagination(self, query, data):
        parts = data.split("_")
        continent, country, page = parts[1], parts[2], int(parts[3])
        cities = self.timezone_service.get_cities(continent, country)
        keyboard = KeyboardBuilder.cities(cities, continent, country, page)
        await query.edit_message_text(
            f"🏙️ Cities in {country}:",
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def _handle_city_selection(self, query, data, user_id):
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