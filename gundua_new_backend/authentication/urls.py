# importing libraries
from  rest_framework.routers import DefaultRouter
from django.urls import  path,include
import uuid

# importing views
from .views import UserProfileView,RegisterView,MyObtainTokenPairView
from rest_framework_simplejwt.views import TokenRefreshView


##
router=DefaultRouter()
router.register(r'registration',RegisterView,basename='registration')
router.register(r'profile',UserProfileView,basename='profile')


urlpatterns =[
   
    path(r'', include(router.urls)),
    path('login/', MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),



]