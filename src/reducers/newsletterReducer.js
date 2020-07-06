import { SAVE_NEWSLETTER, SAVE_IN_LOCAL, SAVE_PAYMENT } from "../actions/types";

const initialState = {
  savedInLocal: false,
  title: "",
  description: "",
  sampleText: "",
  blogPosterURL: "",
  payment: {
    monthly: "",
    yearly: "",
  },
};

const newsletterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_NEWSLETTER:
      const { title, description, html, imgURL, payment } = action.payload;

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
      };

      return newState;

    case SAVE_IN_LOCAL:
      return { ...state, savedInLocal: true };

    case SAVE_PAYMENT:
      const { monthly, yearly } = action.payload;
      console.log(monthly, yearly);
      return { ...state, payment: { ...state.payment, monthly, yearly } };

    default:
      return state;
  }
};

export default newsletterReducer;
