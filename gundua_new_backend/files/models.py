from enum import unique
from django.db import models
import uuid
from django.contrib.auth.models import User
import os


# Create your models here.
class File(models.Model):
    '''
    This Model  creates  database fo the uploaded files
    
    '''
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    author=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    file = models.FileField(blank=True, null=True,upload_to=os.path.join('medai/files/'))
    remark = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)
    summary=models.TextField(null=True)
    
    # def generate_upload_path(self,filename):
    #     return os.path.join('media/files/'+str(self.id),filename)
  
    def __str__(self):
            return f"<File {self.file} >"

class Categories(models.Model):
    '''
    This is a database of all categories of cases
    '''
    category=models.TextField(null=False,unique=True)
    
    def __str__(self) -> str:
         return super().__str__()



class case_creation_model(models.Model):
    choices=(
        ('RUNING','runing'),
        ('CLOSED','closed'),
        ('ARCHIVIED','archieved')
    )
    
    case_number=models.CharField(max_length=100)
    # complainant= models.ForeignKey(complainant,null=True)
    # defendant=models.ForeignKey(defendant,null=True)
    Start_date= models.DateTimeField(auto_now_add=True)
    last_modifie_date=models.DateTimeField(auto_now=True)
    case_status=models.CharField(default='runing',max_length=100, choices=choices)
    judges=models.TextField(max_length=100,blank=False,null=True)
    case_class=models.CharField(max_length=100)
    case_action=models.CharField(max_length=100)
    citation=models.TextField(max_length=100000)
    court_Division=models.CharField(max_length=1000)
    History_docket_number=models.TextField(max_length=2000,null=True,blank=True)
    Histroy_judges=models.TextField(max_length=2000,null=True,blank=True)
    case_outcome=models.TextField(max_length=200000000000,null=True,blank=True)
    Disclaimer=models.TextField(max_length=2000000,null=True,blank=True)
    
    # the procection
    evidence = models.FileField(blank=False, null=False,upload_to=os.path.join('medai/files/'))
    def __str__(self):
        return str(self.case_number)

    

class Counties(models.Model):
    county_name = models.CharField(max_length=300, blank=True, null=True)
    county_code = models.CharField(max_length=80, blank=True, null=True)
    county_abbrevation = models.CharField(max_length=80, blank=True, null=True)

    def __str__(self):
        return str(self.county_name)

    class Meta:
        verbose_name = 'County'
        verbose_name_plural = 'Counties'

  

class complainant(models.Model):
    f_name=models.TextField(max_length=100,null=True)
    m_name=models.TextField(max_length=100,null=True)
    l_name=models.TextField(max_length=100,null=True)
    case=models.ForeignKey(case_creation_model,on_delete=models.CASCADE,null=True)

    county=models.ForeignKey(Counties,on_delete=models.PROTECT,null=True)
    
    def __str__(self):
        return str(self.f_name)





class defendant(models.Model):
    complainant=models.ForeignKey(complainant,null=True,on_delete=models.CASCADE)
    f_name=models.TextField(max_length=100,null=True)
    m_name=models.TextField(max_length=100,null=True)
    l_name=models.TextField(max_length=100,null=True)
    case=models.ForeignKey(case_creation_model,on_delete=models.CASCADE,null=True)

    county=models.ForeignKey(Counties,on_delete=models.PROTECT,null=True)

    def __str__(self):
        return str('self.f_name')







    