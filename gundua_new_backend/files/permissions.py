from rest_framework import permissions

from django.contrib.auth.models import User
from authentication.models import Profile
from files.models import File



class is_owner(permissions.BasePermission):
    message='you can only view your files only'
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user
    
        
        
        
            
    