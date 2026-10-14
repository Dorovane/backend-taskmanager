const joi = require("joi")


module.exports = joi.object({
    pseudo:joi.string()
        .required()
        .min(3)
        .max(10)
        .messages({
            "string.empty":"Le pseudo ne peut etre vide",
            "string.base":"Le pseudo est une string",
            "any.required":"Pseudo obligatoire",
            "string.min":"Pseudo minimum 3 caracteres",
            "string.max":"Pseudo maximum 10 caracteres"
    }),
    email:joi.string()
        .required()
        .email()
        .messages({
            "string.empty":"L'email ne peut etre vide",
            "string.base":"L'email est une chaine de caractere",
            "any.required":"L'email est obligatoire",
            "string.email":"L'email est incorrect"
        }),
    password:joi.string()
        .required()
        .min(6)
        .max(20)
        .messages({
            "string.empty":"Le mdp ne peut etre vide",
            "string.base":"Le mot de passe est une string",
            "string.min":"Mdp minimum 6 caractere",
            "string.max":"Mdp maximum 20 caratere",
            "any.required":"Le mot de passe est obligatoire"
        })
})