import {
    USER_LOGIN,
    USER_LOGOUT
} from './types';

export const userLogin = userData => dispatch => {
    dispatch({
        type:  USER_LOGIN,
        payload: userData
    });
}