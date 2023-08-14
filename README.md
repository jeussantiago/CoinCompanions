# CoinCompanions

This app is similar to Splitwise. Users can create groups for their different trips. Other users are added to the group with a code or an invitation is sent to other users. Once part of a groups, users can add expenses such as car rental, hotel cost, food cost, etc. When the trip is all said and done, users can pay whoever they owe. The app will try to minimize the amount of people the user will have to pay in order to reduce hassles between sending money to each other.

## USERS:

-   jeus ; jeus@email.com ; hellofresh (admin)

## TO DO:

-   [x] JWT atuhorization
-   [x] user registration backend
-   [x] user login backend
-   [ ] user registration frontend
    -   email
    -   name
    -   password
-   [ ] user login frontend
    -   email
    -   password
-   [ ] user logout frontend

-   [ ] can search users by email
-   [x] friend request (backend)
    -   [x] user sends a pending friend request
    -   [x] other user has the option to accept or decline
    -   [x] do not let user the user send multiple friend requests to the same user
    -   [x] if user accepts, they become friends: delete friend request
    -   [x] if user declines, delete friend request (maybe notify user but probably not)
-   [x] remove friend

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
