const router = require('express').Router();
const Person = require('../models/Person');


router.get('/', async (req, res) => {
    try{
        const people = await Person.find() 

        res.status(200).json(people)

    }catch (error) {
        res.status(500).json({ error:error })
    }
})

router.get('/:id', async (req, res) => {

    const id = req.params.id

    try{
        const people = await Person.findOne({_id: id}) 

        if (!people) {
            res.status(422).json({ message: 'Usuário não encontrado' })
            return
        }

        res.status(200).json(people)

    }catch (error) {
        res.status(500).json({ error:error })
    }
})

router.post('/', async (req, res) => {
    
    const { name, salary, approved } = req.body

    if (!name) {
        res.status(422).json({ error: 'O nome é obrigatorio.' })
        return
    }

    const person = {
        name,
        salary,
        approved
    }

    try{
        await Person.create(person)

        res.status(201).json({ message: 'pessoa inserida com sucesso' });

    }catch (error) {
        res.status(500).json({ error:error })
    }
});

router.patch('/:id', async (req, res) => {
    const id = req.params.id

    const { name, salary, approved } = req.body
    const person = {
        name,
        salary,
        approved
    }
    try{
        const updatedPerson = await Person.updateOne({_id: id}, person)

        if(updatedPerson.matchedCount === 0) {
            res.status(422).json({ message: 'Usuário não encontrado' })
            return
        }

        res.status(200).json(person);

    }catch (error) {
        res.status(500).json({ error:error })
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id

    const people = await Person.findOne({_id: id}) 

        if (!people) {
            res.status(422).json({ message: 'Usuário não encontrado' })
            return
        }

    try {

        await Person.deleteOne({_id: id})

        res.status(200).send({ message: 'Usuário deletado com sucesso'})

    } catch (error) {
        res.status(500).send({ error })
    }
});

module.exports = router;