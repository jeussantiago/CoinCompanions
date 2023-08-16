from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from base.serializers import UserSerializer, UserSerializerWithToken, UserFriendsSerializer, FriendRequestSerializer
from django.contrib.auth.models import User
from base.models import FriendRequest, UserFriends


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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFriendsList(request):
    user = request.user
    try:
        user_friends = UserFriends.objects.get(user=user)
    except UserFriends.DoesNotExist:
        # if user does not have any friends, will return error
        return Response({"error": "User profile has no friends"}, status=404)

    friends = user_friends.friends.all()
    serializer = UserSerializer(friends, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sendFriendRequest(request, to_user_id):
    from_user = request.user
    try:
        to_user = User.objects.get(id=to_user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if from_user == to_user:
        return Response({"error": "You cannot send a friend request to yourself"}, status=400)

    # Check if UserFriends record exists for from_user
    from_user_friends, _ = UserFriends.objects.get_or_create(user=from_user)

    # Check if users are already friends
    if from_user_friends.friends.filter(id=to_user_id).exists():
        return Response({"error": "Users are already friends"}, status=400)

    # Check if a friend request already exists between the same users
    existing_request = FriendRequest.objects.filter(
        from_user=from_user, to_user=to_user, accepted=False)
    if existing_request.exists():
        return Response({"error": "Friend request already sent to this user"}, status=400)

    # Check if to_user has already sent a friend request
    if FriendRequest.objects.filter(from_user=to_user, to_user=from_user, accepted=False).exists():
        return Response({"error": "User has already sent a friend request to you"}, status=400)

    FriendRequest.objects.create(from_user=from_user, to_user=to_user)
    return Response({"message": "Friend request sent"}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def acceptFriendRequest(request, friend_request_id):
    try:
        friend_request = FriendRequest.objects.get(
            id=friend_request_id, to_user=request.user)
    except FriendRequest.DoesNotExist:
        return Response({"error": "Friend request not found"}, status=404)

    if friend_request.accepted:
        return Response({"error": "Friend request already accepted"}, status=400)

    # Delete the friend request record
    friend_request.delete()

    from_user = friend_request.from_user
    to_user = friend_request.to_user

    # Users may not have any friends yet, create a new record if one doesn't exist
    from_user_friends, _ = UserFriends.objects.get_or_create(user=from_user)
    to_user_friends, _ = UserFriends.objects.get_or_create(user=to_user)

    # add each person to each other's friend list
    from_user_friends.friends.add(to_user)
    to_user_friends.friends.add(from_user)

    return Response({"message": "Friend request accepted"}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSentFriendRequests(request):
    sent_requests = FriendRequest.objects.filter(from_user=request.user)
    serializer = FriendRequestSerializer(sent_requests, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getReceivedFriendRequests(request):
    received_requests = FriendRequest.objects.filter(
        to_user=request.user, accepted=False)
    serializer = FriendRequestSerializer(received_requests, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteFriendRequest(request, friend_request_id):
    '''
    User denies friend request from another user
    '''
    friend_request = get_object_or_404(
        FriendRequest, id=friend_request_id, to_user=request.user)
    friend_request.delete()
    return Response({"message": "Friend request deleted"}, status=200)
    # serializer = FriendRequestSerializer(friend_request, many=False)
    # return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def removeFriend(request, friend_id):
    '''
    User unfriends friend_id and friend_id unfriends User
    '''
    user = request.user
    try:
        friend_to_remove = User.objects.get(id=friend_id)
    except User.DoesNotExist:
        return Response({"error": "Friend not found"}, status=404)

    # user friends
    user_friends = UserFriends.objects.get(user=user)
    # other person's friends
    friend_to_remove_friends = UserFriends.objects.get(user=friend_to_remove)

    # Remove the friend from the friends list for both users
    user_friends.friends.remove(friend_to_remove)
    friend_to_remove_friends.friends.remove(user)

    return Response({"message": "Unfriended successfully"}, status=200)
