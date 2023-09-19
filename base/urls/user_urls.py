from django.urls import path
from base.views import user_views as views

urlpatterns = [
    path('', views.getUsers, name='allusers'),
    path('login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register', views.registerUser, name='register'),
    #     path('google-login', views.google_login, name='google_login'),
    path('profile/', views.getUserProfile, name='users-profile'),
    path('groups/', views.getUserGroups, name='user-groups'),
    path('debt/', views.getUserDebt, name='owed-amount'),
    path('credit/', views.getUserCredit, name='owed-amount'),
    path('groups-debt-credit/', views.getUserGroupDebtCredit,
         name='user-groups-debt-credit'),
    path('search-users/', views.searchUsers, name='search-users'),
    path('get-friend-invite-groups/', views.getFriendInviteGroups,
         name='get_friend_invite_groups'),

    path('profile/update/', views.updateUserProfile, name='users-profile-update'),
    path('delete/<str:pk>/', views.adminDeleteUser, name='admin-user-delete'),

    path('friends/', views.getFriendsList, name='get-friends-list'),
    path('friend-requests/sent/', views.getSentFriendRequests,
         name='get-sent-friend-requests'),
    path('friend-requests/received/', views.getReceivedFriendRequests,
         name='get-received-friend-requests'),
    path('remove-friend/<int:friend_id>/',
         views.removeFriend, name='remove-friend'),
    path('friend-requests/delete/<int:friend_request_id>/',
         views.deleteFriendRequest, name='delete-friend-request'),
    path('friend-requests/send/<int:to_user_id>/',
         views.sendFriendRequest, name='send-friend-request'),
    path('friend-requests/accept/<int:friend_request_id>/',
         views.acceptFriendRequest, name='accept-friend-request'),

]
