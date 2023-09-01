import axios from "axios";
import {
    GROUP_INVITE_DECLINE_REQUEST,
    GROUP_INVITE_DECLINE_SUCCESS,
    GROUP_INVITE_DECLINE_FAIL,
} from "../constants/groupConstants";

export const deleteGroupInvite = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: GROUP_INVITE_DECLINE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.delete(`/api/groups/invitations/${id}/decline/`, config);

        dispatch({ type: GROUP_INVITE_DECLINE_SUCCESS });
    } catch (err) {
        dispatch({
            type: GROUP_INVITE_DECLINE_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};
