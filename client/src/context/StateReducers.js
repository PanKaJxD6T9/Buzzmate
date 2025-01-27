import { reducerCases } from "./constants";

export const initialState = {
    userInfo: undefined,
    newUser: false,
    contacts: false,
    currentChatUser: undefined
}

const reducer = (state, action) => {
    switch(action.type) {

        case reducerCases.SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo,
            };
        case reducerCases.SET_NEW_USER:
            return {
                ...state,
                newUser: action.newUser,
            };
        case reducerCases.SET_ALL_CONTACTS:
            return {
                ...state,
                contacts: !state.contacts,
            };
        case reducerCases.SET_CURRENT_CHAT_USER:
            return {
                ...state,
                currentChatUser: action.user,
            };
        default:
            return state;
    }
}

export default reducer;