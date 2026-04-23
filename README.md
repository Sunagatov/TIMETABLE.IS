<div align="center">
  <br>
  <h1>🕐 Memora</h1>
  <p><strong>A Telegram bot that tells you the time anywhere in the world — instantly.</strong></p>
  <p>
    <a href="https://t.me/zufarexplained">💬 Community</a> ·
    <a href="https://github.com/Sunagatov/Memora/issues">🐛 Issues</a>
  </p>

  [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
</div>

---

## 🚀 Quick Start

**📋 Prerequisites:** Python 3.12+, Docker Desktop, Telegram Bot Token (from [@BotFather](https://t.me/BotFather))

```bash
# 1. 📥 Clone
git clone https://github.com/Sunagatov/Memora.git && cd Memora

# 2. 🔧 Fill in your credentials
cp .env.example .env
# edit BOT_TOKEN in .env
```

> ⚠️ **Never commit `.env` with real credentials.** It is listed in `.gitignore` — keep it that way.

---

### Option A — Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run the bot
python src/time_bot.py
```

---

### Option B — Docker

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f timetable-bot

# Stop
docker-compose down
```

---

## 🤔 What is this?

Memora is a Telegram bot that provides current time for any major city worldwide and calculates time differences between cities. Browse by continent and country, or use popular cities shortcuts. Supports 50+ major cities across all continents with interactive inline keyboards.

---

## 🛠️ Tech Stack

| 📂 Category | 🔧 Technology |
|---|---|
| 💻 Language | Python 3.12 |
| 🏗️ Framework | python-telegram-bot 21.9 |
| 🕐 Timezone | zoneinfo (Python standard library) |
| 🚢 Deployment | Docker, Docker Compose |

---

## ✨ Features

- 🕐 **Get current time** — for any supported city worldwide
- ⏰ **Compare times** — calculate time differences between two cities
- 🌍 **50+ cities** — major cities across all continents
- 🗺️ **Browse by continent** — organized by continent → country → city
- 🌟 **Popular cities** — quick access to frequently used cities
- 💬 **Interactive UI** — inline keyboards for easy navigation
- 📱 **Simple commands** — just type a city name or use buttons

---

## 🤖 Commands

| 🎯 Command | 📝 Description |
|---|---|
| `/start` | Welcome message and main menu |
| `/help` | Show available commands |
| `/time` | Get current time for a city |
| `/diff` | Compare times between two cities |

**Or simply type any city name** (e.g., `London`, `New York`, `Tokyo`)

---

## 📁 Project Structure

```
src/
├── 🤖 handlers/          # Bot command and callback handlers
│   ├── callback/         # Callback query handlers (menu, continent, city)
│   ├── command_handler.py
│   ├── callback_handler.py
│   └── message_handler.py
├── 🌐 services/          # Business logic
│   ├── city_mapper.py    # City → timezone mapping
│   └── timezone_service.py
├── 🗂️ state/             # User state management
│   └── user_state_manager.py
├── 💬 ui/                # User interface
│   ├── keyboard_builder.py
│   └── message_formatter.py
├── bot.py                # Main bot application
├── config.py             # Configuration and logging
└── time_bot.py           # Entry point
```

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BOT_TOKEN` | ✅ | Token from @BotFather |
| `DOCKER_IMAGE_TAG` | ❌ | Docker image tag (default: latest) |

See `.env.example` for the template.

---

## 🌍 Supported Cities

**Europe:** London, Paris, Berlin, Moscow, Rome, Madrid, Amsterdam, and 100+ more  
**Asia:** Tokyo, Beijing, Dubai, Singapore, Mumbai, Seoul, Bangkok, and more  
**North America:** New York, Los Angeles, Chicago, Toronto, Mexico City, and more  
**South America:** São Paulo, Buenos Aires, Lima, Bogotá, and more  
**Africa:** Cairo, Lagos, Johannesburg, Nairobi, and more  
**Oceania:** Sydney, Melbourne, Auckland, and more

---

## 🤝 Contributing

🎉 Contributions are welcome.

| 🎯 Situation | 🚀 Action |
|---|---|
| 🐛 Found a bug | [Open an issue](https://github.com/Sunagatov/Memora/issues/new) with the `bug` label |
| 💡 Want a feature | Start a [Discussion](https://github.com/Sunagatov/Memora/discussions) first |
| 👨💻 Ready to code | Pick an issue, comment "I'm on it" |

---

## 📄 License

📜 [MIT](LICENSE) — free to use, modify, and distribute.

---

## 📞 Contact

- 💬 **Telegram community:** [Zufar Explained IT](https://t.me/zufarexplained)
- 👤 **Personal Telegram:** [@lucky_1uck](https://web.telegram.org/k/#@lucky_1uck)
- 📧 **Email:** [zufar.sunagatov@gmail.com](mailto:zufar.sunagatov@gmail.com)
- 🐛 **Issues:** [GitHub Issues](https://github.com/Sunagatov/Memora/issues)

❤️
