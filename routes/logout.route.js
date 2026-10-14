const { Token } = require("../models");

const logoutRoute = (app) => {
  app.post("/api/logout", async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
      const token = await Token.findOne({ where: { token: refreshToken } });

      if (!token) {
        throw new Error("Impossible de recuperer le token");
      }

      const success = await token.destroy();

      if (!success) {
        throw new Error("Suppression impossible");
      }

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({message:"Deconnexion reussie"});
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erreur du serveur veuillez ressayer" });
    }
  });
};


module.exports = logoutRoute
