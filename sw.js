import { precacheAndRoute } from "workbox-precaching";
import { StaleWhileRevalidate, NetworkOnly } from "workbox-strategies";
import { offlineFallback } from "workbox-recipes";
import { registerRoute, setDefaultHandler } from "workbox-routing";

setDefaultHandler(new NetworkOnly());

offlineFallback();

const manifestArray = self.__WB_MANIFEST || [];
precacheAndRoute(manifestArray);

registerRoute(
  ({ url }) => url.href.startsWith("https://api"),
  new StaleWhileRevalidate({
    cacheName: "api-cache",
  }),
);

self.addEventListener("push", function (event) {
  const promiseChain = self.registration.showNotification(
    event.data.json().body,
  );

  event.waitUntil(promiseChain);
});
