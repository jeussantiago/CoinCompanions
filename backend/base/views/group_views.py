from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Sum, Q
from collections import defaultdict, deque

from base.serializers import GroupSerializer, GroupInvitationSerializer, ExpenseSerializer, ExpenseDetailSerializer, DebtSerializer, UserSerializer
from django.contrib.auth.models import User
from base.models import Group, GroupInvitation, Expense, ExpenseDetail, Debt


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getGroupDetails(request, group_id):
    try:
        group = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

    # if request.user not in group.members.all():
    #     return Response({"error": "You are not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

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

        # Get the page and itemsPerPage parameters from the request query parameters.
        # Default to page 1 if not provided.
        page = int(request.GET.get('page', 1))
        # Default to 10 if not provided.
        items_per_page = int(request.GET.get('itemsPerPage', 2))

        expenses = Expense.objects.filter(group=group).order_by(
            '-date', '-id')

        paginator = Paginator(expenses, items_per_page)

        try:
            expenses = paginator.page(page)
        except PageNotAnInteger:
            expenses = paginator.page(1)
        except EmptyPage:
            # if we have 10 pages and user passes in page 40 or a page with no content
            # return the last page
            expenses = paginator.page(paginator.num_pages)

        if not page:
            page = 1

        page = int(page)

        serialized_expenses = ExpenseSerializer(expenses, many=True).data

        # get a breakdown of the expense. List of expense details
        for expense_data in serialized_expenses:
            expense_id = expense_data['id']
            expense_details = ExpenseDetail.objects.filter(
                expense_id=expense_id)
            serialized_details = ExpenseDetailSerializer(
                expense_details, many=True)
            expense_data['expense_details'] = serialized_details.data

        # return Response(serialized_expenses, status=status.HTTP_200_OK)
        return Response({
            'expenses': serialized_expenses,
            'page': page,
            'pages': paginator.num_pages
        })

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
        "isEvenlySplit": False
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
        # total_amount_owed = 0

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

            # total_amount_owed += amount_owed

        # if total_amount_owed != amount:
        #     return Response({"error": "Total amount_owed must equal the expense amount"}, status=status.HTTP_400_BAD_REQUEST)

        # Data safe to manipulate

        # Create the expense
        expense_data = {
            'group': group,
            'description': request.data.get('description', ""),
            'amount': amount,
            'payer': request.user,
            'isEvenlySplit': request.data.get('isEvenlySplit', False)
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

        # update the debts
        calculateSimplifiedDebts(group)

        serializer = ExpenseSerializer(expense)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateExpense(request, group_id, expense_id):
    '''
    (unable to update payer )
    Even if someone is not specified, they will be updated with a pay value of 0

    {
        "description": "Updated description",
        "amount": 75.00,
        "expense_details": [
            {
                "user": 4,
                "amount_owed": 50.00
            }
        ],
        "isEvenlySplit": False
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

        expense.isEvenlySplit = request.data.get('isEvenlySplit', False)

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
        # total_amount_owed = 0

        for detail in expense_details:
            user_id = detail.get('user')

            amount_owed = detail.get('amount_owed')
            if amount_owed is None:
                return Response({"error": "Amount owed is required for each expense detail"}, status=status.HTTP_400_BAD_REQUEST)

            # total_amount_owed += amount_owed

            try:
                user = User.objects.get(id=user_id)
                if user not in group.members.all():
                    return Response({"error": f"User with ID {user_id} is not a member of this group"}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"error": f"User with ID {user_id} not found"}, status=status.HTTP_404_NOT_FOUND)

        # if total_amount_owed != new_amount:
        #     return Response({"error": "Total amount owed must equal the expense amount"}, status=status.HTTP_400_BAD_REQUEST)

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

        # update the debts
        calculateSimplifiedDebts(group)

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

        # update the debts
        calculateSimplifiedDebts(group)

        return Response({"message": "Expense deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)


def calculateSimplifiedDebtsWithNetBalances(balances):
    '''
    param balances: Net change of debts for each user [{User_1: balance1}, {User_2: balance2}]

    returns json where key is the id of the debtor and value is a list of the users the debtor
    owes and how much
    {
        "simplified_debts": {
            "4": [
                {
                    "creditor": {
                        "id": 3,
                        "email": "tim@email.com"
                    },
                    "settlement_amount": 50.0
                },
                {
                    "creditor": {
                        "id": 1,
                        "email": "jeus@email.com"
                    },
                    "settlement_amount": 50.0
                }
            ]
        }
    }

    n is the number of users
    Time: O(nlogn)
        ; (nlogn) sorting
        ; (n) while loop to simplify balances. Each pair is processed once
        ;   no infinite loop can be processed, this is with an assumption that the data provided
        ;   has a net change of 0. The inner contents of the while loop are constant operations
    Space: O(n)
        ; (n) converting the dictionary into a list
        ; (n) python sorting uses more space than other languages

    '''

    # Initialize a list to store transactions
    transactions = defaultdict(list)

    # Convert the balances dictionary into a list of tuples for easier sorting
    balances_list = [(user, balance)
                     for user, balance in balances.items() if balance != 0]

    # Sort the balances list by values in ascending order - Biggest Debtors on the left, Biggest Creditors on the right
    sorted_balances = sorted(balances_list, key=lambda x: x[1])
    # print(sorted_balances)

    # Initialize two pointers: one at the beginning and one at the end of the sorted list
    left = 0
    right = len(sorted_balances) - 1

    while left < right:
        debtor, debt_amount = sorted_balances[left]
        creditor, credit_amount = sorted_balances[right]

        # Calculate the settlement amount
        settlement_amount = min(-debt_amount, credit_amount)

        # Update balances - used to see the net balance of the users, but doesn't affect
        # actual values in algorithm
        # balances[debtor] += settlement_amount
        # balances[creditor] -= settlement_amount

        # Append the transaction to the debt list
        transaction = {
            "creditor": {
                "id": creditor.id,
                "email": creditor.username  # username and email hold the same value
            },
            "settlement_amount": round(settlement_amount, 2)
        }
        transactions[debtor.id].append(transaction)

        # Update the pointers based on the settlement
        new_debt_balance = debt_amount + settlement_amount
        if new_debt_balance == 0:
            left += 1
        else:
            sorted_balances[left] = (debtor, new_debt_balance)

        new_credit_balance = credit_amount - settlement_amount
        if new_credit_balance == 0:
            right -= 1
        else:
            sorted_balances[right] = (creditor, new_credit_balance)

    # print(balances)
    return transactions


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
def calculateSimplifiedDebts(group):
    '''
    param group_id is the id of the group you want to calculate the simplified debt for

    Rather than having evryone paying multiple people, the simply debt algorithm aims to reduce
    the number of transactionsl between 

    n is the number of users
    m is the number of expenses
    Time: O(m * n)
        ; (m * n) Calculate the net total. Each expense has n number of expense details. You have to go
        ;   through all the expenses
        ; (nlogn) settleUp function
        ; (m * n + nlogn) - very likely the case that a group will have many times more expenses
        ;   than users. We can reduce to (m * n)
    '''
    # Calculate individual debts within the group
    balances = defaultdict(float)

    # Calculate total owed by each user (Net Change)
    for user in group.members.all():
        user_expenses = ExpenseDetail.objects.filter(
            user=user, expense__group=group)
        total_owed = user_expenses.aggregate(total_owed=Sum('amount_owed'))[
            'total_owed'] or 0
        total_owed = float(total_owed)
        # We are storing data with negative amount meaning they were a payer,
        # so we multiply by -1 to reverse these actions.
        balances[user] += (total_owed * -1)

    # Calculate amount spent by each user
    expenses = Expense.objects.filter(group=group)
    for expense in expenses:
        if expense.payer in group.members.all():
            balances[expense.payer] += float(expense.amount)

    # Calculate simplified debts and net balances
    simplified_debts = calculateSimplifiedDebtsWithNetBalances(balances)

    # Delete existing debts for the group
    Debt.objects.filter(group=group).delete()

    # Record updated simplified debts into the Debt model
    for debtor_id, transactions in simplified_debts.items():
        debtor = User.objects.get(id=debtor_id)
        for transaction in transactions:
            creditor_id = transaction['creditor']['id']
            creditor = User.objects.get(id=creditor_id)
            settlement_amount = transaction['settlement_amount']

            Debt.objects.create(
                debtor=debtor, creditor=creditor, group=group, amount=settlement_amount)

    return {"simplified_debts": simplified_debts}


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSimplifiedDebt(request, group_id):
    try:
        # Retrieve the group and ensure the user is a member
        group = Group.objects.get(id=group_id)

        if request.user not in group.members.all():
            return Response({"error": "You are not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

        simplifed_debts = calculateSimplifiedDebts(group)
        return Response(simplifed_debts, status=status.HTTP_200_OK)

    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateExpensesForNewUser(request, group_id):
    '''
    Adds the new user to the already existing expenses of the group

    request data: key="add_new_user_to_all_evenly_split_expenses" is a bool that decides if the user
    wants to add themselves to all the expenses that are labeled as evenly split

    if false: the user will be added to all expenses with 0
    if true: the user will be added to all expenses as 0 but the expenses labeled as evenly split will have
    a new calculated amount with the new user added to the details

    {
        "add_new_user_to_all_evenly_split_expenses": True
    }
    '''
    try:
        group = Group.objects.get(id=group_id)
        new_user = User.objects.get(id=request.user.id)

        if new_user not in group.members.all():
            return Response({"error": f"User with ID {request.user.id} is not a member of this group"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user has an invitation to the group
        # If no invitation exists, return an error
        invitation = GroupInvitation.objects.filter(
            group=group, invitee=new_user).first()
        if not invitation:
            return Response({"error": f"No invitation found for user with ID {new_user.id} in group {group_id}"}, status=status.HTTP_400_BAD_REQUEST)

        # Delete the invitation since it's being used
        invitation.delete()

        # add user to all expenses with a value of 0
        expenses = Expense.objects.filter(group=group, isTypeSettle=False)
        for expense in expenses:
            ExpenseDetail.objects.create(
                expense=expense, user=new_user, amount_owed=0)

        # Check if the request specifies adding the new user to all evenly split expenses
        add_new_user_to_all_evenly_split_expenses = request.data.get(
            'addNewUserToAllEvenlySplitExpenses', False)
        if add_new_user_to_all_evenly_split_expenses:
            expenses = Expense.objects.filter(group=group, isEvenlySplit=True)
            for expense in expenses:
                expense_details = ExpenseDetail.objects.filter(expense=expense)
                amount = expense.amount / len(expense_details)
                # update amount_owed for all users in expense (this includes the new user)
                expense_details.update(amount_owed=amount)

        return Response({"message": f"User with ID {new_user.id} added to group {group_id}'s expenses"}, status=status.HTTP_201_CREATED)

    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": f"User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def recordPayment(request, group_id):
    '''
    Payment from request.user to receiving_user_id. Records it by creating an expense and
    corresponding expense detail

    request.data
    {
        "receiving_user_id": 2,
        "amount": 25.0
    }
    '''
    try:
        # Retrieve the group and ensure the user is a member
        group = Group.objects.get(id=group_id)
        if request.user not in group.members.all():
            return Response({"error": "You are not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

        # Validate input data
        receiving_user_id = request.data.get('receiving_user_id')
        amount = request.data.get('amount')

        if receiving_user_id is None or amount is None:
            return Response({"error": "Receiving user ID and amount are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the receiving user
        receiving_user = User.objects.get(id=receiving_user_id)

        # Create the payment expense
        payment_expense_data = {
            'group': group,
            'description': f'User {request.user.username} settled up with {receiving_user.username}',
            'amount': amount,
            'payer': request.user,
            'isEvenlySplit': False,
            'isTypeSettle': True
        }
        payment_expense = Expense.objects.create(**payment_expense_data)

        # Create the corresponding expense detail
        ExpenseDetail.objects.create(
            expense=payment_expense, user=receiving_user, amount_owed=amount)

        calculateSimplifiedDebts(group)

        return Response({"message": f"Payment recorded from {request.user} to {receiving_user} for ${amount}"}, status=status.HTTP_201_CREATED)

    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": "Receiving user not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getGroupDebtsPerUser(request, group_id):
    '''
    gets a dictionary with key=creditor_user_id and value=list of users that is 
    owed by this user and how much

    "debts_per_user": {
        "10": [
            {
                "debtor": {
                    "id": 10,
                    "username": "charlie@email.com",
                    "email": "charlie@email.com",
                    "name": "charlie"
                },
                "creditor": {
                    "id": 1,
                    "username": "jeus@email.com",
                    "email": "jeus@email.com",
                    "name": "Jeus"
                },
                "group": 6,
                "amount": "158.33"
            }
        ],
    }

    Use in combination with /api/groups/<int:group_id>/details/ to match up the members
    with their IDs
    '''

    try:
        group = Group.objects.get(id=group_id)
        debts = Debt.objects.filter(group=group)

        # Group the debts by debtor
        debts_per_user = defaultdict(list)
        for debt in debts:
            debts_per_user[debt.debtor].append(debt)

        # Serialize the grouped debts
        serialized_debts = {}
        for debtor, debts in debts_per_user.items():
            serializer = DebtSerializer(debts, many=True)
            serialized_debts[debtor.id] = serializer.data

        return Response({"debts_per_user": serialized_debts}, status=status.HTTP_200_OK)

    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getGroupCreditsPerUser(request, group_id):
    '''
    Gets a dictionary with key=creditor_user_id and value=list of debts that owe this
    user and how much.

    "credits_per_user": {
        "1": [
            {
                "debtor": {
                    "id": 10,
                    "username": "charlie@email.com",
                    "email": "charlie@email.com",
                    "name": "charlie"
                },
                "creditor": {
                    "id": 1,
                    "username": "jeus@email.com",
                    "email": "jeus@email.com",
                    "name": "Jeus"
                },
                "group": 6,
                "amount": "158.33"
            }
        ],
    }

    Use in combination with /api/groups/<int:group_id>/details/ to match up the members
    with their IDs
    '''

    try:
        group = Group.objects.get(id=group_id)
        debts = Debt.objects.filter(group=group)

        # Group the debts by creditor (opposite of the debts view)
        credits_per_user = defaultdict(list)
        for debt in debts:
            credits_per_user[debt.creditor].append(debt)

        # Serialize the grouped credits
        serialized_credits = {}
        for creditor, credits in credits_per_user.items():
            serializer = DebtSerializer(credits, many=True)
            serialized_credits[creditor.id] = serializer.data

        return Response({"credits_per_user": serialized_credits}, status=status.HTTP_200_OK)

    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def searchUsersToInvite(request, group_id):
    '''
    serach users not part of group and dont have an invite to the group
    for them. Can only search my user emails since it is a unique field
    '''
    keyword = request.GET.get('keyword', '')
    try:
        group = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

    # Query users who are not part of the group and have no group invites as invitees
    users = User.objects.exclude(
        Q(group_members=group) | Q(invitations__group=group)
    ).filter(
        email__icontains=keyword    # Filter by email
    )

    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hasAcceptedInvitation(request, group_id):
    '''
    checks if there exist an 'accepted' invitation to the group
    returns bool
    '''
    user = request.user

    # Check if the user has an accepted invitation to the group
    invitation_exists = GroupInvitation.objects.filter(
        group_id=group_id, invitee=user, accepted=True).exists()

    return Response({"hasAcceptedInvitation": invitation_exists}, status=status.HTTP_200_OK)
