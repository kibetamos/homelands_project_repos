# importing libraries
from  rest_framework.routers import DefaultRouter
from django.urls import  path,include
import uuid

# importing views
from .views import file_view,file_summarize_view,case_creation_view,complainant_creation_view,defedant_creation_view

##
router=DefaultRouter()
router.register(r'files',file_view,basename='files')
router.register(r'case',case_creation_view,basename='new_case')
router.register(r'case/defendant',defedant_creation_view,basename='defendant')
router.register(r'case/complainant',complainant_creation_view,basename='complainant')


urlpatterns =[
   
    path(r'', include(router.urls)),
    path('summary/<int:pk>/', file_summarize_view.as_view(),name='summarizer_doc'),
]
