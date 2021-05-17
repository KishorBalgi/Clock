// JavaScript Code
// Author:Kishor M Balgi
"use strict";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Selectors.
const displayClock = document.querySelector(".display-clock");
const displayHours = document.querySelector(".display-clock-hours");
const displayMinutes = document.querySelector(".display-clock-minutes");
const displaySeconds = document.querySelector(".display-clock-seconds");
const displayDate = document.querySelector(".display-date");
const displayNav = document.querySelector(".display-nav");
const displayAlarm = document.querySelector(".display-alarm");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const alaramBlock = document.querySelector(".alarm-block");
const timerBlock = document.querySelector(".timer-block");
const stopwatchBlock = document.querySelector(".stopwatch-block");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const inputAlarmHours = document.querySelector(".alaram-hours-input");
const inputAlarmMinutes = document.querySelector(".alaram-minutes-input");
const inputTimerHours = document.querySelector(".timer-hours-input");
const inputTimerMinutes = document.querySelector(".timer-minutes-input");
const inputTimerSeconds = document.querySelector(".timer-seconds-input");
const inputStopwatchMinutes = document.querySelector(
  ".stopwatch-minutes-input"
);
const inputStopwatchSeconds = document.querySelector(
  ".stopwatch-seconds-input"
);
const inputStopwatchMilli = document.querySelector(".stopwatch-milli-input");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const btnAddAlarm = document.querySelector(".alarm-add");
const btnCloseAlarm = document.querySelector(".btn-close-alarm");
const btnAlarmOff = document.querySelector(".btn-off-alarm");
const btnTimerStart = document.querySelector(".btn-timer-start");
const btnTimerPause = document.querySelector(".btn-timer-pause");
const btnTimerOff = document.querySelector(".btn-off-timer");
const btnStopwatchStart = document.querySelector(".btn-stopwatch-start");
const btnStopwatchReset = document.querySelector(".btn-stopwatch-reset");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const modalAlarm = document.querySelector(".modal-alarm");
const modalTimer = document.querySelector(".modal-timer");
const overlay = document.querySelector(".overlay");
const modalTitle = document.querySelector(".modal-alarm p");
const timerProgressBar = document.querySelector(".progress-bar-in");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Create new date.
const date = new Date();
// Get browser language.
const locale = navigator.language;
// Date format options.
const options = {
  weekday: "short",
  day: "numeric",
  month: "long",
  year: "numeric",
};
const alarmSet = new Array();
let audio;
let timerInterval;
let stopwatchInterval;
let startValue;
let resume = 0;
let cancle = 0;
let stop = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Clock function.
const startClock = function () {
  const date = new Date();
  displayHours.textContent = `${date.getHours()}`.padStart(2, 0);
  displayMinutes.textContent = `${date.getMinutes()}`.padStart(2, 0);
  displaySeconds.textContent = `${date.getSeconds()}`.padStart(2, 0);
};
startClock();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Clock set interval.
const clock = setInterval(startClock, 1000);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Display date.
displayDate.textContent = new Intl.DateTimeFormat("locale", options).format(
  date
);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Navigation operation.
const openPage = function (i) {
  displayClock.classList.add("hidden");
  displayDate.classList.add("hidden");
  displayNav.classList.add("hidden");
  if (i === 0) {
    alaramBlock.classList.remove("hidden");
  } else if (i === 1) {
    timerBlock.classList.remove("hidden");
  } else {
    stopwatchBlock.classList.remove("hidden");
  }
};
const closePage = function (i) {
  displayClock.classList.remove("hidden");
  displayDate.classList.remove("hidden");
  displayNav.classList.remove("hidden");
  if (i === 0) {
    alaramBlock.classList.add("hidden");
  } else if (i === 1) {
    timerBlock.classList.add("hidden");
  } else {
    stopwatchBlock.classList.add("hidden");
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Alarm.
btnAddAlarm.addEventListener("click", function (e) {
  e.preventDefault();
  const hrs = Number(inputAlarmHours.value);
  const mins = Number(inputAlarmMinutes.value);
  const alarmValue = `${`${hrs}`.padStart(2, 0)}:${`${mins}`.padStart(2, 0)}`;
  if (
    hrs >= 0 &&
    hrs < 24 &&
    mins >= 0 &&
    mins < 60 &&
    !alarmSet
      .map((ele) => {
        return ele.time;
      })
      .includes(alarmValue)
  ) {
    alarmSet.push({ time: alarmValue, status: "on" });
    displayAlarmList(alarmSet);
  }
  inputAlarmHours.value = inputAlarmMinutes.value = "";
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Alarm display list.
const displayAlarmList = function (alarmSet) {
  displayAlarm.innerHTML = "";
  alarmSet.forEach(function (ele, i) {
    const html = `<div class="alarms alarm-${i}">
    <p class="${ele.status}">${ele.time}</p>
    <div>
    <button class="on-off" onclick="OnOff(${i})">
      <ion-icon name="radio-button-${ele.status}" id="${i}"></ion-icon>
    </button>
    <button class="edit" onclick="editAlarm(${i})">
      <ion-icon name="create-outline"></ion-icon>
    </button>
    <button class="delete" onclick="deleteAlarm(${i})">
      <ion-icon name="trash-outline"></ion-icon>
    </button>
    </div>
  </div>`;
    displayAlarm.insertAdjacentHTML("beforeend", html);
    ele.interval = function () {
      const time = new Date();
      if (
        ele.time.split(":")[0] == time.getHours() &&
        ele.time.split(":")[1] == time.getMinutes()
      ) {
        modalTitle.textContent = ele.time;
        clearInterval(ele.alarm);
        alarmSet.splice(i, 1);
        displayAlarmList(alarmSet);
        playAudio();
        modalAlarm.classList.remove("hidden");
        overlay.classList.remove("hidden");
      }
    };
    clearInterval(ele.alarm);
    ele.alarm =
      ele.status === "on"
        ? setInterval(ele.interval, 1000)
        : clearInterval(ele.alarm);
  });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Alarm On-Off button operation.
const OnOff = function (i) {
  const btn = document.getElementById(`${i}`);
  const alarmStatus = document.querySelector(`.alarm-${i}`);
  if (btn.name.includes("radio-button-on")) {
    btn.name = "radio-button-off";
    alarmStatus.classList.add("off");
    alarmSet[i].status = "off";
    displayAlarmList(alarmSet);
  } else {
    btn.name = "radio-button-on";
    alarmStatus.classList.remove("off");
    alarmSet[i].status = "on";
    displayAlarmList(alarmSet);
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Alarm edit button operation.
const editAlarm = function (i) {
  const editHrs = alarmSet[i].time.split(":")[0];
  const editMins = alarmSet[i].time.split(":")[1];
  inputAlarmHours.value = editHrs;
  inputAlarmMinutes.value = editMins;
  const editAlarmValue = `${`${editHrs}`.padStart(
    2,
    0
  )}:${`${editMins}`.padStart(2, 0)}`;
  clearInterval(alarmSet[i].alarm);
  alarmSet.splice(i, 1);
  displayAlarmList(alarmSet);
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Alarm delete button operation.
const deleteAlarm = function (i) {
  clearInterval(alarmSet[i].alarm);
  alarmSet.splice(i, 1);
  displayAlarmList(alarmSet);
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Alarm off.
btnAlarmOff.addEventListener("click", function () {
  modalAlarm.classList.add("hidden");
  overlay.classList.add("hidden");
  pauseAudio();
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Alarm audio play pause functions.
function playAudio() {
  audio = new Audio("Vendors/Sounds/alarm_sound.mp3");
  audio.play();
}
function pauseAudio() {
  audio.pause();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Timer.
btnTimerStart.addEventListener("click", function () {
  if (resume === 0) {
    startValue =
      Number(inputTimerSeconds.value) +
      Number(inputTimerMinutes.value) * 60 +
      Number(inputTimerHours.value * 3600);
  }
  if (cancle === 0) {
    if (startValue !== 0) {
      timerInterval = setInterval(function () {
        if (inputTimerSeconds.value == 0) {
          if (inputTimerMinutes.value == 0 && inputTimerHours.value == 0) {
            modalTimer.classList.remove("hidden");
            overlay.classList.remove("hidden");
            playAudio();
            reset();
          } else if (
            inputTimerMinutes.value == 0 &&
            inputTimerHours.value != 0
          ) {
            inputTimerSeconds.value = 59;
            inputTimerMinutes.value = 59;
            inputTimerHours.value--;
          } else {
            inputTimerMinutes.value--;
            inputTimerSeconds.value = 59;
          }
        } else {
          inputTimerSeconds.value--;
        }

        const progressValue =
          startValue -
          (Number(inputTimerSeconds.value) +
            Number(inputTimerMinutes.value) * 60 +
            Number(inputTimerHours.value * 3600));
        timerProgressBar.style.width = `${(progressValue * 100) / startValue}%`;
      }, 1000);
      cancle++;
      btnTimerStart.textContent = "Cancle";
      btnTimerStart.style.color = "red";
    }
  } else {
    reset();
  }
});
// Timer reset operation.
const reset = function () {
  inputTimerSeconds.value = inputTimerMinutes.value = inputTimerHours.value = 0;
  clearInterval(timerInterval);
  btnTimerStart.textContent = "Start";
  btnTimerStart.style.color = "";
  timerProgressBar.style.width = "0";
  cancle--;
};
// Timer pause-resume operation.
const pauseResume = function () {
  if (resume === 0) {
    btnTimerPause.textContent = "Resume";
    clearInterval(timerInterval);
    cancle--;
    resume++;
  } else {
    btnTimerPause.textContent = "Pause";
    btnTimerStart.click();
    resume--;
  }
};
// Timer audio off.
btnTimerOff.addEventListener("click", function () {
  modalTimer.classList.add("hidden");
  overlay.classList.add("hidden");
  pauseAudio();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Stopwatch.
btnStopwatchStart.addEventListener("click", function () {
  if (!stop) {
    btnStopwatchStart.textContent = "Stop";
    btnStopwatchStart.style.color = "red";
    let milli = 0;
    const stopwatch = function () {
      inputStopwatchMilli.textContent = Math.trunc((milli += 10) / 10);
      if (inputStopwatchSeconds.textContent == 60) {
        inputStopwatchMinutes.textContent++;
        inputStopwatchSeconds.textContent = 0;
      }
      if (milli === 1000) {
        inputStopwatchSeconds.textContent++;
        milli = 0;
      }
    };
    stopwatchInterval = setInterval(stopwatch, 10);
    stop++;
  } else {
    clearInterval(stopwatchInterval);
    btnStopwatchStart.textContent = "Start";
    btnStopwatchStart.style.color = "";
    stop--;
  }
});
// Stopwatch reset operation.
btnStopwatchReset.addEventListener("click", function () {
  inputStopwatchMinutes.textContent =
    inputStopwatchSeconds.textContent =
    inputStopwatchMilli.textContent =
      "0";
  clearInterval(stopwatchInterval);
  btnStopwatchStart.textContent = "Start";
  btnStopwatchStart.style.color = "";
  stop = 0;
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
