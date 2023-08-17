# CoinCompanions

This app is similar to Splitwise. Users can create groups for their different trips. Other users are added to the group with a code or an invitation is sent to other users. Once part of a groups, users can add expenses such as car rental, hotel cost, food cost, etc. When the trip is all said and done, users can pay whoever they owe. The app will try to minimize the amount of people the user will have to pay in order to reduce hassles between sending money to each other.

One issue with splitwise, which many users, even myself, have encountered is that if a trip is already in progress wherein expenses already exist, if a new user is added, the cost per user will not be recalculated. This becomes rather annoying as trips can have tens or even hundreds of expenses. Do you really expect users to manually update each expense? This app tries to solve that issue

## USERS:

-   jeus ; jeus@email.com ; hellofresh (admin)

## TO DO:

#### USER AUTHORIZATION & AUTHENTICATION

Backend

-   [x] JWT atuhorization
-   [x] user registration backend
-   [x] user login backend

Frontend

-   [ ] user registration frontend
    -   email
    -   name
    -   password
-   [ ] user login frontend
    -   email
    -   password
-   [ ] user logout frontend

#### USER FRIENDS

Backend

-   [x] friend request (backend)
    -   [x] user sends a pending friend request
    -   [x] other user has the option to accept or decline
    -   [x] do not let user the user send multiple friend requests to the same user
    -   [x] if user accepts, they become friends: delete friend request
    -   [x] if user declines, delete friend request (maybe notify user but probably not)
-   [x] remove friend

Frontend

-   [ ] can search users by email frontend
    -   will be able to see if can add user as friend or 'pending' if friend request sent already
        (could also just not make the pending user visible)
-   [ ] other user sees all friend request each with a button to accept or decline
    -   [ ] on accept, both users become friend
    -   [ ] on decline, friend request deleted
-   [ ] view to see all user's friends
-   [ ] delete friend: 3 dots then popup that confirms if user wants to delete the friend

#### TRIP & EXPENSES

-   when a user accepts the trip, they are redirected straight to the trip itself.
-   if there are expenses already in the trip, the user can select which expenses to want to add themselves into.

    -   if the expenses is not evenly distributed (this means that someone manually change who owes how much) then a red box in the same expense row saying "unable to include self"
    -   if the expense is evenly distributed, then a user can add themselves

    -   once we get a list of all the expenses a user wants to add themselves into, the expenses will get modified to now include the new person/tranasction and the other existing people/transactions will be modified. split expense will be recalculated.

    (some people are going to settle prematurely, so they will be in the expenses, don't include these expenses - filter it out in backend and remove from frontend)

-   because of this constant changing expenses. I don't think i will add the recalculating process every time theres a update to the expense. I'll keep it seperate and just call them when I need it.
    -   if a person is in the trip already and they create a new expense of update an existing expense. We recalculate how much everyone owes after that
    -   if a person just joined the trip and did the thing where they specify which expenses to add themselves into. We are going to update all the expenses first, then recalculate.

Backend

-   [x] user can create a Group
-   [x] see all users on the Group
-   [x] user can invite users to the Group (any user can invite to the trip if they are part of the trip already)
-   [x] user can join the Group once they accept

-   [x] see all expenses
-   [x] create expense (defaultted to 'even split' upon creation but user can specify)
-   [x] modify expense

-   [ ] somehow keep track of how much people owe. We are only updating that price when expenses are update but we don't want to calculate every time we need to check how much someone owes
-   [ ] calculate total amount everyone owes with minimum transaction

Frontend

-   [ ] can search people to add to trip from friends list and email (exclude the people who are already in the trip)
-   [ ] create Group
-   [ ] invite users to Groups using friends list or email
-   [ ] user have a list of groups they are invited to
-   [ ] can accept or decline group

    -   [ ] decline deletes group invitation
    -   [ ] accept takes user to another page where they will select which expenses to add themselves into
        -   User can only add themselves into expenses that are specified to be evenly distributted
            (reason: if an expense is manually calculated, we can assume that a user spent time to figure out how much each person owes whether it be through raw data or by percentages)

-   [ ] update Group name
-   [ ] create expense
-   [ ] update expense

    Expenses splitting options:

    -   can split evenly: can specify who to include or not include (all include and all not included are is seen as same thing)
    -   can split with raw numbers (can only add expense if total is properly added to total. If total=10, can't have user1 pay 3 and user2 pay 4. Has to add up to total(10))
    -   can split using percentage ( same conecept as above)

-   might have to update backend Expense model to know if an exepnse was specified to EVEN SPLIT
    -   this will be useful for the people invited later on after items are added

## BUILD:

-   add friends
    -   can find user using name, email address, or phone number
        -   send friend request
        -   user must accept before becoming friends
-   remove friends
-   update user info
    -   name
    -   email address
    -   phone number
    -   password
    -   avatar
        (- might do currency. this also means that you have to convert it in groups also)

### Group:

-   create group
-   invite people to group (can't leave group)
    -   from friends
    -   from invitation code
-   add expense
    -   click then dropdown
    -   dropdown will have breakdown of expense
        -   who paid
        -   person owes how much
-   modify/update expense
-   remove expense
-   settle up/ pay the people
    (might connect to fake paypals or just do hard numbers)
-   settling up mid way/at the end is like adding an expense

-   pie charts to show who has spent what on the trip
-   graph/line chart to show daily total spending
