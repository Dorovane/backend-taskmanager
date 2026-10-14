const userSchema = require("../validators/user.validator");
const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const { ValidationError } = require("sequelize");

exports.createUser = async (req, res) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { pseudo, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    if (!hash) {
      throw new Error("Hashage du mdp impossible");
    }

    const user = await User.create({
      pseudo,
      email,
      password: hash,
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Impossible de créer l'utilisateur" });
    }

    return res.status(200).json({ message: "Utilisateur créer avec succes" });
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(error);
      return res.status(500).json({ message: error.errors[0].message });
    }
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur du serveur veuillez ressayer" });
  }
};

exports.getAllUsers = async (req, res) => {
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    return res
      .status(401)
      .json({ message: "Route reservé aux administrateurs" });
  }

  try {
    const users = await User.findAll();

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun utilisateur pour le moment" });
    }

    return res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur du serveur veuillez ressayer" });
  }
};

exports.getUser = async (req, res) => {
  const userId = req.params.id;
  const isAdmin = req.user.isAdmin;

  const id = isAdmin ? userId : req.user.userId;

  if (userId != id && !isAdmin) {
    return res
      .status(401)
      .json({ message: "Vous n'avez pas acces a cette route" });
  }

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur du serveur veuillez ressayer" });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  const isAdmin = req.user.isAdmin;

  const id = isAdmin ? userId : req.user.userId;

  if (userId != id && !isAdmin) {
    return res
      .status(401)
      .json({ message: "Vous n'avez pas acces a cette route" });
  }

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const success = await user.destroy();

    if (!success) {
      throw new Error("Impossible de supprimer l'utilisateur");
    }

    return res.status(200).json({ message: "Suppression reussie" });
  } catch (error) {
    console.eroor(error);
    return res
      .status(500)
      .json({ message: "Erreur du serveur veuillez ressayer" });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const isAdmin = req.user.isAdmin;

  const id = isAdmin ? userId : req.user.userId;

  if (userId != id && !isAdmin) {
    return res
      .status(401)
      .json({ message: "Vous n'avez pas acces a cette route" });
  }

  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { pseudo, email, password } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Aucun utilisateur ne conrespond" });
    }

    const isExisting = await User.findOne({ where: { email } });

    if (isExisting) {
      return res.status(400).json({ message: "Cet email existe deja" });
    }

    const hash = await bcrypt.hash(password, 10);

    if (!hash) {
      throw new Error("Hashage du mdp impossible");
    }

    const updateUser = await user.update({
      pseudo,
      email,
      password: hash,
    });

    if (!updateUser) {
      return res
        .status(400)
        .json({ message: "Impossible de maj l'utilisateur" });
    }

    return res.status(200).json({ message: "Utilisateur maj avec succes" });
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(error);
      return res.status(500).json({ message: error.errors[0].message });
    }
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur du serveur veuillez ressayer" });
  }
};

exports.partialUpdateUser = async (req, res) => {
  const userId = req.params.id;
  const isAdmin = req.user.isAdmin;

  const id = isAdmin ? userId : req.user.userId;

  if (userId != id && !isAdmin) {
    return res
      .status(401)
      .json({ message: "Vous n'avez pas acces a cette route" });
  }

  const { pseudo, email, password } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Aucun utilisateur ne conrespond" });
    }

    if (email) {
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if(!emailReg.test(email)){
            return res.status(400).json({message:"Entrez une email valide"})
        }
      const isExisting = await User.findOne({ where: { email} });

      if (isExisting) {
        return res.status(400).json({ message: "Cet email existe deja" });
      }

      const updateUser = await user.update({
        email,
      });

      if (!updateUser) {
        return res
          .status(400)
          .json({ message: "Impossible de maj l'utilisateur" });
      }
    }

    if (pseudo) {
      const updateUser = await user.update({
        pseudo,
      });

      if (!updateUser) {
        return res
          .status(400)
          .json({ message: "Impossible de maj l'utilisateur" });
      }
    }

    if (password) {
      const hash = await bcrypt.hash(password, 10);

      if (!hash) {
        throw new Error("Hashage du mdp impossible");
      }

      const updateUser = await user.update({
        password: hash,
      });

      if (!updateUser) {
        return res
          .status(400)
          .json({ message: "Impossible de maj l'utilisateur" });
      }
    }

    return res.status(200).json({ message: "Utilisateur maj avec succes" });
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(error);
      return res.status(500).json({ message: error.errors[0].message });
    }
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur du serveur veuillez ressayer" });
  }
};
