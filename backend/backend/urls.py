from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),
    path('api/users/', include('base.urls.user_urls')),
    path('api/groups/', include('base.urls.group_urls')),
]
