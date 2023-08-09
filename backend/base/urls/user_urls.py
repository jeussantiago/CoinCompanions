from django.urls import path
from base.views import user_views as views

urlpatterns = [
    path('', views.firstAPI, name='first'),
    path('allusers', views.getUsers, name='allusers'),
]