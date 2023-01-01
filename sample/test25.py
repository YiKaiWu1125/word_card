from pygoogletranslation import Translator

translator = Translator()
str = "早上好"
rep =  translator.translate(str, dest='en')  
print(rep)