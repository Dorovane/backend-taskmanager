const jwt = require("jsonwebtoken");
const { User, Token } = require("../models");
const bcrypt = require("bcrypt");
const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;
const crypto = require("crypto");

const loginRoute = (app) => {
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Veuillez renseigner toute les informations" });
    }

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res
        .status(400)
        .json({ message: "Les données ne sont pas valide" });
    }

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Cet utilisateur n'existe pas" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Mot de passe incorrect" });
      }

      const oldRefreshToken = await Token.findOne({
        where: { userId: user.id },
      });

      if (oldRefreshToken) {
        const success = await oldRefreshToken.destroy();

        if (!success) {
          throw new Error("Suppression de l'ancien token de la bdd impossible");
        }
        const { accessToken, refreshToken } = req.cookies;

        if (accessToken) {
          res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
          });
        }
        if (refreshToken) {
          res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
          });
        }
      }

      const accessToken =  jwt.sign(
        { userId: user.id, userPseudo: user.pseudo, userEmail: user.email ,isAdmin:user.isAdmin},
        ACCESS_TOKEN_KEY,
        { expiresIn: "1d" },
      );

      if (!accessToken) { 
        throw new Error("Erreur lors de la creation du accessToken");
      }

      const refreshToken = crypto.randomBytes(40).toString("hex");

      if (!refreshToken) {
        throw new Error("Erreur lors de la creation du refreshToken");
      }

      const token = await Token.create({
        token: refreshToken,
        expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: user.id,
      });

      if (!token) {
        throw new Error("Erreur lors de la sauvegarde du token en bdd");
      }

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge:  15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ message: "Connexion reussie" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur du serveur veuillez ressayer"});
    }
  });
};

module.exports = loginRoute;
