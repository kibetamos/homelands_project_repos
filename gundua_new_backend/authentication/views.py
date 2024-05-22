from django.shortcuts import render
from django.shortcuts import render
# from .serializers import MyTokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.models import User
from .serializer import RegisterSerializer,ProfileSerializer,MyTokenObtainPairSerializer
from rest_framework import generics
from .models import Profile

from django.contrib.auth import login
from django.contrib.auth.models import User
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.conf import settings
from django.views.generic import View
from django.contrib import messages #import messages
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect,HttpResponse
from rest_framework import viewsets

# Create your views here.

class MyObtainTokenPairView(TokenObtainPairView):

    """
    Generate user authentication token.

    """
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer



class RegisterView(viewsets.ModelViewSet):

    """
    Create new user account.

    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer



class UserProfileView(viewsets.ModelViewSet):

    """
    Update  user account ProfileSerializer.

    """
    queryset = Profile.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = ProfileSerializer