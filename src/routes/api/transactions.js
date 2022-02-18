const express = require("express");
const router = express.Router();
const { NotFound, BadRequest } = require("http-errors");

const {
  Transaction,
  earningsSchema,
  expenseSchema,
  statisticSchema,
} = require("../../models");

// router.get("/", async (req, res, next) => {
//   try {
//     const contacts = await Contact.find();
//     return res.json(contacts);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/:id", async (req, res, next) => {
//   console.log(req.params);
//   const { id } = req.params;
//   try {
//     const contact = await Contact.findById(id);
//     if (!contact) {
//       throw new NotFound();
//       // const error = new Error("Not found");
//       // error.status = '404';
//       // throw error;
//     }
//     res.json(contact);
//   } catch (error) {
//     if (error.message.includes("Cast to ObjectId failed")) {
//       error.status = 404;
//     }
//     next(error);
//   }
// });

// router.post("/", async (req, res, next) => {
//   try {
//     const { error } = joiSchema.validate(req.body);
//     if (error) {
//       throw new BadRequest(error.message);
//     }
//     console.log(req);
//     const newContact = await Contact.create(req.body);
//     res.status(201).json(newContact);
//   } catch (error) {
//     if (error.message.includes("validation failed")) {
//       error.status = 400;
//     }
//     next(error);
//   }
// });

module.exports = router;
