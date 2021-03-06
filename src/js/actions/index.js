import { LOGIN_USER, LOGOUT_USER, EDIT_USER, CURRENT_DEVICE } from "../constants/action-types"

export function loginUser(payload) {
    return { type: LOGIN_USER, payload }
};

export function editUser(payload) {
  return { type: EDIT_USER, payload }
};


export function logoutUser() {
  return { type: LOGOUT_USER }
};

export function setCurrentDevice(payload) {
  return { type: CURRENT_DEVICE, payload }
};