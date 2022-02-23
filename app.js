const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const userRouter = require('./src/routes/api/users');
const transactionsRouter = require('./src/routes/api/transactions');
const statisticsRouter = require('./src/routes/api/statistics');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/auth', userRouter);
app.use('/api/transaction', transactionsRouter);
app.use('/api/statistics', statisticsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;

// ____________Продвинутая версия c двумя токенами__________

// require("dotenv").config();
// const express = require("express");
// const logger = require("morgan");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const usersRouter = require("./src/routes/api/users");
// // const userRoutes = require("./src/routes/api/user-routes");
// const errorMiddleware = require("./src/middlewares/error-middleware");

// const app = express();
// const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// app.use(logger(formatsLogger));
// app.use(cors());
// app.use(express.json()); // нужно для отправки тела запроса в формате json
// // app.use(express.static("public")); // разрешает Express раздачу статичных файлов из папки public
// app.use(cookieParser());
// app.use("/api", usersRouter);
// // app.use("/api", userRoutes);
// app.use(errorMiddleware);

// app.use((req, res) => {
//   res.status(404).json({ message: "Not found" });
// });

// app.use((error, req, res, next) => {
//   const { status = 500, message = "Server error" } = error;
//   res.status(status).json({ message });
// });

// module.exports = app;
