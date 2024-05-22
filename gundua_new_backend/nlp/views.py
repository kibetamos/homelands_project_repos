from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from docx import Document
import PyPDF2 
import textract
from rest_framework import generics,status
from django.conf import settings
# importing the nlp modules
from nlp.Models.summarizer import summarize

from nlp.Models.retrive_cases import *
# importing paginator
# importing serializer
# from .serializer import cases_serializer
from files.paginator import CustomPagination 
from django.core.paginator import Paginator
import json
from rest_framework.permissions import IsAdminUser,IsAuthenticated,IsAuthenticatedOrReadOnly
from authentication.models import Profile

from .serializer import Audio_serializer
from .models import Audio
# importing transcriber

from .transcriber import transcriber

# Create your views here.

class speech_view(viewsets.ModelViewSet):

    '''
    This view allow the user to upload an audio file. 

    '''
    queryset=Audio.objects.all()
    serializer_class=Audio_serializer
    pagination_class=CustomPagination
    permission_classes=(IsAuthenticated,)

    # Audio.objects.update(user=)

    # File.objects.filter(id=pk).update(summary=summary) 

    # def perform_create(self,request):
    #     serializer=self.serializer_class(author=self.request.user)


    # def perform_create(self,request):
    #     self.serializer_class(user=request.user)
        
    # def perform_update(self):
    #     self.serializer_class(user=request.user)

      

    def get_queryset(self):

        if not self.request.user.id:
             data=Audio.objects.none()

        else:
            # super().get_queryset().update(user=self.request.user)

            data=super().get_queryset().filter(user=self.request.user)
            
        # Audio.objects.filter(user=self.request.user).update(user=self.request.user) 
        # data.objects.update(user=self.request.user)
        # print(data.user)

        return data
    def perform_create(self,serializer):
        serializer.save(user=self.request.user)    





class audio_transcriber(generics.GenericAPIView):

    '''This  allows the user to transcribe  a file
    '''
    queryset=Audio.objects.all()
    serializer_class=Audio_serializer
    pagination_class=CustomPagination
    permission_classes=(IsAuthenticated,)

    def get(self,request,pk):
        file=get_object_or_404(Audio,id=pk)
        # file=File.objects.filter(pk=pk)
        serializer=self.serializer_class(instance=file)
        data=serializer.data
        
        print(data['file'])
    
        
        path=(str(settings.BASE_DIR)+""+str(data['file']))

        text=transcriber(path)
        # text="hello"

        Audio.objects.filter(id=pk).update(text=text)

        return Response({'speech_text':text},status=status.HTTP_200_OK)

    

    

class all_cases_view(generics.ListAPIView):
    '''list all cases
    This view is available to the public
    '''
    queryset =get_cases()
    
    pagination_class=CustomPagination
    
    def get_serializer_class(self):
        return get_cases()
    
    def get(self,request):
        cases=self.queryset
        p=Paginator(cases,5)
        page=request.GET.get('page')
        
        return Response(cases,status=status.HTTP_200_OK)
    
     
     
class full_text_search_view(generics.ListAPIView):
    
    queryset=full_text_search('')
    
    def get(self,request,text):
        cases=full_text_search(text)
        
        return Response(cases,status=status.HTTP_200_OK)
        

class search_by_judge_view(generics.ListAPIView):

    '''
This enable case search by judge name
    '''
    queryset=search_by_judge('')

    def get(self,request,text):
        cases=search_by_judge(text)

        return Response(cases,status=status.HTTP_200_OK)
    
class adhoc_search_view(generics.ListAPIView):
    ''''
    This will enable boolean algebra search
    '''
    queryset=adhoc_search('','','')
    
    def get(self,request,name,cls,case_class):
        cases=adhoc_search(name=name,cls=cls,case_class=case_class)
        
        return Response(cases,status=status.HTTP_200_OK)
        


   
class list_category_bt_case(generics.ListAPIView):
    '''
    Perform a category text search on cases
    '''
    queryset=get_categorized_cases("")
    
    def get(self,request,text):
        categorized_cases = get_categorized_cases(text)
        return Response(categorized_cases,status=status.HTTP_200_OK)
    
            
class case_by_id(generics.ListAPIView):
    '''This api allows the user to search case by id
    '''
    
    # queryset=get_case('')
    
    def get(self,request,case_id):
        case=get_case(case_id)
        
        return Response(case,status=status.HTTP_200_OK)


  
class text_summarizer(generics.GenericAPIView):
    '''
    This model is used to summarize pasted text
    ARG: text pasted in the  text area
    results: summary of the text
    '''
    def get(self,request,text):
        serializer_class={
            'default':None
        }
        summary=summarize(text)
        return Response(data={'summary':summarize(text)},status=status.HTTP_200_OK)         
        
    
    
class similar_cases_view(generics.ListAPIView):
    queryset=get_similar_cases('')
    permission_classes = (IsAuthenticated,)

    def get(self,request,text):
        
        user_id=self.request.user
        user_profile=Profile.objects.get(user=user_id)
        print(user_id)
        user_type=user_profile.user_type
        print(user_type)
        
        similar_cases=get_similar_cases(text)
        
        if(user_type =="Bar"):
        
            return Response(similar_cases,status=status.HTTP_200_OK)
        
        elif(user_type =="Bench"):
            
            return Response(similar_cases,status=status.HTTP_200_OK)
        else:
            
            return Response({"Data":"Public Not allowed"},status=status.HTTP_200_OK)




class all_categories(generics.ListAPIView):
    '''This api allows the user to search case by id
    '''
    
    queryset=list_all_categories()
    
    def get(self,request):
        case=list_all_categories()
        
        return Response(case,status=status.HTTP_200_OK)
            
           
        
    
        
 
    
    
            
        
        
    


    
           
    


