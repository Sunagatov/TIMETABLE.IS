import telegram
from timetable_is import Timetable

# Create a Telegram bot
bot = telegram.Bot(YOUR_BOT_TOKEN)

class TimetableHandler:
    def __init__(self):
        self.timetable = Timetable()

    def get_timetable_for_grade(self, grade):
        return self.timetable.get_timetable_for_grade(grade)

    def create_timetable(self, timetable_data):
        self.timetable.create_timetable(timetable_data)

    def edit_timetable(self, timetable_id, timetable_data):
        self.timetable.edit_timetable(timetable_id, timetable_data)

    def delete_timetable(self, timetable_id):
        self.timetable.delete_timetable(timetable_id)

timetable_handler = TimetableHandler()

# Define a command handler for the `/timetable` command
@bot.message_handler(commands=['timetable'])
def timetable_command(message):
    # Get the grade from the message text
    grade = message.text.split()[1]

    # Get the timetable for the specified grade
    timetable = timetable_handler.get_timetable_for_grade(grade)

    # Send the timetable to the user
    bot.send_message(message.chat.id, timetable)

# Define a command handler for the `/create_timetable` command
@bot.message_handler(commands=['create_timetable'])
def create_timetable_command(message):
    # Get the timetable data from the message text
    timetable_data = message.text.split()[1:]

    # Create the timetable
    timetable_handler.create_timetable(timetable_data)

    # Send a confirmation message to the user
    bot.send_message(message.chat.id, "Timetable created successfully.")

# Define a command handler for the `/edit_timetable` command
@bot.message_handler(commands=['edit_timetable'])
def edit_timetable_command(message):
    # Get the timetable ID and timetable data from the message text
    timetable_id, timetable_data = message.text.split()[1:]

    # Edit the timetable
    timetable_handler.edit_timetable(timetable_id, timetable_data)

    # Send a confirmation message to the user
    bot.send_message(message.chat.id, "Timetable edited successfully.")

# Define a command handler for the `/delete_timetable` command
@bot.message_handler(commands=['delete_timetable'])
def delete_timetable_command(message):
    # Get the timetable ID from the message text
    timetable_id = message.text.split()[1]

    # Delete the timetable
    timetable_handler.delete_timetable(timetable_id)

    # Send a confirmation message to the user
    bot.send_message(message.chat.id, "Timetable deleted successfully.")

# Start the bot
bot.start_polling()
