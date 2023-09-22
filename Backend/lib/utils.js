const jwt = require("jsonwebtoken");

// Middleware para verificar el token

const verifyToken = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  try {
    const verified = jwt.verify(token, process.env.TOKEN);
    req.user = verified;
    next();
  } catch (error) {
    try {
      const token = req.header("auth-token-refresh");
      const verified = jwt.verify(token, process.env.REFRESH_TOKEN);
      req.user = verified;
      next();
      //Ir a /refresh para obtener un nuevo token
      // next("/refresh");
    } catch (error) {
      return res.status(400).json({ error: "Token no es válido" });
    }
  }
};

// Funcion para generar el token

const generateToken = (user, isRefreshToken) => {
  if (isRefreshToken) {
    return jwt.sign({ user }, process.env.REFRESH_TOKEN, {
      expiresIn: "2h",
    });
  }

  return jwt.sign({ user }, process.env.TOKEN, { expiresIn: "30m" });
};

// Middleware para verificar si es admin

const isAdmin = (req, res, next) => {
  if (req.user.user && req.user.user.role === "admin") {
    res.status(200);
    next();
  } else {
    return res.status(401).json({ error: "Acceso admin denegado" });
  }
};

module.exports = { verifyToken, generateToken, isAdmin };
