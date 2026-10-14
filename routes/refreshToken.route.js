const { Token, User } = require("../models");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;

const refreshTokenRoute = (app) => {
  app.post("/api/refresh-token", async (req, res) => {
    const expiredRefreshToken = req.cookies.refreshToken;

    if (!expiredRefreshToken) {
      return res.status(401).json({ message: "Veuillez vous reconnecter" });
    }

    try {
      const oldRefreshToken = await Token.findOne({
        where: { token: expiredRefreshToken },
      });

      if (!oldRefreshToken) {
        return res.status(401).json({ message: "Veuillez vous reconnecter" });
      }

      const isValid = oldRefreshToken.expiresDate < Date.now();

      if (isValid) {
        const success = oldRefreshToken.destroy();

        if (!success) {
          throw new Error("Suppression de l'ancien token de la bdd echoué");
        }

        return res.status(401).json({ message: "Veuillez vous reconnecter" });
      }
      const userId = oldRefreshToken.userId;

      const success = oldRefreshToken.destroy();

      if (!success) {
        throw new Error("Suppression de l'ancien token de la bdd echoué");
      }

      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error(
          "Impossible de récuperer l'utilisateur par son id en bdd",
        );
      }

      const accessToken = jwt.sign(
        {
          userId,
          userPseudo: user.pseudo,
          userEmail: user.email,
          isAdmin: user.isAdmin,
        },
        ACCESS_TOKEN_KEY,
        { expiresIn: "15m" },
      );

      if (!accessToken) {
        throw new Error("Impossible de créer l'access token");
      }

      const refreshToken = crypto.randomBytes(40).toString("hex");

      if (!refreshToken) {
        throw new Error("Impossible de créer le refresh token");
      }

      const token = await Token.create({
        token: refreshToken,
        expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId,
      });

      if (!token) {
        throw new Error("Sauvegarde en bdd impossible du token");
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 15 * 60 * 1000,
      });

      return res.status(200).json({message:"Token mis a jour avec success"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Erreur du serveur veuillez ressayer"})
    }
  });
};

module.exports = refreshTokenRoute;
