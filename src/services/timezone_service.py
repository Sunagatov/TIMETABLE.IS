import pytz
from datetime import datetime
from config import logger
from .city_mapper import CityMapper

class TimezoneService:
    def __init__(self):
        self.city_mapper = CityMapper()
    
    def get_timezone(self, city: str):
        try:
            timezone_name = self.city_mapper.get_timezone_name(city)
            return pytz.timezone(timezone_name)
        except ValueError:
            logger.warning(f"Unknown city requested: {city}")
            raise
    
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
        return self.city_mapper.get_popular_cities()
    
    def get_continents(self):
        return self.city_mapper.get_continents()
    
    def get_countries(self, continent):
        return self.city_mapper.get_countries(continent)
    
    def get_cities(self, continent, country):
        return self.city_mapper.get_cities(continent, country)