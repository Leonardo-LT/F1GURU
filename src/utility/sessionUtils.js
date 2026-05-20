import calendarData from "../calendar.json";
import askPermission from "./askPermission";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const sendSubscriptionToBackEnd = (subscription) => {
  return fetch("/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(subscription),
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Bad status code from server.");
      }
      const res = response.json();
      console.log(res);
      return res;
    })
    .then(function (responseData) {
      if (!(responseData.data && responseData.data.success)) {
        throw new Error("Bad response from server.");
      }
    });
};

export const getNextGrandPrix = () => {
  const currentDate = Date.now();
  for (let i = 0; i < calendarData.length; i++) {
    const element = calendarData[i];
    const sessions = element.sessions;
    const endDate = new Date(sessions[sessions.length - 1].end);
    if (endDate >= currentDate) return element;
  }
  return null;
};

export const getNextSession = () => {
  const currentDate = new Date();
  const grandPrix = getNextGrandPrix();
  if (!grandPrix) return null;

  const sessions = grandPrix.sessions;
  for (let i = 0; i < sessions.length; i++) {
    const endDate = new Date(sessions[i].end);
    if (endDate >= currentDate) return sessions[i];
  }
  return null;
};

export const getCurrentGrandPrixImage = () => {
  const grandPrix = getNextGrandPrix();
  return grandPrix ? grandPrix.circuit_image : null;
};

export const setNotify = async (session, start) => {
  if (!("serviceWorker" in navigator)) return;
  if (!("PushManager" in window)) return;

  const permission =
    Notification.permission === "granted" ? true : await askPermission();

  if (permission) {
    return navigator.serviceWorker.ready
      .then(function (registration) {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            import.meta.env.VITE_VAPID_PUBLIC_KEY,
          ),
        };
        return registration.pushManager.subscribe(subscribeOptions);
      })
      .then(function (pushSubscription) {
        sendSubscriptionToBackEnd({
          subscription: pushSubscription,
          sessionName: session,
          startTime: start,
        });
      });
  }
};
