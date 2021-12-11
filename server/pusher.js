// app_id = "1296667"
// key = "3f4a53efe35be9da4c17"
// secret = "b8752eef1329825d2a07"
// cluster = "eu"

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1296667",
  key: "3f4a53efe35be9da4c17",
  secret: "b8752eef1329825d2a07",
  cluster: "eu",
  useTLS: true,
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world",
});
