from django.urls import path,include
from  rest_framework.routers import DefaultRouter

# importing views

from .views import all_cases_view,full_text_search_view,text_summarizer,case_by_id,list_category_bt_case,similar_cases_view,speech_view,audio_transcriber,search_by_judge_view,all_categories,adhoc_search_view


router=DefaultRouter()
router.register(r'transcription',speech_view,basename='files')

urlpatterns = [
    path('cases/',all_cases_view.as_view(),name='cases'),
    path(r'', include(router.urls)),
    path('text/<int:pk>/',audio_transcriber.as_view(),name='audio_text'),

    path('cases/search/<str:text>/',search_by_judge_view.as_view(),name='search_by_judge'),
    
    path('cases/<int:case_id>/',case_by_id.as_view(),name='casebyid'),
    path('cases/all_cat',all_categories.as_view(),name='all_cat'),
    path('cases/category/<str:text>/',list_category_bt_case.as_view(),name='list_category_bt_case'),
    path('cases/fulltext/<str:text>/',full_text_search_view.as_view(),name='fulltext'),
    path('cases/summary/<str:text>',text_summarizer.as_view(),name='summary'),
    path('cases/similar/<str:text>/',similar_cases_view.as_view(),name='similar_cases'),
    path('cases/adhoc/<str:name>/<str:cls>/<str:case_class>/',adhoc_search_view.as_view(),name='adhoc-search'),
    
]
