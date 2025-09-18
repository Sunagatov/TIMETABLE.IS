from ui import KeyboardBuilder, MessageFormatter

class ContinentHandler:
    def __init__(self, timezone_service):
        self.timezone_service = timezone_service
    
    async def handle_continents(self, query):
        continents = self.timezone_service.get_continents()
        keyboard = KeyboardBuilder.continents(continents)
        await query.edit_message_text(
            "🗺️ Select Continent:",
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def handle_continent_selection(self, query, data):
        continent = data[10:]
        countries = self.timezone_service.get_countries(continent)
        keyboard = KeyboardBuilder.countries(countries, continent)
        await query.edit_message_text(
            MessageFormatter.select_country(continent),
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def handle_countries_pagination(self, query, data):
        parts = data.split("_")
        continent, page = parts[1], int(parts[2])
        countries = self.timezone_service.get_countries(continent)
        keyboard = KeyboardBuilder.countries(countries, continent, page)
        await query.edit_message_text(
            MessageFormatter.select_country(continent),
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def handle_country_selection(self, query, data):
        parts = data.split("_")
        continent, country = parts[1], parts[2]
        cities = self.timezone_service.get_cities(continent, country)
        keyboard = KeyboardBuilder.cities(cities, continent, country)
        await query.edit_message_text(
            f"🏙️ Cities in {country}:",
            reply_markup=keyboard,
            parse_mode=None
        )
    
    async def handle_cities_pagination(self, query, data):
        parts = data.split("_")
        continent, country, page = parts[1], parts[2], int(parts[3])
        cities = self.timezone_service.get_cities(continent, country)
        keyboard = KeyboardBuilder.cities(cities, continent, country, page)
        await query.edit_message_text(
            f"🏙️ Cities in {country}:",
            reply_markup=keyboard,
            parse_mode=None
        )