# CoinCompanions

This app is similar to Splitwise. Users can create groups for their different trips. Other users are added to the group with a code or an invitation is sent to other users. Once part of a groups, users can add expenses such as car rental, hotel cost, food cost, etc. When the trip is all said and done, users can pay whoever they owe. The app will try to minimize the amount of people the user will have to pay in order to reduce hassles between sending money to each other.

One issue with splitwise, which many users, even myself, have encountered is that if a trip is already in progress wherein expenses already exist, if a new user is added, the cost per user will not be recalculated. This becomes rather annoying as trips can have tens or even hundreds of expenses. Do you really expect users to manually update each expense? This app tries to solve that issue

## Table of Contents

-   [Technologies](##Technologies)
-   [Model Diagram](##Models-Diagram)
-   [Simplify Debt Algorithm Implementation](#Simplify-Debt-Algorithm-Implementation)
-   [Recreate](##Recreate)

## Technologies

<div align="center">
    <h3>Frontend</h3>
	<table>
		<tr>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/117447155-6a868a00-af3d-11eb-9cfe-245df15c9f3f.png" alt="JavaScript" title="JavaScript"/></code></td>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" title="React"/></code></td>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/187896150-cc1dcb12-d490-445c-8e4d-1275cd2388d6.png" alt="Redux" title="Redux"/></code></td>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/183898674-75a4a1b1-f960-4ea9-abcb-637170a00a75.png" alt="CSS" title="CSS"/></code></td>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/183898054-b3d693d4-dafb-4808-a509-bab54cf5de34.png" alt="Bootstrap" title="Bootstrap"/></code></td>
		</tr>
    </table>
    <h3>Backend</h3>
    <table>
		<tr>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/183423507-c056a6f9-1ba8-4312-a350-19bcbc5a8697.png" alt="Python" title="Python"/></code></td>
            <td><code><img width="50" src="https://github.com/marwin1991/profile-technology-icons/assets/62091613/9bf5650b-e534-4eae-8a26-8379d076f3b4" alt="Django" title="Django"/></code></td>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/192107858-fe19f043-c502-4009-8c47-476fc89718ad.png" alt="REST" title="REST"/></code></td>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/192109061-e138ca71-337c-4019-8d42-4792fdaa7128.png" alt="Postman" title="Postman"/></code></td>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/117208740-bfb78400-adf5-11eb-97bb-09072b6bedfc.png" alt="PostgreSQL" title="PostgreSQL"/></code></td>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/183896132-54262f2e-6d98-41e3-8888-e40ab5a17326.png" alt="AWS" title="AWS"/></code></td>
		</tr>
    </table>
    <h3>Version Control</h3>
    <table>
        <tr>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/192108372-f71d70ac-7ae6-4c0d-8395-51d8870c2ef0.png" alt="Git" title="Git"/></code></td>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/192108374-8da61ba1-99ec-41d7-80b8-fb2f7c0a4948.png" alt="GitHub" title="GitHub"/></code></td>
        </tr>
	</table>
</div>

## Models Diagram

![Alt text](/frontend/src/images/model_diagram.png "Visual representation of my models")

## USERS:

-   jeus ; jeus@email.com ; hellofresh

---

# Simplify Debt Algorithm Implementation

This repository contains an implementation of the Simplify Debt Algorithm in Python, along with an explanation of the algorithm, its implementation details, an analysis of its time and space complexity, and issues with the algorithm.

## Algorithm Table of Contents

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

However, with our algorithm, the min number of transactions comes out to 6 because it converges towards the center. It fulfills the needs of those on the outer before moving closer to the center. The steps would follow:

steps=0 ; [-10, -8, -8, 1, 8, 8, 9] <br>
steps=1 ; [-1, -8, -8, 1, 8, 8] <br>
steps=2 ; [-8, -8, 1, 8, 7] <br>
steps=3 ; [-1, -8, 1, 8] <br>
steps=4 ; [-8, 1, 7] <br>
steps=5 ; [-1, 1] <br>
steps=6 ; [] <br>

---

## Recreate

1. Clone the project

2. In root of the project in the terminal:

```bash
pip install -r requirements.txt
```

3. Enter frontend folder in terminal:

```bash
npm install
```

4. Create an env file in the frontend folder. The values are:

    - PUBLIC_URL=AWS S3 bucket
    - REACT_APP_GUEST_EMAIL=super user username
    - REACT_APP_GUEST_PASS=super user password

5. Create an env file in the backend folder. The values are:

    - AWS_DATABASE_NAME=AWS_RDS_POSTGRES_DATABASE_NAME
    - AWS_DATABASE_USER=AWS_RDS_POSTGRES_DATABASE_USERNAME
    - AWS_DATABASE_PASS=AWS_RDS_POSTGRES_DATABASE_PASSWORD
    - AWS_DATABASE_HOST=AWS_RDS_POSTGRES_DATABASE_HOST
    - AWS_DATABASE_PORT=AWS_RDS_POSTGRES_DATABASE_PORT
    - AWS_IAM_ACCESS_KEY=AWS_IAM_ACCESS_KEY
    - AWS_IAM_SECRET_ACCESS_KEY=AWS_IAM_SECRET_ACCESS_KEY
    - AWS_STORAGE_BUCKET_NAME=AWS_S3_BUCKET_NAME

6. In terminal while still in frontend folder:

```bash
npm run build
```

7. Go back to root of project in terminal. You should now be able to run both the frontend and backend on port 8000:

```bash
python manage.py runserver
```
