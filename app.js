require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const usersRouter = require("./src/routes/api/users");
const userRoutes = require("./src/routes/api/user-routes");
const errorMiddleware = require("./src/middlewares/error-middleware");

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json()); // нужно для отправки тела запроса в формате json
// app.use(express.static("public")); // разрешает Express раздачу статичных файлов из папки public
app.use(cookieParser());
// app.use("/api/users", usersRouter);
app.use("/api", userRoutes);
app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error, req, res, next) => {
  const { status = 500, message = "Server error" } = error;
  res.status(status).json({ message });
});

module.exports = app;
