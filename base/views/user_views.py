from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.hashers import make_password
from django.db.models.functions import Coalesce
from django.shortcuts import get_object_or_404
from django.db.models import Q, Sum, ExpressionWrapper, DecimalField
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from collections import defaultdict

from base.serializers import UserSerializer, UserSerializerWithToken, FriendRequestSerializer, GroupSerializer, DebtSerializer, ExpenseSerializer, GroupSerializerForGetUserGroupsView
from django.contrib.auth.models import User
from base.models import FriendRequest, UserFriends, Group, Debt, Expense


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
        message = {'message': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# def google_login(request):
#     '''
#     uses token authentication rather than JWT atuhentication
#     '''

#     # Receive the ID token from the frontend
#     id_token_from_frontend = request.data.get('idToken')

#     try:
#         # Verify the Google ID token
#         id_info = id_token.verify_oauth2_token(
#             id_token_from_frontend, google_requests.Request())

#         # Extract user data from the verified token
#         user_data = {
#             "first_name": id_info.get("name"),
#             "email": id_info.get("email"),
#         }

#         # Check if a user with the given email exists in your database
#         user, created = User.objects.get_or_create(email=user_data['email'])

#         # new user
#         if created:
#             user.name = user_data['name']
#             user.username = user_data['email']
#             user.set_unusable_password()  # Set an unusable password for token auth
#             user.save()

#         serializer = UserSerializer(user)
#         return Response(serializer.data)

#     except ValueError as e:
#         return Response({'message': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


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

    # This project doesn't allow staff accounts to update their data so that users who want to
    # try out the project can just use a staff account
    if user.is_staff:
        return Response({"error": "Staff members are not allowed to update their profiles."}, status=status.HTTP_403_FORBIDDEN)

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
def searchUsers(request):
    '''
    User able to search for other users. Results are based on query
    Results do not include the user, their friends, users who have sent friend requests to the user, or
    users to whom the current user has sent friend requests.
    '''
    query = request.query_params.get('query', '')
    current_user = request.user

    # Try to get the user's friends from the UserFriends model - empty list if doesn't have friends
    try:
        user_friends = UserFriends.objects.get(user=current_user).friends.all()
    except UserFriends.DoesNotExist:
        # If UserFriends doesn't exist, create it for the user
        user_friends = UserFriends.objects.create(
            user=current_user).friends.all()

     # Get users who have sent a friend request to the current user
    friend_requests_received = FriendRequest.objects.filter(
        to_user=current_user)

    # Get users to whom the current user has sent friend requests
    friend_requests_sent = FriendRequest.objects.filter(from_user=current_user)

    # Combine user IDs of friends, users who have sent friend requests, and users to whom the current user has sent friend requests
    excluded_users_ids = [current_user.id] + list(user_friends.values_list('id', flat=True)) + list(
        friend_requests_received.values_list('from_user', flat=True)) + list(friend_requests_sent.values_list('to_user', flat=True))

    # Exclude users who are already friends, users who have sent friend requests, and users to whom the current user has sent friend requests
    users = User.objects.exclude(id__in=excluded_users_ids)

    if query:
        # Perform a case-insensitive search for users' usernames and emails
        users = users.filter(
            Q(username__icontains=query) | Q(email__icontains=query)
        )

    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFriendsList(request):
    user = request.user
    try:
        user_friends = UserFriends.objects.get(user=user)
        friends = user_friends.friends.all()
        serializer = UserSerializer(friends, many=True)
        return Response(serializer.data)
    except UserFriends.DoesNotExist:
        # if user does not have any friends, will return empty list
        return Response([], status=200)


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


@api_view(['DELETE'])
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

    try:
        # user friends - remove other user
        user_friends = UserFriends.objects.get(user=user)
        user_friends.friends.remove(friend_to_remove)
    except UserFriends.DoesNotExist:
        pass

    try:
        # other person's friends - remove user
        friend_to_remove_friends = UserFriends.objects.get(
            user=friend_to_remove)
        friend_to_remove_friends.friends.remove(user)
    except UserFriends.DoesNotExist:
        pass

    return Response({"message": "Unfriended successfully"}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserGroups(request):
    user = request.user
    groups = Group.objects.filter(members=user)
    serializer = GroupSerializerForGetUserGroupsView(
        groups, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserDebt(request):
    '''
    Gets a list of users that this user owes with the corresponding amount. you get the total as 
    well as the grup breakdown that make up the total

    [
        {
            "id": 1,
            "name": "Jeus",
            "email": "jeus@email.com",
            "total_amount": 286.36,
            "debts_group_breakdown": [
                {
                    "amount": 286.36,
                    "group_id": 6,
                    "group_name": "another group "
                }
            ]
        },
        {
            "id": 3,
            "name": "tim",
            "email": "tim@email.com",
            "total_amount": 124.96,
            "debts_group_breakdown": [
                {
                    "amount": 124.96,
                    "group_id": 6,
                    "group_name": "another group "
                }
            ]
        }
    ]
    '''
    user = request.user
    debts = Debt.objects.filter(debtor=user)

    # Create a dictionary to store debtor data by their IDs
    creditor_dict = defaultdict(
        lambda: {'name': '', 'email': '', 'total_amount': 0, 'debts_group_breakdown': []})

    for debt in debts:
        creditor = debt.creditor
        creditor_id = creditor.id

        # Update the debtor's debts and total amount
        creditor_dict[creditor_id]['debts_group_breakdown'].append({
            'amount': float(debt.amount),
            'group_id': debt.group.id,
            'group_name': debt.group.name
        })
        creditor_dict[creditor_id]['total_amount'] += float(debt.amount)

        # Set debtor's name and email
        creditor_dict[creditor_id]['name'] = creditor.get_full_name()
        creditor_dict[creditor_id]['email'] = creditor.email

    # Create a list of debtor data from the dictionary
    creditor_dict = [{"id": creditor_id, **data}
                     for creditor_id, data in creditor_dict.items()]

    return Response(creditor_dict)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserCredit(request):
    '''
    Gets a list of users that owe this user. You receive information regarding the user
    the total amount they owe you. You then get a breakdown of the groups that this user
    owes the you

    [
        {
            "id": 11,
            "username": "david@email.com",
            "email": "david@email.com",
            "name": "david",
            "total_amount": 703.32,
            "debts": [
                {
                    "amount": 100.0,
                    "group_id": 7,
                    "group_name": "second"
                },
                {
                    "amount": 603.32,
                    "group_id": 6,
                    "group_name": "another group "
                }
            ]
        },
        {
            "id": 10,
            "username": "charlie@email.com",
            "email": "charlie@email.com",
            "name": "charlie",
            "total_amount": 286.36,
            "debts": [
                {
                    "amount": 286.36,
                    "group_id": 6,
                    "group_name": "another group "
                }
            ]
        }
    ]
    '''
    user = request.user
    debts = Debt.objects.filter(creditor=user)

    # Create a dictionary to store debtor data by their IDs
    debtor_dict = defaultdict(
        lambda: {'name': '', 'email': '', 'total_amount': 0, 'credits_group_breakdown': []})

    for debt in debts:
        debtor = debt.debtor
        debtor_id = debtor.id

        # Update the debtor's debts and total amount
        debtor_dict[debtor_id]['credits_group_breakdown'].append({
            'amount': float(debt.amount),
            'group_id': debt.group.id,
            'group_name': debt.group.name
        })
        debtor_dict[debtor_id]['total_amount'] += float(debt.amount)

        # Set debtor's name and email
        debtor_dict[debtor_id]['name'] = debtor.get_full_name()
        debtor_dict[debtor_id]['email'] = debtor.email

    # Create a list of debtor data from the dictionary
    debtor_debts = [{"id": debtor_id, **data}
                    for debtor_id, data in debtor_dict.items()]

    return Response(debtor_debts)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserGroupDebtCredit(request):
    '''
    key=group id
    val={
        total_credit: user's total credit from other users (other users owe user)
        total_debt: user's total debt to other users (user owes other users)
    }

    {
        "6": {
            "group_name": "another group",
            "total_credit": 464.67,
            "total_debt": null
        },
        "7": {
            "group_name": "second",
            "total_credit": 100.0,
            "total_debt": null
        },
        "17": {
            "group_name": "Good Name",
            "total_credit": null,
            "total_debt": null
        }
    }
    '''
    user = request.user

    # Retrieve all groups the user is a part of
    groups = Group.objects.filter(members=user)

    # Calculate the total debt and credit for each group and store in a dictionary
    group_debt_credit = {}
    for group in groups:
        total_credit_result = Debt.objects.filter(group=group, creditor=user).aggregate(
            total_amount=ExpressionWrapper(
                Sum('amount'),
                output_field=DecimalField()
            )
        )
        total_debt_result = Debt.objects.filter(group=group, debtor=user).aggregate(
            total_amount=ExpressionWrapper(
                Sum('amount'),
                output_field=DecimalField()
            )
        )

        # Access the results using the aliases
        total_credit = total_credit_result.get('total_amount', 0)
        total_debt = total_debt_result.get('total_amount', 0)

        group_debt_credit[group.id] = {
            'group_name': group.name,
            'total_credit': total_credit,
            'total_debt': total_debt,
        }

    return Response(group_debt_credit, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFriendInviteGroups(request):
    '''
    query_parameter: ?friend_user_id

    Gets a list of groups that the User is in. The list of groups excludes:
    1. groups that the friend is also a member off
    2. groups where the friend is already invited to
    '''
    user = request.user

    # Get the friend_user_id from the query parameters
    friend_user_id = request.query_params.get('friend_user_id', user.id)

    if friend_user_id is None:
        return Response({"error": "friend_user_id is required as a query parameter."}, status=status.HTTP_400_BAD_REQUEST)

    # Get groups that you are in but your friend is not
    groups = Group.objects.filter(members=user).exclude(
        Q(members=friend_user_id) | Q(
            groupinvitation__invitee=friend_user_id, groupinvitation__accepted=False)
    )

    serializer = GroupSerializer(groups, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
