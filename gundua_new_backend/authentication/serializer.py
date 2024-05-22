import email
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib.auth.hashers import make_password

from django.conf import settings
from django.template.loader import get_template
from django.template import Context
from django.template.loader import render_to_string, get_template
from django.core.mail import EmailMessage

from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.core.mail import send_mail, BadHeaderError

from django.contrib import messages
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.template.loader import render_to_string
#from .tokens import account_activation_token
from django.core.mail import EmailMultiAlternatives
from .models import Profile

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
            token = {}

            token = super(MyTokenObtainPairSerializer, cls).get_token(user)
            # Add custom claims
            token['username'] = user.username
        
            return token
    
    def validate(self, attrs):
            data = super().validate(attrs)
            refresh = self.get_token(self.user)
            data['refresh'] = str(refresh)
            # data.pop('refresh', None) # remove refresh from the payload
            data['access'] = str(refresh.access_token)
            data['id'] =self.user.pk
            data['first_name'] =self.user.first_name
            data['last_name'] =self.user.last_name

            return data





class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )

    password = serializers.CharField(required=True, validators=[validate_password])
    password2 = serializers.CharField(required=True,write_only=True)

    class Meta:
        model = User
        fields = ('id','email','password', 'password2',  'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password entered didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_active=True
        )

        
        user.set_password((validated_data['password']))
        user.save()


        request = self.context.get('request')

        current_site = get_current_site(request)

        ctx = {
            'user': user,
            'domain':"gundua.com",
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            #'token': account_activation_token.make_token(user),
        }

        # message = get_template("emails/account_activation_email.html").render(ctx)
        
        # msg = EmailMessage(
        #     "Gundua Account Activation",
        #     message,
        #     settings.EMAIL_HOST_USER,
        #     [user.email],
        # )
        # msg.content_subtype = "html"  # Main content is now text/html
        # msg.send()
        print("Mail successfully sent")
      

        return user



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'