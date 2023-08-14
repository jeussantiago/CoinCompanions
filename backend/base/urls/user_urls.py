from django.urls import path
from base.views import user_views as views

urlpatterns = [
    path('', views.getUsers, name='allusers'),
    path('login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register', views.registerUser, name='register'),
    path('profile/', views.getUserProfile, name='users-profile'),

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
