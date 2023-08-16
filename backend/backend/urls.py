from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('base.urls.user_urls')),
    path('api/groups/', include('base.urls.group_urls')),
]
