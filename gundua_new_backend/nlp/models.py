from django.db import models

# Create your models here.

from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import os

class Audio(models.Model):

	user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
	name=models.TextField(blank=False,max_length=20)
	file=models.FileField(blank=True, null=True,upload_to=os.path.join('medai/files/audio_files'))
	text=models.TextField(max_length=2000000000000000000000000000000,blank=True)
	time=models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"<file {self.file} >"
	class meta:
		ordering=['time']






