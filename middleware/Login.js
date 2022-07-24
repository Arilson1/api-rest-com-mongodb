const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).send({ message: 'Acesso negado.'})

    try {

        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()

    } catch (error) {
        res.status(400).send({ message: "Token inválido" })
    }

}