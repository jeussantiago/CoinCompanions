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

    path('<int:group_id>/user-search/', views.searchUsersToInvite,
         name='search-users-to-invite'),
    path('<int:group_id>/details/',
         views.getGroupDetails, name='get-group-details'),
    path('<int:group_id>/update-name/',
         views.updateGroupName, name='update-group-name'),
    path('<int:group_id>/expenses/',
         views.getGroupExpenses, name='get_group_expenses'),
    path('<int:group_id>/create-expense/',
         views.createExpense, name='create-expense'),
    path('<int:group_id>/calculate-debts/',
         views.getSimplifiedDebt, name='calculate-debts'),
    path('<int:group_id>/update-expenses-for-new-user/',
         views.updateExpensesForNewUser, name='update-expenses-for-new-user'),
    path('<int:group_id>/record-payment/',
         views.recordPayment, name='record-payment'),
    path('<int:group_id>/debts/',
         views.getGroupDebtsPerUser, name='group-debts-per-user'),
    path('<int:group_id>/credits/',
         views.getGroupCreditsPerUser, name='group-credits-per-user'),

    path('<int:group_id>/invite/<int:invitee_id>/',
         views.sendGroupInvitation, name='send-group-invitation'),

    path('<int:group_id>/expenses/<int:expense_id>/update/',
         views.updateExpense, name='update_expense'),
    path('<int:group_id>/expenses/<int:expense_id>/delete/',
         views.deleteExpense, name='delete-expense'),


]
