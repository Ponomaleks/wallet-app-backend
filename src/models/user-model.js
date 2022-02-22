const { Schema, model } = require("mongoose");

//схема описывает, какие поля содержит сущность пользователя
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  balance: { type: Number, default: 0 },
});

module.exports = model("User", UserSchema);
