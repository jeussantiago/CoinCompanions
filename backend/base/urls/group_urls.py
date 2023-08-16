from django.urls import path
from base.views import group_views as views

urlpatterns = [
    path('create/', views.createGroup, name='create-group'),
    path('invitations/', views.getUserInvitations,
         name='get-user-invitations'),

    path('invitations/<int:invitation_id>/accept/',
         views.acceptGroupInvitation, name='accept-group-invitation'),
    path('invitations/<int:invitation_id>/decline/',
         views.declineGroupInvitation, name='decline-group-invitation'),

    path('<int:group_id>/details/',
         views.getGroupDetails, name='get-group-details'),
    path('<int:group_id>/update-name/',
         views.updateGroupName, name='update-group-name'),
    path('<int:group_id>/invite/<int:invitee_id>/',
         views.sendGroupInvitation, name='send-group-invitation'),

    path('<int:group_id>/create-expense/',
         views.createExpense, name='create-expense'),
]
