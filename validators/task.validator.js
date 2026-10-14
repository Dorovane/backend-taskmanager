const joi = require("joi")

module.exports = joi.object({
    name:joi.string()
        .required()
        .min(4)
        .max(10)
        .messages({
            "string.empty":"Le nom de la tache ne peut etre vide",
            "string.base":"Le nom de la tache doit etre une chaine de caractere",
            "string.min":"Minimum 4 caracteres pour le nom",
            "string.max":"Maximum 10 caractere pour le nom",
            "any.required":"Le nom de la tache est obligatoire"
        }),
    description:joi.string()
        .required()
        .messages({
            "string.empty":"La description ne peut etre vide",
            "string.base":"La description de la tache doit etre une chaine de caractere",
            "any.required":"La description de la tache est obligatoire"
        }),
        priority:joi.string()
        .valid("Basse","Moyenne","Haute")
        .required()
        .messages({
            "any.only":"La priorité doit etre 'Basse','Moyenne' ou 'Haute'",
            "string.empty":"La priorité ne peut etre vide",
            "string.base":"La priorité de la tache doit etre une chaine de caractere",
            "any.required":"La priorité de la tache est obligatoire"
        })
})