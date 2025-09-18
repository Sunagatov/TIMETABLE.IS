from telegram import Update
from telegram.ext import ContextTypes
from timezone_service import TimezoneService
from handlers import CommandHandler, CallbackHandler, MessageHandler
from state import UserStateManager

class BotHandlers:
    def __init__(self):
        self.timezone_service = TimezoneService()
        self.user_state_manager = UserStateManager()
        self.command_handler = CommandHandler(self.timezone_service)
        self.callback_handler = CallbackHandler(self.timezone_service, self.user_state_manager)
        self.message_handler = MessageHandler(self.timezone_service, self.user_state_manager)
    
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
    
    async def get_time(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        if not context.args:
            cities = self.timezone_service.get_popular_cities()
            keyboard = KeyboardBuilder.popular_cities(cities)
            await update.message.reply_text(
                MessageFormatter.select_city(),
                reply_markup=keyboard,
                parse_mode=None
            )
            return
        
        city = " ".join(context.args).replace("_", " ")
        await self._show_city_time(update, city)
    
    async def time_diff(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        if len(context.args) < 2:
            self.user_states[update.effective_user.id] = {'action': 'compare_waiting_first'}
            cities = self.timezone_service.get_popular_cities()
            keyboard = KeyboardBuilder.popular_cities(cities)
            await update.message.reply_text(
                MessageFormatter.select_first_city(),
                reply_markup=keyboard,
                parse_mode=None
            )
            return
        
        city1 = context.args[0].replace("_", " ")
        city2 = " ".join(context.args[1:]).replace("_", " ")
        await self._compare_cities(update, city1, city2)
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        user_id = update.effective_user.id
        text = update.message.text.strip()
        
        if user_id in self.user_states:
            state = self.user_states[user_id]
            
            if state['action'] == 'compare_waiting_first':
                state['city1'] = text
                state['action'] = 'compare_waiting_second'
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
                del self.user_states[user_id]
                await self._compare_cities(update, city1, city2)
                return
        
        await self._show_city_time(update, text)
    
    async def button_handler(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        query = update.callback_query
        await query.answer()
        
        data = query.data
        user_id = update.effective_user.id
        
        if data == "get_time":
            keyboard = KeyboardBuilder.time_selection_menu()
            await query.edit_message_text(
                "🕐 Get Time - Choose an option:",
                reply_markup=keyboard,
                parse_mode=None
            )
        
        elif data == "compare_time":
            self.user_states[user_id] = {'action': 'compare_waiting_first'}
            keyboard = KeyboardBuilder.time_selection_menu()
            await query.edit_message_text(
                "⏰ Compare Times - Select first city:",
                reply_markup=keyboard,
                parse_mode=None
            )
        
        elif data == "popular_cities":
            cities = self.timezone_service.get_popular_cities()
            keyboard = KeyboardBuilder.popular_cities(cities)
            await query.edit_message_text(
                "🌟 Popular Cities:",
                reply_markup=keyboard,
                parse_mode=None
            )
        
        elif data == "main_menu":
            keyboard = KeyboardBuilder.main_menu()
            await query.edit_message_text(
                MessageFormatter.welcome_message(),
                reply_markup=keyboard,
                parse_mode=None
            )
        
        elif data == "continents":
            continents = self.timezone_service.get_continents()
            keyboard = KeyboardBuilder.continents(continents)
            await query.edit_message_text(
                "🗺️ Select Continent:",
                reply_markup=keyboard,
                parse_mode=None
            )
        
        elif data.startswith("continent_"):
            continent = data[10:]
            countries = self.timezone_service.get_countries(continent)
            keyboard = KeyboardBuilder.countries(countries, continent)
            await query.edit_message_text(
                MessageFormatter.select_country(continent),
                reply_markup=keyboard,
                parse_mode=None
            )
        
        elif data.startswith("countries_"):
            parts = data.split("_")
            continent, page = parts[1], int(parts[2])
            countries = self.timezone_service.get_countries(continent)
            keyboard = KeyboardBuilder.countries(countries, continent, page)
            await query.edit_message_text(
                MessageFormatter.select_country(continent),
                reply_markup=keyboard,
                parse_mode=None
            )
        
        elif data.startswith("country_"):
            parts = data.split("_")
            continent, country = parts[1], parts[2]
            cities = self.timezone_service.get_cities(continent, country)
            keyboard = KeyboardBuilder.cities(cities, continent, country)
            await query.edit_message_text(
                f"🏙️ Cities in {country}:",
                reply_markup=keyboard,
                parse_mode=None
            )
        
        elif data.startswith("cities_"):
            parts = data.split("_")
            continent, country, page = parts[1], parts[2], int(parts[3])
            cities = self.timezone_service.get_cities(continent, country)
            keyboard = KeyboardBuilder.cities(cities, continent, country, page)
            await query.edit_message_text(
                f"🏙️ Cities in {country}:",
                reply_markup=keyboard,
                parse_mode=None
            )
        
        elif data.startswith("city_"):
            city = data[5:].replace("_", " ")
            
            if user_id in self.user_states:
                state = self.user_states[user_id]
                
                if state['action'] == 'compare_waiting_first':
                    state['city1'] = city
                    state['action'] = 'compare_waiting_second'
                    keyboard = KeyboardBuilder.time_selection_menu()
                    await query.edit_message_text(
                        f"⏰ First city: {city}\nSelect second city:",
                        reply_markup=keyboard,
                        parse_mode=None
                    )
                    return
                
                elif state['action'] == 'compare_waiting_second':
                    city1 = state['city1']
                    del self.user_states[user_id]
                    await self._compare_cities_from_callback(query, city1, city)
                    return
            
            await self._show_city_time_from_callback(query, city)
    
    async def _show_city_time(self, update: Update, city: str):
        try:
            current_time = self.timezone_service.get_current_time(city)
            keyboard = KeyboardBuilder.time_actions()
            
            await update.message.reply_text(
                MessageFormatter.city_time(city, current_time),
                reply_markup=keyboard,
                parse_mode=None
            )
        except Exception:
            keyboard = KeyboardBuilder.time_selection_menu()
            await update.message.reply_text(
                MessageFormatter.city_not_found(city),
                reply_markup=keyboard,
                parse_mode=None
            )
    
    async def _show_city_time_from_callback(self, query, city: str):
        try:
            current_time = self.timezone_service.get_current_time(city)
            keyboard = KeyboardBuilder.time_actions()
            
            await query.edit_message_text(
                MessageFormatter.city_time(city, current_time),
                reply_markup=keyboard,
                parse_mode=None
            )
        except Exception:
            keyboard = KeyboardBuilder.time_selection_menu()
            await query.edit_message_text(
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
        except Exception:
            await update.message.reply_text(MessageFormatter.comparison_error(), parse_mode=None)
    
    async def _compare_cities_from_callback(self, query, city1: str, city2: str):
        try:
            comparison = self.timezone_service.compare_times(city1, city2)
            keyboard = KeyboardBuilder.compare_actions()
            
            await query.edit_message_text(
                MessageFormatter.time_comparison(comparison),
                reply_markup=keyboard,
                parse_mode=None
            )
        except Exception:
            await query.edit_message_text(MessageFormatter.comparison_error(), parse_mode=None)