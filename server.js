const express = require('express')
const mongoose = require('mongoose')

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:NoSql-18-main',{
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.set('debug', true);

app.use(require('./routes'));

app.listen(PORT, console.log(`LISTENING ON ${PORT}`));