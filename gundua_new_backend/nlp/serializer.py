from rest_framework import serializers
from django.contrib.auth.models import User
from nlp.Models.retrive_cases import *
import os
from .models import Audio

from authentication.serializer import ProfileSerializer

class Audio_serializer(serializers.ModelSerializer):
    # user=ProfileSerializer(read_only=True)

    class Meta:
        model=Audio
        fields=['id','user','file','name','text']
    # def create(self,validated_data):
    #     user=self.request.user

    #     return Audio.objects.create(user=user,**validated_data)


        
        