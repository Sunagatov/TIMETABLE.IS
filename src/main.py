from telegram.ext import *

import responses as R

def handle_messages(update,context):
    text = str(update.message.text)
    response = R.sample_responses(text)
    update.message.reply_text(response)

updater = Updater('6096643063:AAEufVQ0SgLMR4bH-8jI0zaZ2E16VNLDZVs')
d = updater.dispatcher
d.add_handler(MessageHandler(Filters.text, handle_messages))
updater.start_polling()
updater.idle()