from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FriendRequest, UserFriends, Group, GroupInvitation, Expense, ExpenseDetail
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name']

    def get_name(self, obj):
        name = obj.first_name
        if name == "":
            name = obj.email

        return name


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'created_at', 'accepted']


class UserFriendsSerializer(serializers.ModelSerializer):
    friends = UserSerializer(many=True, read_only=True)

    class Meta:
        model = UserFriends
        fields = ['friends']


# class TripSerializer(serializers.ModelSerializer):
#     members = UserSerializer(many=True, read_only=True)

#     class Meta:
#         model = Trip
#         fields = ['id', 'name', 'members']

class GroupSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True)

    class Meta:
        model = Group
        fields = '__all__'


class GroupInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupInvitation
        fields = ['id', 'group', 'inviter', 'invitee', 'accepted']


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'


class ExpenseDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ExpenseDetail
        fields = ['user', 'amount_owed']
