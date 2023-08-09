from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Trip

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TripSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = ['id', 'name', 'members']