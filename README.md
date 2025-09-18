# TIME.IS
Sophisticated Telegram bot that provides:
- Current time for any major city worldwide
- Time difference calculation between cities
- Support for 50+ major cities across all continents

## Features
- 🕐 Get current time for any supported city
- ⏰ Calculate time differences between cities
- 🌍 Support for major cities worldwide
- 💬 Interactive command interface
- 🔄 Real-time polling updates

## Setup
1. Install dependencies: `pip install -r requirements.txt`
2. Get a bot token from @BotFather on Telegram
3. Set environment variable: `export BOT_TOKEN=your_token`
4. Run: `python src/time_bot.py`

## Commands
- `/start` - Welcome message and help
- `/time <city>` - Get current time for a city
- `/diff <city1> <city2>` - Get time difference between cities
- `/help` - Show available commands

## Examples
- `/time London`
- `/time New_York`
- `/diff Tokyo London`
- `/diff New_York Sydney`
