from django.contrib import admin
from .models import *

admin.site.register(FriendRequest)
admin.site.register(UserFriends)
admin.site.register(Group)
admin.site.register(GroupInvitation)
admin.site.register(Expense)
admin.site.register(ExpenseDetail)
