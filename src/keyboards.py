from telegram import InlineKeyboardButton, InlineKeyboardMarkup

class KeyboardBuilder:
    @staticmethod
    def main_menu():
        keyboard = [
            [InlineKeyboardButton("🕐 Get Time", callback_data="get_time")],
            [InlineKeyboardButton("⏰ Compare Times", callback_data="compare_time")],
            [InlineKeyboardButton("🌍 Popular Cities", callback_data="popular_cities")]
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
            [InlineKeyboardButton("🕐 Get Time", callback_data="get_time")]
        ]
        return InlineKeyboardMarkup(keyboard)