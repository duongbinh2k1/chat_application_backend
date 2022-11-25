const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
require("dotenv").config();

const userRouter = require("./routes/UserRoute")


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/users", userRouter)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch(err => {
    console.log(err.message);
  });

const port = process.env.PORT || 3000;

//Start server
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

//Start Socket
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let users = []

io.on("connect", socket => {
  console.log("Client Connected " + socket.id);

  socket.on("login", ({ userId }) => {
    if (users.find(item => item.userId === userId)) {
      console.log("Error")
    } else {
      users.push({ userId: userId, socketId: socket.id });
      io.emit("list-online", users)
    }
  })

  socket.on("disconnect", () => {
    users = users.filter(item => item.socketId!== socket.id);
  });

  socket.on("send-private-message", ({ sender, message, receiver }) => {
    io.to(receiver).emit("receive-private-message", {
      sender: sender,
      message: message,
      receiver: receiver
    });
  })
})

