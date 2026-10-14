const { ValidationError } = require("sequelize");
const { Task } = require("../models");
const taskSchema = require("../validators/task.validator");

exports.createTask = async (req, res) => {
  const userId = req.user.userId;
  const isAdmin = req.user.isAdmin;

  if (isAdmin) {
    return res.status(400).json({ message: "Désolé vous etes administrateur" });
  }

  const { error } = taskSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { description, name, priority } = req.body;

    const task = await Task.create({
      description,
      name,
      priority,
      userId,
    });

    if (!task) {
      throw new Error("Création de la tache impossible");
    }

    return res.status(200).json({ message: "Tâche créée avec success" });
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




exports.getAllTasks = async (req, res) => {
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "Route reserver aux administrateurs" });
  }

  try {
    const tasks = await Task.findAll();

    if (tasks.length === 0) {
      return res.status(404).json({ message: "Aucune tache pour le moment" });
    }

    return res.status(200).json({ data: tasks });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur du serveur veuillez ressayer" });
  }
};



exports.getTasks = async (req, res) => {
  const paramsId = req.params.id;
  const id = req.user.userId;

  if (id != paramsId) {
    return res
      .status(403)
      .json({ message: "Impossible d'acceder a la ressource" });
  }

  try {
    const tasks = await Task.findAll({ where: { userId: id } });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "Aucune tache pour le moment" });
    }

    return res.status(200).json({ data: tasks });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur du serveur veuillez ressayer" });
  }
};

exports.getTask = async (req, res) => {
  const userId = req.params.userId;
  const id = req.user.userId;
  const taskId = req.params.taskId;

  if (id != userId) {
    return res
      .status(403)
      .json({ message: "Impossible d'acceder a la ressource" });
  }

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ message: "Aucune tache pour ne conrespond" });
    }

    return res.status(200).json({ data: task });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur du serveur veuillez ressayer" });
  }
};

exports.deleteTask = async (req, res) => {
  const userId = req.params.userId;
  const id = req.user.userId;
  const taskId = req.params.taskId;

  if (id != userId) {
    return res
      .status(403)
      .json({ message: "Impossible d'acceder a la ressource" });
  }

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "Tache inexistante" });
    }

    const success = await task.destroy();

    if (!success) {
      throw new Error("Suppression de la tache impossible");
    }

    return res.status(204);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur du serveur veuillez ressayer" });
  }
};

exports.updateTask = async (req, res) => {
  const userId = req.params.userId;
  const id = req.user.userId;
  const taskId = req.params.taskId;

  if (id != userId) {
    return res
      .status(403)
      .json({ message: "Impossible d'acceder a la ressource" });
  }

  const { error } = taskSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "Tache introuvable" });
    }

    const { description, name, priority } = req.body;

    const existingTask = await Task.findOne({ where: { name } });

    if (existingTask) {
      return res.status(400).json({ message: "Cette tache existe deja" });
    }

    const success = await task.update({
      description,
      name,
      priority,
      userId: id,
    });

    if (!success) {
      throw new Error("Maj de la tache impossible");
    }

    return res.status(200).json({ message: "Tâche maj avec succes" });
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

exports.partialUpdateTask = async (req, res) => {
  const userId = req.params.userId;
  const id = req.user.userId;
  const taskId = req.params.taskId;

  if (id != userId) {
    return res
      .status(403)
      .json({ message: "Impossible d'acceder a la ressource" });
  }

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "Tache introuvable" });
    }

    const { description, name, priority } = req.body;

    if (name) {
      const existingTask = await Task.findOne({ where: { name } });

      if (existingTask) {
        return res.status(400).json({ message: "Cette tache existe deja" });
      }

      const success = await task.update({
        name,
      });

      if (!success) {
        throw new Error("Maj de la tache impossible");
      }
    }

    if (description) {
      const success = await task.update({
        description,
      });

      if (!success) {
        throw new Error("Maj de la tache impossible");
      }
    }

    if (priority) {
      const success = await task.update({
        priority,
      });

      if (!success) {
        throw new Error("Maj de la tache impossible");
      }
    }

    return res.status(200).json({ message: "Tâche maj avec succes" });
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
