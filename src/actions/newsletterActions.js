import {
  SAVE_NEWSLETTER,
  SAVE_IN_LOCAL,
  SAVE_PAYMENT,
  SAVE_PHONE_NUMBER,
} from "./types";

export const saveNewsletter = (data) => (dispatch) => {
  dispatch(saveToLocalStorage(data));
  dispatch({
    type: SAVE_NEWSLETTER,
    payload: data,
  });
};

const saveToLocalStorage = (value) => {
  localStorage.setItem("newsletterData", JSON.stringify(value));
  return {
    type: SAVE_IN_LOCAL,
  };
};

export const refillStore = () => (dispatch) => {
  const data = getFromLocalStorage("newsletterData");

  if (data) {
    dispatch({
      type: SAVE_NEWSLETTER,
      payload: data,
    });
  }
};

const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const savePayment = (payment) => (dispatch) => {
  let data = getFromLocalStorage("newsletterData");
  data.payment = payment;
  dispatch(saveToLocalStorage(data));
  console.log("here");
  dispatch({
    type: SAVE_PAYMENT,
    payload: payment,
  });
};

export const savePhoneNumber = (number) => (dispatch) => {
  let data = getFromLocalStorage("newsletterData") || {};
  data.phoneNumber = number;
  dispatch(saveToLocalStorage(data));
  dispatch({
    type: SAVE_PHONE_NUMBER,
    payload: number,
  });
};
