from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, blank=True, related_name='members')
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name