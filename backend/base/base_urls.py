from django.urls import path
import base.views as views

urlpatterns = [
    path('', views.firstAPI, name='first'),
]