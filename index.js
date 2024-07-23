const express = require("express");
const app = express();

const PORT = 2000;
const { proxy, scriptUrl } = require("rtsp-relay")(app);

const handler = (ws, req) => {
  return proxy({
    url: `rtsp://${req.query.login}:${req.query.pass}@${req.query.ip}:554/Streaming/Channels/1`,
    transport: "tcp",
    additionalFlags: `-codec:a mp2 -ar 44100 -ac 1 -b:a 128k`.split(` `),
  })(ws);
};

// the endpoint RTSP uses
app.ws("/api/stream", handler);

app.get("/established", (req, res) => res.send("Connection established"))
// html page to view the stream
app.get("/", (req, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'ws://' + location.host + '/api/stream',
      canvas: document.getElementById('canvas')
    });
  </script>
`)
);

app.listen(PORT, () => console.log(`Server is Running on port ${PORT}`));