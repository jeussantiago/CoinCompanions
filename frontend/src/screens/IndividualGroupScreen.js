import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

/**
 * if the user is not logged in. navigate to home page
 * if the user is not part of the group. navigate to the groups page
 *
 * modify group name
 * create group button
 *
 *
 * expense chart
 * list expenses
 *      type='expense' or 'settle'
 *      date_added
 *      description
 *      how_much
 *      who paid
 *      (edit button)
 *
 * add expense
 *      (will use the same form as edit expense. will have conditional to differentiate between adding expense and updating)
 *
 * (when you click an expense, it expands to show the specifics)
 *      how much each person owes the payer
 *
 * Expense Edit
 *      able to see how much each person paid
 *      decide to split it by:
 *          - raw numbers
 *          - percentage
 *          - evenly split
 *
 * RIGHT SIDE:
 * list all the users and their debt to each person or how much they are owed from certain people
 *
 * search bar to invite other users to group
 *
 *
 */
function IndividualGroupScreen() {
    const { id } = useParams();
    const navigate = useNavigate();

    // NAVIGATE THE USER AWAY IF THEY ARE NOT PART OF THIS GROUP

    return (
        <div>
            <div>IndividualGroupScreen : Group {id} </div>
        </div>
    );
}

export default IndividualGroupScreen;
