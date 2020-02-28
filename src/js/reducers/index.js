import { LOGIN_USER, LOGOUT_USER, CURRENT_DEVICE } from "../constants/action-types";

const initialState = {
    user: null,
    currentDevice: null
  };
function rootReducer(state = initialState, action) {
    if (action.type === LOGIN_USER) {
        return Object.assign({}, state, {
            user: action.payload
        });
      }
    if (action.type === LOGOUT_USER) {
        return Object.assign({}, state, {
            user: null
        });
      }

    if (action.type === CURRENT_DEVICE) {
        return Object.assign({}, state, {
            currentDevice: action.payload
        });
    }
    
      return state;
};
export default rootReducer;