let locationBtn = document.getElementById("location-button");
let timingsBtn = document.getElementById("timings-button");
let pco = document.getElementById("coordinates");
let pti = document.getElementById("timings");
const liFajr = document.getElementById("li-fajr");
const liDhuhr = document.getElementById("li-dhuhr");
const liAsr = document.getElementById("li-asr");
const liMaghrib = document.getElementById("li-maghrib");
const liIsha = document.getElementById("li-isha");
const liSunrise = document.getElementById("li-sunrise");
const liSunset = document.getElementById("li-sunset");

let latitude = localStorage.getItem("latitude") || null;
import getCurrentDate from "./date.mjs";

let currentDate = getCurrentDate();

let longitude = localStorage.getItem("longitude") || null;
pco.innerHTML = `<span class="font-bold">Latitude:</span> ${latitude}<br><span class="font-bold">Longitude:</span> ${longitude}`;

function convertTo12HourFormat(time) {
  const [hours, minutes] = time.split(":").map((num) => parseInt(num, 10));

  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;

  return `${hours12}:${minutesFormatted} ${period}`;
}

async function fetchNamaz(a, b) {
  try {
    timingsBtn.textContent = `Fetching..`;
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${currentDate}?latitude=${a}&longitude=${b}`
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const resData = await res.json();
    const Fajr = convertTo12HourFormat(resData.data.timings.Fajr);
    const Dhuhr = convertTo12HourFormat(resData.data.timings.Dhuhr);
    const Asr = convertTo12HourFormat(resData.data.timings.Asr);
    const Maghrib = convertTo12HourFormat(resData.data.timings.Maghrib);
    const Isha = convertTo12HourFormat(resData.data.timings.Isha);
    const Sunrise = convertTo12HourFormat(resData.data.timings.Sunrise);
    const Sunset = convertTo12HourFormat(resData.data.timings.Sunset);

    liFajr.textContent = `${Fajr}`;
    liDhuhr.textContent = `${Dhuhr}`;
    liAsr.textContent = `${Asr}`;
    liMaghrib.textContent = `${Maghrib}`;
    liIsha.textContent = `${Isha}`;
    liSunrise.textContent = `${Sunrise}`;
    liSunset.textContent = `${Sunset}`;

    setTimeout(() => {
      timingsBtn.textContent = `Updated ✅`;
      setTimeout(() => {
        timingsBtn.textContent = `Update Timings`;
      }, 2500);
    }, 2500);
  } catch (error) {
    timingsBtn.textContent = `Update Timings`;
    pti.textContent = `Error: ${error}`;
  }
}

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    const originalText = locationBtn.textContent;
    locationBtn.textContent = `Fetching..`;
    navigator.geolocation.getCurrentPosition(
      function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        pco.innerHTML = `<span class="font-bold">Latitude:</span> ${latitude}<br><span class="font-bold">Longitude:</span> ${longitude}`;
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);

        setTimeout(() => {
          locationBtn.textContent = `Updated ✅`;
          setTimeout(() => {
            locationBtn.textContent = originalText;
          }, 2500);
        }, 2500);
      },
      function (error) {
        pco.textContent = "Error retrieving location: " + error.message;
      }
    );
  } else {
    pco.textContent = "Geolocation is not supported by your browser.";
  }
});

timingsBtn.addEventListener("click", () => {
  if (latitude && longitude) {
    fetchNamaz(latitude, longitude);
  } else {
    pti.textContent = "Please fetch the location first.";
  }
});
