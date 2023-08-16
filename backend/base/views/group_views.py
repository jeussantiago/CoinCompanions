from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from base.serializers import GroupSerializer, GroupInvitationSerializer, UserFriendsSerializer, FriendRequestSerializer, ExpenseSerializer, ExpenseDetailSerializer
from django.contrib.auth.models import User
from base.models import Group, GroupInvitation, Expense, ExpenseDetail


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getGroupDetails(request, group_id):
    try:
        group = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.user not in group.members.all():
        return Response({"error": "You are not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

    serializer = GroupSerializer(group)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createGroup(request):
    '''
    request.data: json {'name': ""}
    '''
    group_name = request.data.get('name')

    if not group_name:
        return Response({"error": "Group name is required"}, status=status.HTTP_400_BAD_REQUEST)

    group = Group.objects.create(name=group_name)
    group.members.add(request.user)

    serializer = GroupSerializer(group)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateGroupName(request, group_id):
    try:
        group = Group.objects.get(id=group_id, members=request.user)
        new_group_name = request.data.get('name')

        if not new_group_name:
            return Response({"error": "New group name is required"}, status=status.HTTP_400_BAD_REQUEST)

        group.name = new_group_name
        group.save()

        serializer = GroupSerializer(group)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Group.DoesNotExist:
        return Response({"error": "Group not found or you are not a member of this group"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserInvitations(request):
    invitations = GroupInvitation.objects.filter(
        invitee=request.user, accepted=False)
    serializer = GroupInvitationSerializer(invitations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sendGroupInvitation(request, group_id, invitee_id):
    try:
        group = Group.objects.get(id=group_id)
        if request.user not in group.members.all():
            return Response({"error": "You are not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

        try:
            invitee = User.objects.get(id=invitee_id)
        except User.DoesNotExist:
            return Response({"error": "Invitee not found"}, status=status.HTTP_404_NOT_FOUND)

        if group.members.filter(id=invitee_id).exists():
            return Response({"error": "Invitee is already a member of this group"}, status=status.HTTP_400_BAD_REQUEST)

        if GroupInvitation.objects.filter(group=group, invitee=invitee).exists():
            return Response({"error": "Invitation already sent to this user"}, status=status.HTTP_400_BAD_REQUEST)

        GroupInvitation.objects.create(
            group=group, inviter=request.user, invitee=invitee)
        return Response({"message": "Invitation sent"}, status=status.HTTP_201_CREATED)
    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def acceptGroupInvitation(request, invitation_id):
    try:
        invitation = GroupInvitation.objects.get(
            id=invitation_id, invitee=request.user, accepted=False)

        # adding user to the group
        invitation.group.members.add(request.user)

        invitation.accepted = True
        invitation.save()
        return Response({"message": "Invitation accepted"}, status=status.HTTP_200_OK)
    except GroupInvitation.DoesNotExist:
        return Response({"error": "Invitation not found or already accepted"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def declineGroupInvitation(request, invitation_id):
    try:
        invitation = GroupInvitation.objects.get(
            id=invitation_id, invitee=request.user, accepted=False)
        invitation.delete()
        return Response({"message": "Invitation declined"}, status=status.HTTP_200_OK)
    except GroupInvitation.DoesNotExist:
        return Response({"error": "Invitation not found or already accepted"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createExpense(request, group_id):
    try:
        # Check if the data is correct format
        expense_details = request.data.get('expense_details', [])
        amount = request.data.get('amount')

        if amount is None:
            return Response({"error": "Amount is required for the expense"}, status=status.HTTP_400_BAD_REQUEST)

        if len(expense_details) == 0:
            return Response({"error": "At least one user must be specified in expense_details"}, status=status.HTTP_400_BAD_REQUEST)

        group = Group.objects.get(id=group_id)
        # check if total sum of owed is == amount payer payed. Check if users are part of the group too
        if request.user not in group.members.all():
            return Response({"error": "You are not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

        total_amount_owed = 0

        for detail in expense_details:
            user_id = detail.get('user')
            amount_owed = detail.get('amount_owed')

            if user_id is None or amount_owed is None:
                return Response({"error": "User ID and amount_owed are required for each expense detail"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = User.objects.get(id=user_id)
                if user not in group.members.all():
                    return Response({"error": f"User with ID {user_id} is not a member of this group"}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"error": f"User with ID {user_id} not found"}, status=status.HTTP_404_NOT_FOUND)

            total_amount_owed += amount_owed

        if total_amount_owed != amount:
            return Response({"error": "Total amount_owed must equal the expense amount"}, status=status.HTTP_400_BAD_REQUEST)

        # Create data
        expense_data = {
            'group': group,
            'description': request.data.get('description'),
            'amount': amount,
            'payer': request.user
        }

        expense = Expense.objects.create(**expense_data)

        for detail in expense_details:
            user_id = detail['user']
            amount_owed = detail['amount_owed']
            user = User.objects.get(id=user_id)
            ExpenseDetail.objects.create(
                expense=expense, user=user, amount_owed=amount_owed)

        serializer = ExpenseSerializer(expense)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)
