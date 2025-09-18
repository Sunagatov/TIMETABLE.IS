import pytz
from datetime import datetime

class TimezoneService:
    def __init__(self):
        self.city_timezones = {
            "london": "Europe/London",
            "new york": "America/New_York",
            "tokyo": "Asia/Tokyo",
            "paris": "Europe/Paris",
            "moscow": "Europe/Moscow",
            "sydney": "Australia/Sydney",
            "los angeles": "America/Los_Angeles",
            "dubai": "Asia/Dubai",
            "singapore": "Asia/Singapore",
            "hong kong": "Asia/Hong_Kong",
            "berlin": "Europe/Berlin",
            "rome": "Europe/Rome",
            "madrid": "Europe/Madrid",
            "amsterdam": "Europe/Amsterdam",
            "istanbul": "Europe/Istanbul",
            "cairo": "Africa/Cairo",
            "mumbai": "Asia/Kolkata",
            "delhi": "Asia/Kolkata",
            "beijing": "Asia/Shanghai",
            "seoul": "Asia/Seoul",
            "bangkok": "Asia/Bangkok",
            "jakarta": "Asia/Jakarta",
            "manila": "Asia/Manila",
            "kuala lumpur": "Asia/Kuala_Lumpur",
            "riyadh": "Asia/Riyadh",
            "tel aviv": "Asia/Jerusalem",
            "vancouver": "America/Vancouver",
            "toronto": "America/Toronto",
            "chicago": "America/Chicago",
            "denver": "America/Denver",
            "phoenix": "America/Phoenix",
            "san francisco": "America/Los_Angeles",
            "mexico city": "America/Mexico_City",
            "sao paulo": "America/Sao_Paulo",
            "buenos aires": "America/Argentina/Buenos_Aires",
            "lima": "America/Lima",
            "bogota": "America/Bogota",
            "caracas": "America/Caracas",
            "santiago": "America/Santiago",
            "rio de janeiro": "America/Sao_Paulo",
            "lagos": "Africa/Lagos",
            "johannesburg": "Africa/Johannesburg",
            "nairobi": "Africa/Nairobi",
            "casablanca": "Africa/Casablanca",
            "algiers": "Africa/Algiers",
            "tunis": "Africa/Tunis",
            "addis ababa": "Africa/Addis_Ababa",
            "cape town": "Africa/Johannesburg"
        }
    
    def get_timezone(self, city: str):
        city_lower = city.lower()
        if city_lower in self.city_timezones:
            return pytz.timezone(self.city_timezones[city_lower])
        
        # Try partial matches
        for known_city, tz in self.city_timezones.items():
            if city_lower in known_city or known_city in city_lower:
                return pytz.timezone(tz)
        
        raise ValueError(f"Unknown city: {city}")
    
    def get_current_time(self, city: str):
        timezone = self.get_timezone(city)
        return datetime.now(timezone)
    
    def compare_times(self, city1: str, city2: str):
        tz1 = self.get_timezone(city1)
        tz2 = self.get_timezone(city2)
        
        now = datetime.now(pytz.UTC)
        time1 = now.astimezone(tz1)
        time2 = now.astimezone(tz2)
        
        diff_hours = (time2.utcoffset() - time1.utcoffset()).total_seconds() / 3600
        
        return {
            'city1': city1,
            'city2': city2,
            'time1': time1,
            'time2': time2,
            'diff_hours': diff_hours
        }
    
    def get_popular_cities(self):
        return [
            ["London", "New York", "Tokyo"],
            ["Paris", "Sydney", "Dubai"],
            ["Moscow", "Singapore", "Mumbai"],
            ["Berlin", "Los Angeles", "Beijing"]
        ]