const jwt = require("jsonwebtoken")


const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY

const auth = (req,res,next) => {
    const {accessToken} = req.cookies

    if(!accessToken){
        return res.status(401).json({message:"Veuillez vous connecter"})
    }

    try{
        const decodedToken = jwt.verify(accessToken,ACCESS_TOKEN_KEY)

        req.user = decodedToken  

        next()

    }catch(error){
        console.error(error)
        return res.status(401).json({message:"Token expiré ou invalide connectez vous a nouveau"})
    }
}

module.exports = auth