from django.db import models
from django.contrib.auth.models import User


class FriendRequest(models.Model):
    from_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='sent_friend_requests')
    to_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='received_friend_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)


class UserFriends(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    friends = models.ManyToManyField(
        User, related_name='my_friends', blank=True)


class Trip(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, blank=True, related_name='members')
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
