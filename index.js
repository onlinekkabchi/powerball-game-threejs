import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import sql from "mssql";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
  },
};
const users = {};

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("/public/index.html");
});

io.on("connection", (socket) => {
  socket.on("new user", async (username) => {
    // Insert the new user into the database
    try {
      const pool = await sql.connect(config);
      await pool
        .request()
        .query(`INSERT INTO Users (Username) VALUES ('${username}')`);
    } catch (err) {
      console.error("Error inserting user into database: ", err);
    }

    users[socket.id] = username;
    io.emit("user joined", username);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", { user: users[socket.id], message: msg });
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      const username = users[socket.id];
      io.emit("user left", username);
      delete users[socket.id];
    }
  });
});

// io.emit("some event", {
//   someProperty: "some value",
//   otherProperty: "other value",
// });

server.listen(3003, () => {
  console.log("listening on 3003");
});
