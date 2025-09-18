from telegram import InlineKeyboardButton, InlineKeyboardMarkup

class KeyboardBuilder:
    @staticmethod
    def main_menu():
        keyboard = [
            [InlineKeyboardButton("🕐 Get Time", callback_data="get_time")],
            [InlineKeyboardButton("⏰ Compare Times", callback_data="compare_time")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def time_selection_menu():
        keyboard = [
            [InlineKeyboardButton("🌟 Popular Cities", callback_data="popular_cities")],
            [InlineKeyboardButton("🗺️ Browse by Continent", callback_data="continents")],
            [InlineKeyboardButton("🔙 Back to Main", callback_data="main_menu")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def popular_cities(cities_grid):
        keyboard = []
        for row in cities_grid:
            keyboard.append([
                InlineKeyboardButton(city, callback_data=f"city_{city.replace(' ', '_')}")
                for city in row
            ])
        keyboard.append([InlineKeyboardButton("🔙 Back", callback_data="get_time")])
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def time_actions():
        keyboard = [
            [InlineKeyboardButton("🔄 Another City", callback_data="get_time")],
            [InlineKeyboardButton("⏰ Compare Times", callback_data="compare_time")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def compare_actions():
        keyboard = [
            [InlineKeyboardButton("🔄 Compare Again", callback_data="compare_time")],
            [InlineKeyboardButton("🏠 Main Menu", callback_data="main_menu")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def continents(continents):
        keyboard = []
        for continent in continents:
            emoji = {"Europe": "🇪🇺", "Asia": "🌏", "North America": "🌎", 
                    "South America": "🌎", "Africa": "🌍", "Oceania": "🌏"}.get(continent, "🌍")
            keyboard.append([InlineKeyboardButton(f"{emoji} {continent}", callback_data=f"continent_{continent}")])
        keyboard.append([InlineKeyboardButton("🔙 Back", callback_data="get_time")])
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def countries(countries, continent, page=0):
        keyboard = []
        countries_page, has_more = KeyboardBuilder._paginate(countries, page)
        
        for country in countries_page:
            keyboard.append([InlineKeyboardButton(country, callback_data=f"country_{continent}_{country}")])
        
        nav_row = []
        if page > 0:
            nav_row.append(InlineKeyboardButton("⬅️", callback_data=f"countries_{continent}_{page-1}"))
        if has_more:
            nav_row.append(InlineKeyboardButton("➡️", callback_data=f"countries_{continent}_{page+1}"))
        if nav_row:
            keyboard.append(nav_row)
        
        keyboard.append([InlineKeyboardButton("🔙 Continents", callback_data="continents")])
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def cities(cities, continent, country, page=0):
        keyboard = []
        cities_page, has_more = KeyboardBuilder._paginate(cities, page)
        
        row = []
        for i, city in enumerate(cities_page):
            row.append(InlineKeyboardButton(city, callback_data=f"city_{city.replace(' ', '_')}"))
            if len(row) == 2 or i == len(cities_page) - 1:
                keyboard.append(row)
                row = []
        
        nav_row = []
        if page > 0:
            nav_row.append(InlineKeyboardButton("⬅️", callback_data=f"cities_{continent}_{country}_{page-1}"))
        if has_more:
            nav_row.append(InlineKeyboardButton("➡️", callback_data=f"cities_{continent}_{country}_{page+1}"))
        if nav_row:
            keyboard.append(nav_row)
        
        keyboard.append([InlineKeyboardButton("🔙 Countries", callback_data=f"continent_{continent}")])
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def _paginate(items, page, per_page=6):
        start = page * per_page
        end = start + per_page
        return items[start:end], len(items) > end