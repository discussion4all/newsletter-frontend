import {
  SAVE_NEWSLETTER,
  SAVE_IN_LOCAL,
  SAVE_PAYMENT,
  SAVE_PHONE_NUMBER,
} from "../actions/types";

const initialState = {
  newsletterId: undefined,
  savedInLocal: false,
  title: "",
  description: "",
  sampleText: "",
  blogPosterURL: "",
  payment: {
    monthly: "",
    yearly: "",
  },
  phoneNumber: "",
};

const newsletterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_NEWSLETTER:
      const {
        title,
        description,
        html,
        imgURL,
        payment,
        phoneNumber,
        newsletterId,
      } = action.payload;

      let newState = {
        ...state,
        title,
        description,
        sampleText: html,
        blogPosterURL: imgURL,
        payment: {
          ...state.payment,
          ...payment,
        },
        phoneNumber,
        newsletterId,
      };

      return newState;

    case SAVE_IN_LOCAL:
      return { ...state, savedInLocal: true };

    case SAVE_PAYMENT:
      const { monthly, yearly } = action.payload;
      console.log(monthly, yearly);
      return { ...state, payment: { ...state.payment, monthly, yearly } };

    case SAVE_PHONE_NUMBER:
      return { ...state, phoneNumber: action.payload };

    default:
      return state;
  }
};

export default newsletterReducer;
