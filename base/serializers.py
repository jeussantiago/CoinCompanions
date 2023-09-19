from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FriendRequest, UserFriends, Group, GroupInvitation, Expense, ExpenseDetail, Debt
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'is_staff']

    def get_name(self, obj):
        name = obj.first_name
        if name == "":
            name = obj.email

        return name


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'is_staff', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(many=False)
    to_user = UserSerializer(many=False)

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'created_at', 'accepted']


class UserFriendsSerializer(serializers.ModelSerializer):
    friends = UserSerializer(many=True, read_only=True)

    class Meta:
        model = UserFriends
        fields = ['friends']


class ExpenseSerializer(serializers.ModelSerializer):
    payer = UserSerializer(many=False)

    class Meta:
        model = Expense
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True)

    class Meta:
        model = Group
        fields = '__all__'


class GroupSerializerForGetUserGroupsView(serializers.ModelSerializer):
    most_recent_expense = serializers.SerializerMethodField()
    # creator = UserSerializer(many=False)

    class Meta:
        model = Group
        exclude = ('members',)

    def get_most_recent_expense(self, obj):
        # Retrieve the most recent expenses for the group
        most_recent_expenses = Expense.objects.filter(
            group=obj).order_by('-date')[:2]

        # Check if there are any expenses
        if most_recent_expenses.exists():
            # Serialize the most recent expenses using ExpenseSerializer
            return ExpenseSerializer(most_recent_expenses, many=True).data
        else:
            # If no expenses exist, return an empty list
            return []


class GroupInvitationSerializer(serializers.ModelSerializer):
    invitee = UserSerializer(many=False)
    group = serializers.SerializerMethodField()

    class Meta:
        model = GroupInvitation
        fields = ['id', 'group', 'inviter', 'invitee', 'accepted']

    # Define a custom method to get the group data
    def get_group(self, obj):
        group = obj.group  # Retrieve the group object from the GroupInvitation
        # Return only the id and name. Don't need the members
        return {'id': group.id, 'name': group.name}


class ExpenseDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ExpenseDetail
        fields = ['user', 'amount_owed']


class DebtSerializer(serializers.ModelSerializer):
    debtor = UserSerializer()
    creditor = UserSerializer()

    class Meta:
        model = Debt
        fields = ['debtor', 'creditor', 'group', 'amount']
