const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequest, Conflict, Unauthorized } = require("http-errors");

const { User } = require("../../models");
const { joiSignupSchema, joiLoginSchema } = require("../../models/user");
// const { authenticate, upload } = require("../../middlewares");
const { SECRET_KEY } = process.env;

const router = express.Router();

// регистрируем пользователя
router.post("/singup", async (res, req, next) => {});

// логиним пользователя
router.post("/login", async (req, res, next) => {});

// разлогинивание пользователя
// router.get("/logout", authenticate, async (req, res) => {
//   const { _id } = req.user;
//   await User.findByIdAndUpdate(_id, { token: null });
//   res.status(204).send();
// });

module.exports = router;
