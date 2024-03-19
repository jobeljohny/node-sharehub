const express = require("express");
const http = require("http");
const {
  uniqueNamesGenerator,
  adjectives,
  animals,
} = require("unique-names-generator");
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
  const roomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    
    length: 2,
  });
  return roomName;
}

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (creds) => {
    socket.join(creds.roomId);
    if (rooms[creds.roomId]) {
      rooms[creds.roomId]["users"].push(creds.user);
      io.to(creds.roomId).emit("connectionInfo", {
        id: creds.user.userId,
        message: `${creds.user.username} has joined the room.`,
      });
    }
  });
  socket.on("update", (data) => {
    console.log("recieved update");
    handle(data.id, JSON.parse(data.data));
    //rooms[data.id]=data.data;
    io.to(data.id).emit("updateData", { id: data.user, action: data.data });
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
  rooms[roomId]["users"] = [];
  console.log(rooms);

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
