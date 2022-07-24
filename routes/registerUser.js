const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const login = require('../middleware/Login');

router.get('/:id', login, async (req, res) => {

    const id = req.params.id

    const user = await User.findById(id, '-password');

    if (!user) {return res.status(404).send({ message: 'Usuário não encontrado.'})}

    res.status(200).send({ user })
})

router.post('/register', async(req, res) => {

    const { name, email, password, confirmepassword } = req.body

    if(!name) return res.status(422).send({ message: 'Necessario preencher o campo nome.' });
    if(!email) return res.status(422).send({ message: 'Necessario preencher o campo e-mail.' });
    if(!password) return res.status(422).send({ message: 'Necessario preencher o campo senha.' });
    if(!confirmepassword) return res.status(422).send({ message: 'Necessario preencher o campo confirma senha.' });
    if(password !== confirmepassword) return res.status(422).send({ message: 'Os campos senha e confirmar senha não confere.' });

    const userExists = await User.findOne({ email })

    if(userExists) return res.status(422).send({ message: 'Por favor, utilize outro e-mail.' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: passwordHash,
    });

    try {

        await user.save()

        res.status(201).send({ message: 'Usuário criado com sucesso.' })

    } catch (error) {
        res.status(500).send({ message: 'Aconteceu um erro interno no servidor.' })
    }

});

router.post('/user', async (req, res) => {
    const { email, password } = req.body

    if(!email) return res.status(422).send({ message: 'Necessario preencher o campo e-mail.' });
    if(!password) return res.status(422).send({ message: 'Necessario preencher o campo senha.' });

    const user = await User.findOne({ email });

    if (!user) res.status(422).json({ message: 'Usuário ou senha inválidos.'});

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) res.status(422).json({ message: 'Usuário ou senha inválidos.'});

    try {
        const secret = process.env.SECRET

        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        )

        res.status(200).send({ menssage: 'Autenticação realizadaa com sucesso.', token })

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Aconteceu um erro interno no servidor.' })
    }

})

module.exports = router;