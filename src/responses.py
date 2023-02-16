from datetime import datetime
import pytz


def sample_responses(user_input):
    input_text = str(user_input).lower()

    if input_text in ["/start", "hi", "hi!", "hello", "hey"]:
        return "Hey! I'm Alpha. Do you want to know the time or today's date?"

    if input_text in ["time", "time?"]:
        return "Do you want to know the time in India, England or United States?"

    if input_text == "india":
        time_zone = pytz.timezone('Asia/Kolkata')
        now = datetime.now(time_zone)
        return "Time -  " + now.strftime('%H : %M : %S')
    if input_text == "england":
        time_zone = pytz.timezone('Europe/London')
        now = datetime.now(time_zone)
        return "Time -  " + now.strftime('%H : %M : %S')
    if input_text in ["united states", "us"]:
        time_zone = pytz.timezone('America/New_York')
        now = datetime.now(time_zone)
        return "Time -  " + now.strftime('%H : %M : %S')

    if input_text in ["date", "date?"]:
        date = datetime.now()
        return date.strftime('%d - %B - %Y')

    if input_text in ["bye", "ttyl", "good bye"]:
        return "It was nice chatting with you. Bye!"

    return "Sorry,I didn't understand you"
