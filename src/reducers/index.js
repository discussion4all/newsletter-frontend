import { combineReducers } from "redux";
import newsletterReducer from "./newsletterReducer";

export default combineReducers({
  newsletter: newsletterReducer,
});
