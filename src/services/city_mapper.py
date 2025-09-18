class CityMapper:
    def __init__(self):
        self.cities_by_continent = {
            "Europe": {
                "Russia": ["Moscow", "St Petersburg", "Novosibirsk", "Yekaterinburg", "Nizhny Novgorod", "Kazan", "Chelyabinsk", "Omsk", "Samara", "Rostov-on-Don", "Ufa", "Krasnoyarsk", "Perm", "Voronezh", "Volgograd", "Krasnodar", "Saratov", "Tyumen", "Tolyatti", "Izhevsk", "Barnaul", "Vladivostok", "Irkutsk", "Khabarovsk", "Yaroslavl", "Vladikavkaz", "Makhachkala", "Tomsk", "Orenburg", "Kemerovo"],
                "United Kingdom": ["London", "Edinburgh", "Manchester", "Birmingham", "Liverpool", "Glasgow", "Bristol", "Leeds", "Sheffield", "Newcastle", "Cardiff", "Belfast"],
                "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Etienne"],
                "Germany": ["Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt", "Stuttgart", "Dusseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", "Hanover", "Nuremberg"],
                "Italy": ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence"],
                "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Malaga", "Bilbao"],
                "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
                "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
                "Poland": ["Warsaw", "Krakow", "Gdansk", "Wroclaw", "Poznan"],
                "Ukraine": ["Kiev", "Kharkiv", "Odessa", "Dnipro", "Lviv"],
                "Czech Republic": ["Prague", "Brno", "Ostrava"],
                "Austria": ["Vienna", "Salzburg", "Innsbruck"],
                "Switzerland": ["Zurich", "Geneva", "Basel", "Bern"],
                "Belgium": ["Brussels", "Antwerp", "Ghent"],
                "Sweden": ["Stockholm", "Gothenburg", "Malmo"],
                "Norway": ["Oslo", "Bergen", "Trondheim"],
                "Denmark": ["Copenhagen", "Aarhus", "Odense"],
                "Finland": ["Helsinki", "Tampere", "Turku"],
                "Greece": ["Athens", "Thessaloniki", "Patras"],
                "Portugal": ["Lisbon", "Porto", "Braga"],
                "Romania": ["Bucharest", "Cluj-Napoca", "Timisoara"],
                "Hungary": ["Budapest", "Debrecen", "Szeged"],
                "Croatia": ["Zagreb", "Split", "Rijeka"],
                "Serbia": ["Belgrade", "Novi Sad", "Nis"],
                "Bulgaria": ["Sofia", "Plovdiv", "Varna"],
                "Slovakia": ["Bratislava", "Kosice", "Presov"],
                "Slovenia": ["Ljubljana", "Maribor", "Celje"],
                "Estonia": ["Tallinn", "Tartu", "Narva"],
                "Latvia": ["Riga", "Daugavpils", "Liepaja"],
                "Lithuania": ["Vilnius", "Kaunas", "Klaipeda"],
                "Belarus": ["Minsk", "Gomel", "Mogilev"],
                "Moldova": ["Chisinau", "Tiraspol", "Balti"],
                "Ireland": ["Dublin", "Cork", "Galway"],
                "Iceland": ["Reykjavik", "Akureyri", "Hafnarfjordur"],
                "Bosnia and Herzegovina": ["Sarajevo", "Banja Luka", "Tuzla"],
                "North Macedonia": ["Skopje", "Bitola", "Kumanovo"],
                "Albania": ["Tirana", "Durres", "Vlore"],
                "Montenegro": ["Podgorica", "Nikšić", "Pljevlja"],
                "Kosovo": ["Pristina", "Prizren", "Peja"],
                "Luxembourg": ["Luxembourg City", "Esch-sur-Alzette", "Differdange"],
                "Malta": ["Valletta", "Birkirkara", "Mosta"],
                "Cyprus": ["Nicosia", "Limassol", "Larnaca"],
                "San Marino": ["San Marino", "Serravalle", "Borgo Maggiore"],
                "Monaco": ["Monaco", "Monte Carlo", "La Condamine"],
                "Andorra": ["Andorra la Vella", "Escaldes-Engordany", "Encamp"],
                "Liechtenstein": ["Vaduz", "Schaan", "Balzers"]
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
            "birmingham": "Europe/London", "liverpool": "Europe/London", "glasgow": "Europe/London",
            "paris": "Europe/Paris", "lyon": "Europe/Paris", "marseille": "Europe/Paris",
            "toulouse": "Europe/Paris", "nice": "Europe/Paris", "nantes": "Europe/Paris", "strasbourg": "Europe/Paris",
            "berlin": "Europe/Berlin", "munich": "Europe/Berlin", "hamburg": "Europe/Berlin",
            "cologne": "Europe/Berlin", "frankfurt": "Europe/Berlin", "stuttgart": "Europe/Berlin", "dusseldorf": "Europe/Berlin",
            "rome": "Europe/Rome", "milan": "Europe/Rome", "naples": "Europe/Rome",
            "turin": "Europe/Rome", "palermo": "Europe/Rome", "genoa": "Europe/Rome", "bologna": "Europe/Rome", "florence": "Europe/Rome",
            "madrid": "Europe/Madrid", "barcelona": "Europe/Madrid", "valencia": "Europe/Madrid",
            "seville": "Europe/Madrid", "zaragoza": "Europe/Madrid", "malaga": "Europe/Madrid", "bilbao": "Europe/Madrid",
            "amsterdam": "Europe/Amsterdam", "rotterdam": "Europe/Amsterdam",
            "the hague": "Europe/Amsterdam", "utrecht": "Europe/Amsterdam", "eindhoven": "Europe/Amsterdam",
            "warsaw": "Europe/Warsaw", "krakow": "Europe/Warsaw", "gdansk": "Europe/Warsaw", "wroclaw": "Europe/Warsaw", "poznan": "Europe/Warsaw",
            "kiev": "Europe/Kiev", "kharkiv": "Europe/Kiev", "odessa": "Europe/Kiev", "dnipro": "Europe/Kiev", "lviv": "Europe/Kiev",
            "prague": "Europe/Prague", "brno": "Europe/Prague", "ostrava": "Europe/Prague",
            "vienna": "Europe/Vienna", "salzburg": "Europe/Vienna", "innsbruck": "Europe/Vienna",
            "zurich": "Europe/Zurich", "geneva": "Europe/Zurich", "basel": "Europe/Zurich", "bern": "Europe/Zurich",
            "brussels": "Europe/Brussels", "antwerp": "Europe/Brussels", "ghent": "Europe/Brussels",
            "stockholm": "Europe/Stockholm", "gothenburg": "Europe/Stockholm", "malmo": "Europe/Stockholm",
            "oslo": "Europe/Oslo", "bergen": "Europe/Oslo", "trondheim": "Europe/Oslo",
            "copenhagen": "Europe/Copenhagen", "aarhus": "Europe/Copenhagen", "odense": "Europe/Copenhagen",
            "helsinki": "Europe/Helsinki", "tampere": "Europe/Helsinki", "turku": "Europe/Helsinki",
            "athens": "Europe/Athens", "thessaloniki": "Europe/Athens", "patras": "Europe/Athens",
            "lisbon": "Europe/Lisbon", "porto": "Europe/Lisbon", "braga": "Europe/Lisbon",
            "bucharest": "Europe/Bucharest", "cluj-napoca": "Europe/Bucharest", "timisoara": "Europe/Bucharest",
            "budapest": "Europe/Budapest", "debrecen": "Europe/Budapest", "szeged": "Europe/Budapest",
            "izmir": "Europe/Istanbul", "bursa": "Europe/Istanbul", "antalya": "Europe/Istanbul",
            "zagreb": "Europe/Zagreb", "split": "Europe/Zagreb", "rijeka": "Europe/Zagreb",
            "belgrade": "Europe/Belgrade", "novi sad": "Europe/Belgrade", "nis": "Europe/Belgrade",
            "sofia": "Europe/Sofia", "plovdiv": "Europe/Sofia", "varna": "Europe/Sofia",
            "bratislava": "Europe/Bratislava", "kosice": "Europe/Bratislava", "presov": "Europe/Bratislava",
            "ljubljana": "Europe/Ljubljana", "maribor": "Europe/Ljubljana", "celje": "Europe/Ljubljana",
            "tallinn": "Europe/Tallinn", "tartu": "Europe/Tallinn", "narva": "Europe/Tallinn",
            "riga": "Europe/Riga", "daugavpils": "Europe/Riga", "liepaja": "Europe/Riga",
            "vilnius": "Europe/Vilnius", "kaunas": "Europe/Vilnius", "klaipeda": "Europe/Vilnius",
            "minsk": "Europe/Minsk", "gomel": "Europe/Minsk", "mogilev": "Europe/Minsk",
            "chisinau": "Europe/Chisinau", "tiraspol": "Europe/Chisinau", "balti": "Europe/Chisinau",
            "dublin": "Europe/Dublin", "cork": "Europe/Dublin", "galway": "Europe/Dublin",
            "reykjavik": "Atlantic/Reykjavik", "akureyri": "Atlantic/Reykjavik", "hafnarfjordur": "Atlantic/Reykjavik",
            "sarajevo": "Europe/Sarajevo", "banja luka": "Europe/Sarajevo", "tuzla": "Europe/Sarajevo",
            "skopje": "Europe/Skopje", "bitola": "Europe/Skopje", "kumanovo": "Europe/Skopje",
            "tirana": "Europe/Tirane", "durres": "Europe/Tirane", "vlore": "Europe/Tirane",
            "podgorica": "Europe/Podgorica", "nikšić": "Europe/Podgorica", "pljevlja": "Europe/Podgorica",
            "pristina": "Europe/Belgrade", "prizren": "Europe/Belgrade", "peja": "Europe/Belgrade",
            "luxembourg city": "Europe/Luxembourg", "esch-sur-alzette": "Europe/Luxembourg", "differdange": "Europe/Luxembourg",
            "valletta": "Europe/Malta", "birkirkara": "Europe/Malta", "mosta": "Europe/Malta",
            "nicosia": "Asia/Nicosia", "limassol": "Asia/Nicosia", "larnaca": "Asia/Nicosia",
            "san marino": "Europe/San_Marino", "serravalle": "Europe/San_Marino", "borgo maggiore": "Europe/San_Marino",
            "monaco": "Europe/Monaco", "monte carlo": "Europe/Monaco", "la condamine": "Europe/Monaco",
            "andorra la vella": "Europe/Andorra", "escaldes-engordany": "Europe/Andorra", "encamp": "Europe/Andorra",
            "vaduz": "Europe/Vaduz", "schaan": "Europe/Vaduz", "balzers": "Europe/Vaduz",
            "moscow": "Europe/Moscow", "st petersburg": "Europe/Moscow",
            "novosibirsk": "Asia/Novosibirsk", "yekaterinburg": "Asia/Yekaterinburg",
            "nizhny novgorod": "Europe/Moscow", "kazan": "Europe/Moscow",
            "chelyabinsk": "Asia/Yekaterinburg", "omsk": "Asia/Omsk",
            "samara": "Europe/Samara", "rostov-on-don": "Europe/Moscow",
            "ufa": "Asia/Yekaterinburg", "krasnoyarsk": "Asia/Krasnoyarsk",
            "perm": "Asia/Yekaterinburg", "voronezh": "Europe/Moscow",
            "volgograd": "Europe/Volgograd", "krasnodar": "Europe/Moscow",
            "saratov": "Europe/Saratov", "tyumen": "Asia/Yekaterinburg",
            "tolyatti": "Europe/Samara", "izhevsk": "Europe/Moscow",
            "barnaul": "Asia/Barnaul", "vladivostok": "Asia/Vladivostok", "irkutsk": "Asia/Irkutsk",
            "khabarovsk": "Asia/Vladivostok", "yaroslavl": "Europe/Moscow", "vladikavkaz": "Europe/Moscow",
            "makhachkala": "Europe/Moscow", "tomsk": "Asia/Tomsk", "orenburg": "Asia/Yekaterinburg", "kemerovo": "Asia/Novokuznetsk",
            "bristol": "Europe/London", "leeds": "Europe/London", "sheffield": "Europe/London",
            "newcastle": "Europe/London", "cardiff": "Europe/London", "belfast": "Europe/London",
            "dortmund": "Europe/Berlin", "essen": "Europe/Berlin", "leipzig": "Europe/Berlin",
            "bremen": "Europe/Berlin", "dresden": "Europe/Berlin", "hanover": "Europe/Berlin", "nuremberg": "Europe/Berlin",
            "montpellier": "Europe/Paris", "bordeaux": "Europe/Paris", "lille": "Europe/Paris",
            "rennes": "Europe/Paris", "reims": "Europe/Paris", "le havre": "Europe/Paris", "saint-etienne": "Europe/Paris",
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
    
    def get_timezone_name(self, city: str) -> str:
        city_lower = city.lower()
        if city_lower in self.city_timezones:
            return self.city_timezones[city_lower]
        
        for known_city, tz in self.city_timezones.items():
            if city_lower in known_city or known_city in city_lower:
                return tz
        
        raise ValueError(f"Unknown city: {city}")
    
    def get_continents(self):
        return list(self.cities_by_continent.keys())
    
    def get_countries(self, continent):
        return list(self.cities_by_continent.get(continent, {}).keys())
    
    def get_cities(self, continent, country):
        return self.cities_by_continent.get(continent, {}).get(country, [])
    
    def get_popular_cities(self):
        return [
            ["London", "New York", "Tokyo"],
            ["Paris", "Sydney", "Dubai"],
            ["Moscow", "Singapore", "Mumbai"],
            ["Berlin", "Los Angeles", "Beijing"]
        ]