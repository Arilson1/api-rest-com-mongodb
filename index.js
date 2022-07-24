// config inicial
const express = require('express');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config()

// forma de ler JSON / middleware
app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json());

// rotas da API
const personRoutes = require('./routes/pesonRoutes');
const registerUser = require('./routes/registerUser');

app.use('/person', personRoutes);
app.use('/auth', registerUser);

// rota inicial / endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Oi, Express!' })
});
// entregar uma porta
//wk7xjA2FMoxSTPX8
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@apicluster.bcqjjpf.mongodb.net/?retryWrites=true&w=majority`)
.then(() => {
    console.log('Conectamos ao MongoDB!')
    app.listen(3000)
})
.catch((err) => console.log(err))