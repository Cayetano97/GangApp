const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { generateToken, verifyToken, isAdmin } = require("../lib/utils");

const User = require("../Model/userModel");

// Registro

router.post("/signup", async (req, res) => {
  try {
    const data = new User({
      email: req.body.email,
      username: req.body.username,
      lastname: req.body.lastname,
      password: await bcrypt.hash(req.body.password, 10),
    });
    const datasaved = await data.save();
    res
      .status(200)
      .json({ Status: "Success register", datasaved, error: null });
  } catch (error) {
    res
      .status(400)
      .json({ Status: "Error", datasaved: null, error: "Fallo SingUp" });
  }
});

// Login, verificación de contraseña y generación de token
router.post("/login", async (req, res) => {
  try {
    const data = await User.findOne({ email: req.body.email }).exec();
    if (data) {
      const password = await bcrypt.compare(req.body.password, data.password);
      if (password) {
        const user = { email: data.email, role: data.role };
        const token = generateToken(user, false);
        const refreshToken = generateToken(user, true);

        res.status(200).json({
          Status: "Success Login",
          data: {
            id: data._id,
            email: data.email,
            user: data.username,
            role: data.role,
            token,
            refreshToken,
          },
          error: null,
        });
      } else {
        body = req.body;
        res.status(404).json({
          Status: "Error - Failed Login",
          data: null,
          error: "Fallo Login - Email or password incorrect",
        });
      }
    } else {
      res.status(404).json({
        Status: "Error",
        data: null,
        error: "Fallo Login - Email or password incorrect",
      });
    }
  } catch (error) {
    res.status(404).json({
      Status: "Failed",
      datasaved: null,
      error: "Fallo Login - Email or password incorrect",
    });
  }
});

// Refresh token

router.get("/refresh", verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Acceso denegado" });
  }

  const user = { email: req.user.email };
  const token = generateToken(user, false);
  const refreshToken = generateToken(user, true);

  res.status(200).json({
    status: "succeeded",
    data: {
      token,
      refreshToken,
    },
    error: null,
  });
});

// get user balance info

router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const data = await User.findById(req.params.id).exec();
    if (data) {
      res
        .status(200)
        .json({ Status: "Success", balance: data.balance, error: null });
    } else {
      res.status(404).json({ Status: "Failed" });
    }
  } catch (error) {}
});

// get user all info

router.get("/userallinfo/:id", verifyToken, async (req, res) => {
  try {
    const data = await User.findById(req.params.id).exec();
    if (data) {
      res.status(200).json({ Status: "Success", data, error: null });
    } else {
      res.status(404).json({ Status: "Failed" });
    }
  } catch (error) {}
});

//Actualizar información por usuario

router.patch("/updateuser/:id", verifyToken, async (req, res) => {
  try {
    const id_user = req.params.id;
    const body = { ...req.body };
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    const data = await User.updateOne(
      { _id: id_user },
      {
        $set: body,
      }
    );
    res
      .status(200)
      .json({ Status: "Success updating user info", data, error: null });
  } catch (error) {
    res
      .status(401)
      .json({ Status: "Failed updating user info", data: null, error });
  }
});

//ROLE ADMIN

//Get obtener información por usuario

router.get("/userinfo/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const id_user = req.params.id;
    const data = await User.findById(id_user).exec();
    res
      .status(200)
      .json({ Status: "Success getting user info", data, error: null });
  } catch (error) {
    res
      .status(401)
      .json({ Status: "Failed getting user info", data: null, error });
  }
});

//Get all users

router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const data = await User.find().exec();
    res.status(200).json({ Status: "Success getting user", data, error: null });
  } catch (error) {
    res.status(401).json({ Status: "Failed getting user", data: null, error });
  }
});

module.exports = router;
