import webpush from "web-push";
import cron from "node-cron";

const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

let savedSubscriptions = [];
let scheduled = false;

const scheduler = cron.schedule(
  "* * * * *",
  () => {
    const now = new Date();
    console.log(now);

    savedSubscriptions.forEach((subData) => {
      console.log(subData)
      const timeDiffMs = subData.startTime - now;
      const minutesUntilStart = Math.floor(timeDiffMs / 1000 / 60);

      if (minutesUntilStart <= 5) {
        const payload = JSON.stringify({
          title: "Session starting soon",
          body: `${subData.sessionName} starts in 5 minutes.`,
        });

        webpush
          .sendNotification(subData.subscription, payload)
          .catch((err) => console.error("Push failed:", err));

        scheduler.stop();
      }
    });
  },
  { scheduled: false },
);

export async function POST({ request }) {
  console.log("Received Push Subscription Request!");

  if (!scheduled) {
    scheduler.start();
  }

  const pushData = await request.json();
  pushData.startTime = new Date(pushData.startTime);

  savedSubscriptions.push(pushData);
  console.log("New subscription saved:", pushData.sessionName);

  return new Response(
    JSON.stringify({
      data: { success: true, message: "Subscription received successfully" },
    }),
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    },
  );
}
