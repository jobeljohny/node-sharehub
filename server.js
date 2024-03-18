const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");

rooms = require("./data");

const { handle } = require("./actionHandler");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const server = http.createServer(app);

const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

function getID() {
  let outString = "";
  let inOptions = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 6; i++) {
    outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
  }
  return outString;
}

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (creds) => {
    socket.join(creds.roomId);
    if (rooms[creds.roomId]) {
      // io.to(roomId).emit('updateData', rooms[roomId]);
    }
  });
  socket.on("update", (data) => {
    console.log("recieved update");
    handle(data.id, JSON.parse(data.data));
    //rooms[data.id]=data.data;
    io.to(data.id).emit("updateData", { id: data.userId, action: data.data });
  });
});
const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.post("/createRoom", (req, res) => {
  const roomId = getID();
  rooms[roomId] = JSON.parse(req.body["data"]);
  res.send({ roomId: roomId });
});

app.get("/room/:roomId", (req, res) => {
  const roomId = req.params.roomId;

  const roomData = rooms[roomId];
  res.json(roomData);
});

server.listen(3000, () => {
  console.log("WebSocket server listening on port 3000");
});
