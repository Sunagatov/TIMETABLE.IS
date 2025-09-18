class MessageFormatter:
    @staticmethod
    def welcome_message():
        return (
            "🌍 Welcome to TimeBot!\n\n"
            "Get current time for any city worldwide or compare times between cities.\n\n"
            "Choose an option below or simply type a city name:"
        )
    
    @staticmethod
    def help_message():
        return (
            "🕐 TimeBot Help\n\n"
            "💡 Just type any city name or use buttons below:\n"
            "• Type: London\n"
            "• Type: New York\n"
            "• Or use the buttons for quick access"
        )
    
    @staticmethod
    def city_time(city, current_time):
        return (
            f"🕐 {city.title()}\n"
            f"📅 {current_time.strftime('%A, %B %d, %Y')}\n"
            f"⏰ {current_time.strftime('%H:%M:%S')} {current_time.strftime('%Z')}"
        )
    
    @staticmethod
    def city_not_found(city):
        return f"❌ '{city}' not found. Try one of these:"
    
    @staticmethod
    def time_comparison(comparison_data):
        city1 = comparison_data['city1']
        city2 = comparison_data['city2']
        time1 = comparison_data['time1']
        time2 = comparison_data['time2']
        diff = comparison_data['diff_hours']
        
        ahead_emoji = '🌅' if diff > 0 else '🌇'
        ahead_text = 'ahead' if diff > 0 else 'behind'
        
        return (
            f"🌍 Time Comparison\n\n"
            f"📍 {city1.title()}: {time1.strftime('%H:%M %Z')}\n"
            f"📍 {city2.title()}: {time2.strftime('%H:%M %Z')}\n\n"
            f"⏰ Difference: {abs(diff):.1f} hours\n"
            f"{ahead_emoji} {city2.title()} is {abs(diff):.1f}h {ahead_text}"
        )
    
    @staticmethod
    def select_city():
        return "🕐 Select a city or type any city name:"
    
    @staticmethod
    def select_first_city():
        return "⏰ Select first city or type city name:"
    
    @staticmethod
    def select_second_city(first_city):
        return f"✅ First city: {first_city}\n⏰ Now select second city:"
    
    @staticmethod
    def comparison_error():
        return "❌ Could not find one or both cities. Please try again."
    
    @staticmethod
    def select_country(continent):
        return f"🌍 {continent} - Select a country:"