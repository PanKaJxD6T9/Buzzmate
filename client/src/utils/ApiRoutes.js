export const HOST = "http://localhost:5000";

const AUTH_ROUTE = `${HOST}/api/auth`;
const MESSAGE_ROUTE = `${HOST}/api/message`;

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
export const ONBOARDING_ROUTE = `${AUTH_ROUTE}/onboarding`;
export const GET_ALL_USERS_ROUTE = `${AUTH_ROUTE}/all-users`;

export const ADD_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/send-message`;
export const GET_MESSAGES_ROUTE = `${MESSAGE_ROUTE}/get-messages`;
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/add-image-message`;
export const ADD_AUDIO_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/add-audio-message`;