import pytz
from datetime import datetime
from config import logger

class TimezoneService:
    def __init__(self):
        self.cities_by_continent = {
            "Europe": {
                "United Kingdom": ["London", "Edinburgh", "Manchester"],
                "France": ["Paris", "Lyon", "Marseille"],
                "Germany": ["Berlin", "Munich", "Hamburg"],
                "Italy": ["Rome", "Milan", "Naples"],
                "Spain": ["Madrid", "Barcelona", "Valencia"],
                "Netherlands": ["Amsterdam", "Rotterdam"],
                "Russia": ["Moscow", "St Petersburg"],
                "Turkey": ["Istanbul", "Ankara"]
            },
            "Asia": {
                "Japan": ["Tokyo", "Osaka", "Kyoto"],
                "China": ["Beijing", "Shanghai", "Guangzhou"],
                "India": ["Mumbai", "Delhi", "Bangalore"],
                "UAE": ["Dubai", "Abu Dhabi"],
                "Singapore": ["Singapore"],
                "South Korea": ["Seoul", "Busan"],
                "Thailand": ["Bangkok", "Phuket"],
                "Indonesia": ["Jakarta", "Bali"],
                "Philippines": ["Manila", "Cebu"],
                "Malaysia": ["Kuala Lumpur", "Penang"],
                "Saudi Arabia": ["Riyadh", "Jeddah"],
                "Israel": ["Tel Aviv", "Jerusalem"]
            },
            "North America": {
                "USA": ["New York", "Los Angeles", "Chicago", "San Francisco", "Denver", "Phoenix"],
                "Canada": ["Toronto", "Vancouver", "Montreal"],
                "Mexico": ["Mexico City", "Guadalajara"]
            },
            "South America": {
                "Brazil": ["Sao Paulo", "Rio de Janeiro", "Brasilia"],
                "Argentina": ["Buenos Aires", "Cordoba"],
                "Peru": ["Lima", "Cusco"],
                "Colombia": ["Bogota", "Medellin"],
                "Venezuela": ["Caracas"],
                "Chile": ["Santiago", "Valparaiso"]
            },
            "Africa": {
                "Egypt": ["Cairo", "Alexandria"],
                "Nigeria": ["Lagos", "Abuja"],
                "South Africa": ["Johannesburg", "Cape Town"],
                "Kenya": ["Nairobi", "Mombasa"],
                "Morocco": ["Casablanca", "Rabat"],
                "Algeria": ["Algiers"],
                "Tunisia": ["Tunis"],
                "Ethiopia": ["Addis Ababa"]
            },
            "Oceania": {
                "Australia": ["Sydney", "Melbourne", "Brisbane"],
                "New Zealand": ["Auckland", "Wellington"]
            }
        }
        
        self.city_timezones = {
            "london": "Europe/London", "edinburgh": "Europe/London", "manchester": "Europe/London",
            "paris": "Europe/Paris", "lyon": "Europe/Paris", "marseille": "Europe/Paris",
            "berlin": "Europe/Berlin", "munich": "Europe/Berlin", "hamburg": "Europe/Berlin",
            "rome": "Europe/Rome", "milan": "Europe/Rome", "naples": "Europe/Rome",
            "madrid": "Europe/Madrid", "barcelona": "Europe/Madrid", "valencia": "Europe/Madrid",
            "amsterdam": "Europe/Amsterdam", "rotterdam": "Europe/Amsterdam",
            "moscow": "Europe/Moscow", "st petersburg": "Europe/Moscow",
            "istanbul": "Europe/Istanbul", "ankara": "Europe/Istanbul",
            "tokyo": "Asia/Tokyo", "osaka": "Asia/Tokyo", "kyoto": "Asia/Tokyo",
            "beijing": "Asia/Shanghai", "shanghai": "Asia/Shanghai", "guangzhou": "Asia/Shanghai",
            "mumbai": "Asia/Kolkata", "delhi": "Asia/Kolkata", "bangalore": "Asia/Kolkata",
            "dubai": "Asia/Dubai", "abu dhabi": "Asia/Dubai",
            "singapore": "Asia/Singapore",
            "seoul": "Asia/Seoul", "busan": "Asia/Seoul",
            "bangkok": "Asia/Bangkok", "phuket": "Asia/Bangkok",
            "jakarta": "Asia/Jakarta", "bali": "Asia/Makassar",
            "manila": "Asia/Manila", "cebu": "Asia/Manila",
            "kuala lumpur": "Asia/Kuala_Lumpur", "penang": "Asia/Kuala_Lumpur",
            "riyadh": "Asia/Riyadh", "jeddah": "Asia/Riyadh",
            "tel aviv": "Asia/Jerusalem", "jerusalem": "Asia/Jerusalem",
            "new york": "America/New_York", "los angeles": "America/Los_Angeles",
            "chicago": "America/Chicago", "san francisco": "America/Los_Angeles",
            "denver": "America/Denver", "phoenix": "America/Phoenix",
            "toronto": "America/Toronto", "vancouver": "America/Vancouver", "montreal": "America/Toronto",
            "mexico city": "America/Mexico_City", "guadalajara": "America/Mexico_City",
            "sao paulo": "America/Sao_Paulo", "rio de janeiro": "America/Sao_Paulo", "brasilia": "America/Sao_Paulo",
            "buenos aires": "America/Argentina/Buenos_Aires", "cordoba": "America/Argentina/Buenos_Aires",
            "lima": "America/Lima", "cusco": "America/Lima",
            "bogota": "America/Bogota", "medellin": "America/Bogota",
            "caracas": "America/Caracas",
            "santiago": "America/Santiago", "valparaiso": "America/Santiago",
            "cairo": "Africa/Cairo", "alexandria": "Africa/Cairo",
            "lagos": "Africa/Lagos", "abuja": "Africa/Lagos",
            "johannesburg": "Africa/Johannesburg", "cape town": "Africa/Johannesburg",
            "nairobi": "Africa/Nairobi", "mombasa": "Africa/Nairobi",
            "casablanca": "Africa/Casablanca", "rabat": "Africa/Casablanca",
            "algiers": "Africa/Algiers",
            "tunis": "Africa/Tunis",
            "addis ababa": "Africa/Addis_Ababa",
            "sydney": "Australia/Sydney", "melbourne": "Australia/Melbourne", "brisbane": "Australia/Brisbane",
            "auckland": "Pacific/Auckland", "wellington": "Pacific/Auckland"
        }
    
    def get_timezone(self, city: str):
        city_lower = city.lower()
        if city_lower in self.city_timezones:
            return pytz.timezone(self.city_timezones[city_lower])
        
        # Try partial matches
        for known_city, tz in self.city_timezones.items():
            if city_lower in known_city or known_city in city_lower:
                return pytz.timezone(tz)
        
        logger.warning(f"Unknown city requested: {city}")
        raise ValueError(f"Unknown city: {city}")
    
    def get_current_time(self, city: str):
        timezone = self.get_timezone(city)
        return datetime.now(timezone)
    
    def compare_times(self, city1: str, city2: str):
        try:
            tz1 = self.get_timezone(city1)
            tz2 = self.get_timezone(city2)
        except ValueError as e:
            logger.warning(f"Time comparison failed: {e}")
            raise
        
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
    
    def get_continents(self):
        return list(self.cities_by_continent.keys())
    
    def get_countries(self, continent):
        return list(self.cities_by_continent.get(continent, {}).keys())
    
    def get_cities(self, continent, country):
        return self.cities_by_continent.get(continent, {}).get(country, [])
    
    def paginate_items(self, items, page=0, per_page=6):
        start = page * per_page
        end = start + per_page
        return items[start:end], len(items) > end