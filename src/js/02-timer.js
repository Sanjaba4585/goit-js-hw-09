import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const selectors = {
  btn: document.querySelector('button[data-start]'),
  inputDays: document.querySelector('.field [data-days]'),
  inputHours: document.querySelector('.field [data-hours]'),
  inputMinutes: document.querySelector('.field [data-minutes]'),
  inputSeconds: document.querySelector('.field [data-seconds]'),
};
selectors.btn.disabled = 'disabled';
const SELECTED_DATA = 'selected-data-item';
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (this.selectedDates[0] > Date.now()) {
      selectors.btn.disabled = null;
      Notiflix.Notify.success('Goog! You choose a date in the future');
    } else {
      return Notiflix.Notify.failure('Please choose a date in the future');
    }
  },
};
const flatpickrFoo = flatpickr('#datetime-picker', options);
const ACTION_DELAY = 1000;

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;
  }
  start() {
    if (this.isActive) {
      return;
    }
    const startTime = flatpickrFoo.selectedDates[0].getTime();
    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const differenceTime = startTime - currentTime;

      if (differenceTime < 0) {
        clearInterval(this.intervalId);
        return;
      }
      const time = this.convertMs(differenceTime);
      this.onTick(time);
    }, ACTION_DELAY);
    selectors.btn.disabled = 'disabled';
  }
  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}
const timer = new Timer({
  onTick: renderInterface,
});
function renderInterface({ days, hours, minutes, seconds }) {
  selectors.inputDays.textContent = `${days}`;
  selectors.inputHours.textContent = `${hours}`;
  selectors.inputMinutes.textContent = `${minutes}`;
  selectors.inputSeconds.textContent = `${seconds}`;
}
selectors.btn.addEventListener('click', timer.start.bind(timer));
