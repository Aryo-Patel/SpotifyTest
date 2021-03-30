import {
    USER_LOGIN,
    USER_LOGOUT
} from '../actions/types'


const initialState = {
    isAuthenticated: false,
    user: null,
    loading: true
}

export default function(state = initialState, action) {
    const {type, payload}  = action;

    switch(type){
        case USER_LOGIN:
            return {
                ...state,
                user: payload,
                isAuthenticated: true,
                loading: false
            }
        default:
            return state;
    }
}