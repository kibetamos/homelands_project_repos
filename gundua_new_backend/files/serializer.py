from dataclasses import fields
from unicodedata import category
from rest_framework import serializers
from .models import File,Categories,case_creation_model,complainant,defendant,Counties
# from gunduaLegalAnalytic.gunduanlp.Models.retrive_cases import *



# serializers



class file_serializer(serializers.ModelSerializer):
    class Meta:
        model=File
        fields=['id','author','file','remark','timestamp','summary']


class Case_serializer(serializers.ModelSerializer):
           
           class Meta:
            model=case_creation_model
            fields = '__all__'
            # fields='__all__'
class Categories_serializer(serializers.ModelSerializer):
           
           class Meta:
            model=Categories
            fields='__all__'

class complainant_serializer(serializers.ModelSerializer):
           
           class Meta:
            model=complainant
            fields='__all__'
            
class defendant_serializer(serializers.ModelSerializer):
           
           class Meta:
            model=defendant
            fields='__all__'
            

class Counties_serializer(serializers.ModelSerializer):
           
           class Meta:
            model=Counties
            fields='__all__'
            

                      
        
        