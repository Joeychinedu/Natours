/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    // 1) Fetch the checkout session from the backend
    const response = await axios.get(
      `/api/v1/booking/checkout-session/${tourId}`
    );
    const { authorization_url } = response.data.session.data;

    // 2) Redirect the user to the Paystack authorization URL
    window.location.href = authorization_url;
  } catch (err) {
    console.log(err);
    showAlert('error', 'An error occurred while processing the payment.');
  }
};
