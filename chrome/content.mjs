let locationBtn = document.getElementById("location-button");
let timingsBtn = document.getElementById("timings-button");
let pco = document.getElementById("coordinates");
let pti = document.getElementById("timings");
const liDate = document.getElementById("li-date");
const liFajr = document.getElementById("li-fajr");
const liDhuhr = document.getElementById("li-dhuhr");
const liAsr = document.getElementById("li-asr");
const liMaghrib = document.getElementById("li-maghrib");
const liIsha = document.getElementById("li-isha");
const liSunrise = document.getElementById("li-sunrise");
const liSunset = document.getElementById("li-sunset");
const restartBtn = document.getElementById("restart");

// restart button
restartBtn.addEventListener("click", () => {
  window.close();
  chrome.runtime.reload();
});

let latitude = localStorage.getItem("latitude") || null;
let longitude = localStorage.getItem("longitude") || null;

pco.innerHTML = `<span class="font-bold">Latitude:</span> <span class="text-blue-500">${latitude}°</span><br><span class="font-bold">Longitude:</span> <span class="text-blue-500">${longitude}°</span>`;

import getCurrentDate from "./date.mjs";
let currentDate = getCurrentDate();

// Helper function to convert time to 12-hour format
function convertTo12HourFormat(time) {
  const [hours, minutes] = time.split(":").map((num) => parseInt(num, 10));
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
  return `${hours12}:${minutesFormatted} ${period}`;
}

// Get timings from localStorage
let Date = localStorage.getItem("Date") || "Not Fetched";
let Fajr = localStorage.getItem("Fajr") || "Not Fetched";
let Dhuhr = localStorage.getItem("Dhuhr") || "Not Fetched";
let Asr = localStorage.getItem("Asr") || "Not Fetched";
let Maghrib = localStorage.getItem("Maghrib") || "Not Fetched";
let Isha = localStorage.getItem("Isha") || "Not Fetched";
let Sunrise = localStorage.getItem("Sunrise") || "Not Fetched";
let Sunset = localStorage.getItem("Sunset") || "Not Fetched";

// Update the timings in the UI
liDate.textContent = `${Date}`;
liFajr.textContent = `${Fajr}`;
liDhuhr.textContent = `${Dhuhr}`;
liAsr.textContent = `${Asr}`;
liMaghrib.textContent = `${Maghrib}`;
liIsha.textContent = `${Isha}`;
liSunrise.textContent = `${Sunrise}`;
liSunset.textContent = `${Sunset}`;

// Function to fetch and display namaz timings
async function fetchNamaz(a, b) {
  try {
    timingsBtn.textContent = `📩 Fetching Latest Timings...`;
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${currentDate}?latitude=${a}&longitude=${b}`
    );
    if (!res.ok) {
      window.close();
    }
    const resData = await res.json();

    // all timings when
    Date = resData.data.date.readable;
    Fajr = convertTo12HourFormat(resData.data.timings.Fajr);
    Dhuhr = convertTo12HourFormat(resData.data.timings.Dhuhr);
    Asr = convertTo12HourFormat(resData.data.timings.Asr);
    Maghrib = convertTo12HourFormat(resData.data.timings.Maghrib);
    Isha = convertTo12HourFormat(resData.data.timings.Isha);
    Sunrise = convertTo12HourFormat(resData.data.timings.Sunrise);
    Sunset = convertTo12HourFormat(resData.data.timings.Sunset);

    // Save timings to localStorage
    localStorage.setItem("Date", Date);
    localStorage.setItem("Fajr", Fajr);
    localStorage.setItem("Dhuhr", Dhuhr);
    localStorage.setItem("Asr", Asr);
    localStorage.setItem("Maghrib", Maghrib);
    localStorage.setItem("Isha", Isha);
    localStorage.setItem("Sunrise", Sunrise);
    localStorage.setItem("Sunset", Sunset);

    setTimeout(() => {
      timingsBtn.textContent = `Updated Successfully ✅`;
      setTimeout(() => {
        timingsBtn.textContent = `Update Timings`;
      }, 2500);
    }, 2500);
  } catch (error) {
    timingsBtn.textContent = `Update Timings`;
    pti.textContent = `${error}`;
  }
}

// Event listener for location button
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    const originalText = locationBtn.textContent;
    locationBtn.textContent = `🌎 Fetching your Location...`;
    navigator.geolocation.getCurrentPosition(
      function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        pco.innerHTML = `<span class="font-bold">Latitude:</span> <span class="text-blue-500">${latitude}°</span><br><span class="font-bold">Longitude:</span> <span class="text-blue-500">${longitude}°</span>`;
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);

        setTimeout(() => {
          locationBtn.textContent = `Updated Successfully ✅`;
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

// Event listener for timings button
timingsBtn.addEventListener("click", () => {
  // If coordinates exist in localStorage, fetch namaz timings
  if (latitude && longitude) {
    fetchNamaz(latitude, longitude);
  } else {
    console.error("Please fetch location first!");
    window.close();
  }
});
