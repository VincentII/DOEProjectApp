import { LOGIN_USER, CURRENT_DEVICE } from "../constants/action-types"

export function loginUser(payload) {
    console.log("EYOOOOOO login")
    return { type: LOGIN_USER, payload }
};

export function setCurrentDevice(payload) {
  return { type: CURRENT_DEVICE, payload }
};