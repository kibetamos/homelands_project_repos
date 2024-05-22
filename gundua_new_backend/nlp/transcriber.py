import speech_recognition as sr
from pydub import AudioSegment
from os.path import abspath
import os
# Load the audio file
# audio_file_path = "path/to/audio.wav"

def transcriber(audio_file_path):
    r = sr.Recognizer()
    if audio_file_path.endswith('.wav'):
        with sr.AudioFile(audio_file_path) as audio_file:
            audio_data = r.record(audio_file)

        # Transcribe audio
        transcription = r.recognize_google(audio_data,language='en-US')
    
    elif audio_file_path.endswith('.mp3'):
        soud=AudioSegment.from_mp3(audio_file_path)

        soud.export(os.path.join('media/files/')+''+'dst.wav',format="wav")
        # print("here")
        # print(abspath('dst.wav'))

        with sr.AudioFile(abspath('dst.wav')) as audio_file:
            audio_data = r.record(audio_file)

        # Transcribe audio
        transcription = r.recognize_google(audio_data,language='en-US')
    

        # transcription='Hello charles'
    else:
        transcription='Wrong file format please upload a mp3 or .wav file '


    return transcription
