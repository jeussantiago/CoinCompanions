from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from base.serializers import GroupSerializer, GroupInvitationSerializer, ExpenseSerializer, ExpenseDetailSerializer
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getGroupExpenses(request, group_id):
    try:
        group = Group.objects.get(id=group_id)
        if request.user not in group.members.all():
            return Response({"error": "You are not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

        expenses = Expense.objects.filter(group=group)
        serialized_expenses = ExpenseSerializer(expenses, many=True).data

        for expense_data in serialized_expenses:
            expense_id = expense_data['id']
            expense_details = ExpenseDetail.objects.filter(
                expense_id=expense_id)
            serialized_details = ExpenseDetailSerializer(
                expense_details, many=True)
            expense_data['expense_details'] = serialized_details.data

        return Response(serialized_expenses, status=status.HTTP_200_OK)

    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createExpense(request, group_id):
    '''
    Even if someone is not specified, they will be added to the json request.data with a pay value of 0

    {
        "description": "Dinner",
        "amount": 100.00,
        "expense_details": [
            {
                "user": 2,   // User ID of the first person who owes
                "amount_owed": 50.00
            },
            {
                "user": 3,   // User ID of the second person who owes
                "amount_owed": 50.00
            },
            {
                "user": 4,   
                "amount_owed": 0.00
            }
        ]
    }
    '''
    try:
        group = Group.objects.get(id=group_id)
        if request.user not in group.members.all():
            return Response({"error": "You are not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

        # check if data is available
        expense_details = request.data.get('expense_details', [])
        amount = request.data.get('amount')

        if amount is None:
            return Response({"error": "Amount is required for the expense"}, status=status.HTTP_400_BAD_REQUEST)

        if len(expense_details) == 0:
            return Response({"error": "At least one user must be specified in expense_details"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if total amount == amount user payed
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

        # Data safe to manipulate

        # Create the expense
        expense_data = {
            'group': group,
            'description': request.data.get('description'),
            'amount': amount,
            'payer': request.user
        }

        expense = Expense.objects.create(**expense_data)

        # Create ExpenseDetail objects for users specified in expense_details
        for detail in expense_details:
            user_id = detail['user']
            amount_owed = detail['amount_owed']
            user = User.objects.get(id=user_id)
            ExpenseDetail.objects.create(
                expense=expense, user=user, amount_owed=amount_owed)

        # Create ExpenseDetail objects with amount_owed 0 for users not specified in expense_details
        existing_user_ids = {detail['user'] for detail in expense_details}
        for user in group.members.all():
            if user.id not in existing_user_ids and user != request.user:
                ExpenseDetail.objects.create(
                    expense=expense, user=user, amount_owed=0)

        # Create an ExpenseDetail with negative amount_owed for the user who paid
        ExpenseDetail.objects.create(
            expense=expense, user=request.user, amount_owed=-amount)

        serializer = ExpenseSerializer(expense)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateExpense(request, group_id, expense_id):
    '''
    Even if someone is not specified, they will be updated with a pay value of 0

    {
        "description": "Updated description",
        "amount": 75.00,
        "expense_details": [
            {
                "user": 4,
                "amount_owed": 50.00
            }
        ]
    }
    '''
    try:
        group = Group.objects.get(id=group_id)
        if request.user not in group.members.all():
            return Response({"error": "You are not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

        try:
            expense = Expense.objects.get(id=expense_id, group=group)
        except Expense.DoesNotExist:
            return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

        expense.description = request.data.get(
            'description', expense.description)

        new_amount = request.data.get('amount')
        if new_amount is not None:
            expense.amount = new_amount
        else:
            return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Update associated expense details
        expense_details = request.data.get('expense_details', [])

        # Check if the data is safe
        total_amount_owed = 0

        for detail in expense_details:
            user_id = detail.get('user')

            amount_owed = detail.get('amount_owed')
            if amount_owed is None:
                return Response({"error": "Amount owed is required for each expense detail"}, status=status.HTTP_400_BAD_REQUEST)

            total_amount_owed += amount_owed

            try:
                user = User.objects.get(id=user_id)
                if user not in group.members.all():
                    return Response({"error": f"User with ID {user_id} is not a member of this group"}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"error": f"User with ID {user_id} not found"}, status=status.HTTP_404_NOT_FOUND)

        if total_amount_owed != new_amount:
            return Response({"error": "Total amount owed must equal the expense amount"}, status=status.HTTP_400_BAD_REQUEST)

        # Data safe now to save update
        expense.save()

        # Update expense details
        for detail in expense_details:
            user_id = detail.get('user')
            amount_owed = detail.get('amount_owed')

            try:
                expense_detail = ExpenseDetail.objects.get(
                    expense=expense, user__id=user_id)
                expense_detail.amount_owed = amount_owed
                expense_detail.save()
            except ExpenseDetail.DoesNotExist:
                pass

        # Update non-specified expense details for users not listed in expense_details to 0
        existing_user_ids = {detail['user'] for detail in expense_details}
        for user in group.members.all():
            if user.id not in existing_user_ids and user != expense.payer:
                try:
                    expense_detail = ExpenseDetail.objects.get(
                        expense=expense, user=user)
                    expense_detail.amount_owed = 0
                    expense_detail.save()
                except ExpenseDetail.DoesNotExist:
                    pass

        # update the payer's amount
        expense_detail = ExpenseDetail.objects.get(
            expense=expense, user=expense.payer)
        expense_detail.amount_owed = -new_amount
        expense_detail.save()

        serializer = ExpenseSerializer(expense)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteExpense(request, group_id, expense_id):
    try:
        group = Group.objects.get(id=group_id)
        if request.user not in group.members.all():
            return Response({"error": "You are not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

        try:
            expense = Expense.objects.get(id=expense_id, group=group)
        except Expense.DoesNotExist:
            return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

        # Delete the expense - since expense in models is cascading, it will delete automatically
        expense.delete()

        return Response({"message": "Expense deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)
