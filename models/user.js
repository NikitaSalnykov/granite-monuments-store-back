const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseErr } = require("../helpers");

const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailValidation,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 2,
    },
    surname: {
      type: String,
      required: [true, "Surname is required"],
      minlength: 2,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      minlength: 10,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    accessToken: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    resetToken: {
      type: String,
      default: "",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.post("save", handleMongooseErr);

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailValidation).required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  surname: Joi.string().min(2),
  phone: Joi.string().min(10).required(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailValidation).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailValidation).required(),
  password: Joi.string().min(6).required(),
});

const updateRoleSchema = Joi.object({
  role: Joi.valid("user", "admin", "moderator").required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(2),
  surname: Joi.string().min(2),
  phone: Joi.string().min(10),
});

const passwordResetSchema  = Joi.object({
  newPassword: Joi.string().min(6).required(),
  resetToken: Joi.string().required()
});

const schemas = {
  registerSchema,
  emailSchema,
  loginSchema,
  updateRoleSchema,
  refreshSchema,
  updateSchema,
  passwordResetSchema ,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
