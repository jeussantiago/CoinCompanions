from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from base.serializers import UserSerializer, UserSerializerWithToken


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for field, val in serializer.items():
            data[field] = val

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    """
    registers a user

    :param request: request.data holds form data, specifially name, email, and password
    :return: newly registered user data with token auth
    """
    data = request.data

    print('here')
    print(data)

    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            # passwords can't be stored in raaw form, so we have to hash it first
            password=make_password(data['password'])
        )

        # when we first register a user, we want to return the auth token right away
        # this is why we are using this serializer vs the normal UserSerializer
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except:
        # matching emails, can't create object if email/username already exists
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    """
    logged in user can update their data

    :param request: request.data holds form data, specifially name, email, and password
    :               request.user holds the current logged in user
    :return: newly updated user data with new token auth
    """
    user = request.user
    # since the data has changed, you want to get a new auth token
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    # a user can update their profile without updating their password
    # we update the password if the user specifies there is a new password
    if data['password']:
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    """
    logged in user can retrieve their data

    :param request: request.user holds the current logged in user
    :return: json user data (no token)
    """
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def adminDeleteUser(request, pk):
    """
    Admin can delete a user
    logged in user can retrieve their datra

    :param pk: id of user to delete
    :return: string confirmation
    """
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response('User was deleted')


@api_view(['GET'])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


# @api_view(['GET'])
# def firstAPI(request):
#     # trips = Trip.objects.all()
#     # serializer = TripSerializer(trips, many=True)
#     # return Response(serializer.data)
#     return Response('hello there')
