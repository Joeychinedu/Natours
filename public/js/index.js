/* eslint-disable */
import { displayMap } from './mapbox';
import { login } from './login';
import { logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './paystack';

//  DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userDataPassword = document.querySelector('.form-user-password');
const fileInput = document.querySelector('.form__upload');
const bookBtn = document.getElementById('book-tour');

//  DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  // console.log(locations);
  displayMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    // form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (userDataPassword) {
  userDataPassword.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save-password').innerHTML = 'Updating...';

    const postedPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { postedPassword, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').innerHTML = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (fileInput)
  fileInput.addEventListener('change', async (e) => {
    const form = new FormData();
    form.append('photo', document.getElementById('photo').files[0]);
    // Take care of the type attribute being photo
    const newImage = await updateSettings(form, 'photo');

    if (newImage) {
      document
        .querySelector('.nav__user-img')
        .setAttribute('src', `/img/users/${newImage}`);
      document
        .querySelector('.form__user-photo')
        .setAttribute('src', `/img/users/${newImage}`);
    }
  });

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
