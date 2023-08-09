from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib.auth.models import User
from base.serializers import UserSerializer

@api_view(['GET'])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def firstAPI(request):
    # trips = Trip.objects.all()
    # serializer = TripSerializer(trips, many=True)
    # return Response(serializer.data)
    return Response('hello there')