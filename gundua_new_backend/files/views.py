from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from docx import Document
import PyPDF2 
import textract
from rest_framework import generics,status
from django.conf import settings


# importing  summary libraries

from nlp.Models.summarizer import summarize




from .models import File,Categories,case_creation_model,complainant,defendant,Counties

# importing serialization
from .serializer import file_serializer,Case_serializer,Categories_serializer,complainant_serializer,defendant_serializer,Counties_serializer
from .paginator import CustomPagination

# permmisions

from .permissions import is_owner
from rest_framework.permissions import IsAdminUser,IsAuthenticated,IsAuthenticatedOrReadOnly



# creating views


class file_view(viewsets.ModelViewSet):
    '''
    A view set that  allows user to retrive,delete, update, upload files
    '''
    queryset=File.objects.all()
    serializer_class=file_serializer
    pagination_class=CustomPagination
    permission_classes=(IsAuthenticated,)

    def get_queryset(self):
        if not self.request.user.id:
            data=File.objects.none()
        else:
            #super().get_querryset()

            data=super().get_queryset().filter(author=self.request.user)
        return data
    def perform_create(self,serializer):
        serializer.save(author=self.request.user)


    
    
    # def list(self,request):
    #     paginator=self.pagination_class
    #     serializer=self.serializer_class(self.queryset,many=True)
    #     return Response(serializer.data)
    # def retrive(self,request,pk=None):
    #     serializer=self.serializer_class(get_object_or_404(self.queryset,pk=pk))
    #     return Response(serializer.data)
    # def create(self,request):
    #     paginator=self.pagination_class
    #     serializer=self.serializer_class(self.queryset,many=True)
    #     return Response(serializer.data)
    # def destroy(self,request,pk=None):
    #     serializer=self.serializer_class(get_object_or_404(self.queryset,pk=pk))
    #     return Response(serializer.data)
    
class file_summarize_view(generics.GenericAPIView):
   
    '''
    Get a summary of certain  document
    '''
    
    # serializer_class = summarySerializer
    serializer_class=file_serializer
    
    queryset=File.objects.all()
    
    def get(self,request,pk):
        
        file=get_object_or_404(File,id=pk)
        # file=File.objects.filter(pk=pk)
        serializer=self.serializer_class(instance=file)
        data=serializer.data
        
        print(data['file'])
    
        
        path=(str(settings.BASE_DIR)+""+str(data['file']))
        # print(path)
        summary=[]
        if path.endswith('.docx'):
            doc=Document(path)

            text=[]
            
            for p in doc.paragraphs:
                text.append(p.text)
            text="\n".join(text) 
            # print(text)
            summary=summarize(text)
                      
            
            
            
        elif  path.endswith('.pdf'):
           
            text=[]
            doc=open(path,'rb')
            pdfReader=PyPDF2.PdfFileReader(doc)
            
            # number of pages
            pages=pdfReader.numPages
            count=0
            while count<pages:
                pageobj=pdfReader.getPage(count)
                count +=1
                text.append(pageobj.extractText())
            if text != "":
                text =text
            else:
                text=textract.process(fileurl,method='tesseract',language='eng') 
                   
                
            
            
            text=''.join(text)
            # print(text)  
            print(summarize(text))  
            summary=summarize(text)
        File.objects.filter(id=pk).update(summary=summary) # this upates  the summary of eact document from null to summary
        
        return Response({'summary':summary},status=status.HTTP_200_OK)
    
    

class case_creation_view(viewsets.ModelViewSet):
    '''
This view allows  the user to create the cases
    '''
    queryset=case_creation_model.objects.all()
    serializer_class=Case_serializer
    pagination_class=CustomPagination
    permission_classes=(IsAuthenticated,)

    # def get

class complainant_creation_view(viewsets.ModelViewSet):
    '''
This view allows  the user to create/register the case complinant
    '''
    queryset=complainant.objects.all()
    serializer_class=complainant_serializer
    pagination_class=CustomPagination
    permission_classes=(IsAuthenticated,)

class defedant_creation_view(viewsets.ModelViewSet):
    '''
This view allows  the user to create or register case defentand(s)
    '''
    queryset=defendant.objects.all()
    serializer_class=defendant_serializer
    pagination_class=CustomPagination
    permission_classes=(IsAuthenticated,)
