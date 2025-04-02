import { reducerCases } from "./constants";

export const initialState = {
    userInfo: undefined,
    newUser: false,
    contacts: false,
    currentChatUser: undefined,
    messages: [],
    socket: undefined,
    messagesSearch: false,
    userContacts: [],
    onlineUsers: [],
    filteredContacts: []
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
        case reducerCases.SET_MESSAGES:
            return {
                ...state,
                messages: action.messages,
            };
        case reducerCases.SET_SOCKET:
            return {
                ...state,
                socket: action.socket,
            };
        case reducerCases.ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.newMessage],
            };
        case reducerCases.SET_SEARCH_MESSAGE:
            return {
                ...state,
                messagesSearch: !state.messagesSearch,
            }
        case reducerCases.SET_USER_CONTACTS:
            return {
                ...state,
                userContacts: action.userContacts,
            }
        case reducerCases.SET_ONLINE_USERS:
            return {
                ...state,
                onlineUsers: action.onlineUsers,
            }
        case reducerCases.SET_CONTACT_SEARCH:
            const filteredContacts = state.userContacts.filter((contact) => {
                return contact.name.toLowerCase().includes(action.contactSearch.toLowerCase());
            });
            return {
                ...state,
                contactSearch: action.contactSearch,
                filteredContacts: filteredContacts,
            }
        default:
            return state;
    }
}

export default reducer;