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


class Group(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User, related_name='group_members')

    def __str__(self):
        return self.name


class GroupInvitation(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    inviter = models.ForeignKey(User, on_delete=models.CASCADE)
    invitee = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='invitations')
    accepted = models.BooleanField(default=False)

    def __str__(self):
        return self.group.name


class Expense(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payer = models.ForeignKey(User, on_delete=models.CASCADE)
    # participants = models.ManyToManyField(User, related_name='expenses_participated')
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.group.name} => {self.description} => {self.payer.username} payed ${self.amount}"


class ExpenseDetail(models.Model):
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount_owed = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.user.username} owes {self.expense.payer.username} ${self.amount_owed}"


class Debt(models.Model):
    debtor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='debts_created')
    creditor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='debts_received')
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.debtor} owes {self.creditor} ${self.amount} in group {self.group}"
