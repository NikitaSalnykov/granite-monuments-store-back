const { User } = require("../models/user");
const { HttpError, sendEmail } = require("../helpers");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { nanoid } = require("nanoid");

const { SECRET_KEY, BASE_URL, FRONT_URL, REFRESH_SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const verifyEmail = {
    to: email,
    html: `<div>
    <h2>Здравствуйте, ${email}</h2>
    <p>Ваш аккаунт успешно создан для завершения регистрации нажмите кнопку:<p>
    <p><a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Завершить регистрацию</a></p>
    <p>Спасибо!</p>
    </div>`,
  };

  await sendEmail(verifyEmail);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      role: newUser.r,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  const userEmail = user.email;

  res.redirect(
    `${FRONT_URL}/react-fabric-shop/verification?fromEmail=true&email=${userEmail}`
  );
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(400, "Missing required field email");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    html: `<div>
    <h2>Hello, ${email}</h2>
    <p>To complete your verification process, please click on the link below:<p>
    <p><a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to verify</a></p>
    <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
    <p>Thank you!</p>
    </div>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not a verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  // const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  const accessToken = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "180s",
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "744h",
  });

  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  res.json({
    accessToken,
    refreshToken,
    user,
  });
};

const refresh = async (req, res) => {
  const { refreshToken: token } = req.body;

  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);
    const isExist = await User.findOne({ refreshToken: token });

    if (!isExist) {
      throw HttpError(403, "Refresh token invalid");
    }

    const payload = {
      id,
    };

    const newAccessToken = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "180s",
    });
    const newRefreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: "744h",
    });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { accessToken: newAccessToken, refreshToken: newRefreshToken },
      { new: true }
    );

    res.status(200).json({
      accessToken: updatedUser.accessToken,
      refreshToken: updatedUser.refreshToken,
    });
  } catch (error) {
    res.status(403).json({
      error: error.message,
    });
  }
};

const current = async (req, res) => {
  const { user } = req;
  res.status(200).json({
    code: 200,
    message: "OK",
    data: {
      user,
    },
  });
};

const update = async (req, res) => {
  const { user, body } = req;
  const updateUser = await User.findByIdAndUpdate(user._id, body, {
    new: true,
  });
  res.status(200).json({
    code: 200,
    message: "OK",
    data: {
      user: updateUser,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { accessToken: null, refreshToken: null });
  res.status(201).json({
    message: "Logout success",
  });
};

const updateRole = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  res.json(result);
};

const passwordForgot = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, "Missing required field email");
  }

  const resetToken  = nanoid();

  await User.findByIdAndUpdate(user._id, { resetToken });

  const resetEmail = {
    to: email,
    html: `<div>
    <h2>Изменение пароля на вашем аккаунте ${email}</h2>
    <p>Это автоматическое уведомление для подтверждения изменения пароля на вашем аккаунте на сайте Dream Fatin. Если вы не выполняли данное действие, пожалуйста, проигнорируйте это уведомление и немедленно свяжитесь с нашей службой поддержки.<p>
    <p><a target="_blank" href="${FRONT_URL}/reset-password/${resetToken}">Изменить пароль</a></p>
    <p>Спасибо!</p>
    </div>`,
  };

  await sendEmail(resetEmail);

  res.status(200).json({ message: "Reset password email sent",
  user });
};

const passwordReset = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const user = await User.findOne({ resetToken });

    if (!user) {
      throw HttpError(400, "Invalid reset token");
    }
    
    
    const hashPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { password: hashPassword, resetToken: null },
      { new: true }
    );

    res.status(200).json({ message: "Password reset successful", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  let result;
  result = await User.find({}, 'email name surname phone createdAt');
  res.json(result);
};



module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateRole: ctrlWrapper(updateRole),
  refresh: ctrlWrapper(refresh),
  update: ctrlWrapper(update),
  passwordForgot: ctrlWrapper(passwordForgot),
  passwordReset: ctrlWrapper(passwordReset),
  getAll: ctrlWrapper(getAll)
};
