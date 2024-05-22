from django.contrib import admin
from .models import File,Categories,Counties,case_creation_model,complainant,defendant

# Register your models here.

admin.site.register(File)
admin.site.register(Categories)
admin.site.register(Counties)
admin.site.register(case_creation_model)
admin.site.register(complainant)
admin.site.register(defendant)
