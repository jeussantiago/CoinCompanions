# CoinCompanions

This app is similar to Splitwise. Users can create groups for their different trips. Other users are added to the group with a code or an invitation is sent to other users. Once part of a groups, users can add expenses such as car rental, hotel cost, food cost, etc. When the trip is all said and done, users can pay whoever they owe. The app will try to minimize the amount of people the user will have to pay in order to reduce hassles between sending money to each other.

One issue with splitwise, which many users, even myself, have encountered is that if a trip is already in progress wherein expenses already exist, if a new user is added, the cost per user will not be recalculated. This becomes rather annoying as trips can have tens or even hundreds of expenses. Do you really expect users to manually update each expense? This app tries to solve that issue

## USERS:

-   jeus ; jeus@email.com ; hellofresh (admin)

## TO DO:

#### Sidebar

-   [x] routes to the different locations in the app
-   [x] logout button
-   [ ] implement functional part of logout button
-   [x] responsive to size
-   [ ] visible on all screens except the Home/Login/Registration screen

#### USER AUTHORIZATION & AUTHENTICATION

Backend

-   [x] JWT atuhorization
-   [x] user registration backend
-   [x] user login backend
-   [ ] google registration
-   [ ] google login

Frontend

-   [x] user registration
-   [ ] google registration
-   [x] user login
-   [ ] google login
-   [x] user logout

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
-   [x] calculate total amount everyone owes with minimum transaction (Simplify debt algorithm)

-   [x] need a way to update a list of expenses for when a new user comes, the ids specified will add him to the corresponding expense detail and update the other users expense to the values epcified. if the id of the expense is not specified, just add user to the expense detail with amount value of 0 (test view updateExpensesForNewUser)
-   [x] create a settle up transaction - records payment

-   if expense is speicifed as "is Evenly Split", new user can join

    -   get new user using new_user_id
        Error Check:
    -   make sure that the total of new_amount == amount in expense
        -   can calculate by getting the length of current expense detail filter for expens
        -   add +1 for new guy
        -   multiply that value with amount to see if it equals total

    If Error: - just add the user to the expense detail with value of 0

    -   create an expenseDetail for the new user in the expense of amount_owed=amount
    -   update the other expenseDetails to be the same value as amount

-   \*\*\*Might have Boolean in Expense to differentiate between Settlements and Expenses (isSettlement)
-   \*\*\*Need Boolean for Expense to see if something is evenly split so that we know if new user can join

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

    Expenses splitting optionss:

    -   can split evenly: can specify who to include or not include (all include and all not included are is seen as same thing)
    -   can split with raw numbers (can only add expense if total is properly added to total. If total=10, can't have user1 pay 3 and user2 pay 4. Has to add up to total(10))
    -   can split using percentage ( same conecept as above)

-   might have to update backend Expense model to know if an exepnse was specified to EVEN SPLIT

    -   this will be useful for the people invited later on after items are added

-   [ ] settle up button

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

---

# Simplify Debt Algorithm Implementation

This repository contains an implementation of the Simplify Debt Algorithm in Python, along with an explanation of the algorithm, its implementation details, and an analysis of its time and space complexity.

## Table of Contents

-   [Introduction](#introduction)
-   [Algorithm Explanation](#algorithm-explanation)
-   [Time Complexity Analysis](#time-complexity-analysis)
-   [Space Complexity Analysis](#space-complexity-analysis)
-   [Applying the Algorithm - Example](#applying-the-algorithm---example)

## Introduction

The Simplify Debt Algorithm is used to efficiently settle debts among a group of users. It aims to minimize the number of transactions required to balance the debts, resulting in a simplified and fair settlement process.

## Algorithm Explanation

The algorithm proceeds as follows:

1. Calculate net balances for each user.
2. Sort users based on their net balances.
3. Initialize two pointers at the extremes of the sorted list: one at the user who owes the most and another at the user who is owed the most.
4. Find the minimum of the absolute value of the debts for the two users pointed by the pointers. This represents the maximum amount that can be settled between them.
5. Update balances using the amount
6. Move pointers if the balance of a creditor or debtor becoms 0
7. Repeat until all debts are settled.

## Time Complexity Analysis

n is the number of users <br />
m is the number of expenses

(n \* m) Calculate net balances for each user. Each user has m number of expenses, have to check evrything to figure out total net balance for a user
(nlogn) Sorting the net balances
(n) Loop to process each user at most once, involving constant-time operations

Simplified time complexity: O(m \* n)

## Space Complexity Analysis

n is the number of users <br />
m is the number of expenses

The space complexity includes the storage of balances, transactions, temporary variables, and even extra space used for sorting. Python sorting uses (n) extra space. In the worst case, where each user owes money to every other user, the space complexity is O(n \* m) since each expense can have all the users involved.

Simplified time complexity: O(m \* n)

## Applying the Algorithm - Example

Imagine a group of friends who frequently share expenses, such as dinners, trips, and bills. Over time, they've accumulated various debts and credits among themselves. The Simplify Debt Algorithm comes to the rescue to efficiently settle these debts and ensure everyone is squared away with the least number of transactions possible.

### Group Members

Let's consider a group of five friends: Alice, Bob, Carol, David, and Emily.

### Initial Expenses

-   Alice owes Bob $20.
-   Bob owes Carol $30.
-   Carol owes David $10.
-   David owes Emily $15.
-   Emily owes Alice $25.

### Initial Calculated Net Balances

-   Alice: $5 (Net positive, is owed money(Creditor))
-   Bob: -$10 (Net negative, owes money(Debtor))
-   Carol: $20
-   David: -$5
-   Emily: -$10

### Applying the Algorithm

1. **Sorting and Pointers:**
   The friends are sorted based on their calculated net balances. Two pointers are positioned at the friend who owes the most (Bob) and the friend who is owed the most (Carol).

    - Carol: $20
    - Alice: $5
    - David: -$5
    - Emily: -$10
    - Bob: -$10

2. **Settlements:**

    - Bob owes Carol $10, so the algorithm settles Bob's debt. Updated balances:

        - Carol: $10
        - Alice: $5
        - David: -$5
        - Emily: -$10
        - Bob: $0

    - Emily owes Carol $10, so the algorithm settles their debt. Updated balances:

        - Carol: $0
        - Alice: $5
        - David: -$5
        - Emily: $0
        - Bob: $0

    - David owes Alice $5, so the algorithm settles their debt. Updated balances:
        - Carol: $0
        - Alice: $0
        - David: $0
        - Emily: $0
        - Bob: $0

    At this point, all debts have been settled, and the balances are simplified:

    - Bob owes Carol $10
    - Emily owes Carol $10
    - David owes Alice $5

### Benefits and Efficiency

By applying the Simplify Debt Algorithm, the group of 5 friends managed to settle their debts with only 3 transactions, even though there were originally 5 imbalanced accounts. This algorithm minimizes the number of transactions required, making it an efficient and fair way to settle debts among a group of individuals.

### Issues

Since the algorithm converges towards the center of a list, you get cases where it creates more transactions for a user than they have created in expenses. One such case is:

[-10, -8, -8, 1, 8, 8, 9]

We notice that if we match up a pair of collector who is owed $8 and a debtor who owes 8 for 2 people each, we can be left with [-10, 1, 9]. We can now see that both debtors just have to pay the one collector.

The min number of transactions here is 4.

However, with our algorithm, the min number of transactions comes out to 6 because it converges towards the center. It fulfills the needs of those on the outer before moving closer to the center..

---
