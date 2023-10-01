import telegram
from timetable_is import Timetable

# Create a Telegram bot
bot = telegram.Bot(YOUR_BOT_TOKEN)

# Define a function to get the timetable for a specific grade
def get_timetable_for_grade(grade):
    timetable = Timetable()
    return timetable.get_timetable_for_grade(grade)

# Define a function to create a timetable
def create_timetable(timetable_data):
    timetable = Timetable()
    timetable.create_timetable(timetable_data)

# Define a function to edit a timetable
def edit_timetable(timetable_id, timetable_data):
    timetable = Timetable()
    timetable.edit_timetable(timetable_id, timetable_data)

# Define a function to delete a timetable
def delete_timetable(timetable_id):
    timetable = Timetable()
    timetable.delete_timetable(timetable_id)

# Define a command handler for the `/timetable` command
@bot.message_handler(commands=['timetable'])
def timetable_command(message):
    # Get the grade from the message text
    grade = message.text.split()[1]

    # Get the timetable for the specified grade
    timetable = get_timetable_for_grade(grade)

    # Send the timetable to the user
    bot.send_message(message.chat.id, timetable)

# Define a command handler for the `/create_timetable` command
@bot.message_handler(commands=['create_timetable'])
def create_timetable_command(message):
    # Get the timetable data from the message text
    timetable_data = message.text.split()[1:]

    # Create the timetable
    create_timetable(timetable_data)

    # Send a confirmation message to the user
    bot.send_message(message.chat.id, "Timetable created successfully.")

# Define a command handler for the `/edit_timetable` command
@bot.message_handler(commands=['edit_timetable'])
def edit_timetable_command(message):
    # Get the timetable ID and timetable data from the message text
    timetable_id, timetable_data = message.text.split()[1:]

    # Edit the timetable
    edit_timetable(timetable_id, timetable_data)

    # Send a confirmation message to the user
    bot.send_message(message.chat.id, "Timetable edited successfully.")

# Define a command handler for the `/delete_timetable` command
@bot.message_handler(commands=['delete_timetable'])
def delete_timetable_command(message):
    # Get the timetable ID from the message text
    timetable_id = message.text.split()[1]

    # Delete the timetable
    delete_timetable(timetable_id)

    # Send a confirmation message to the user
    bot.send_message(message.chat.id, "Timetable deleted successfully.")

# Start the bot
bot.start_polling()