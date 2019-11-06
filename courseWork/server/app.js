const express = require('express');
const app = express();
const path = require('path');
const apiRoutes = require('./routes/api/api');
const { storage, uploadsDir, uploadsFullPath } = require('./config/multerStorage');
const PORT = parseInt(process.argv[2]) || process.env.PORT || 12010;

const mongoose = require('mongoose'); 
const dbUrl = require('./utils/db_connection');

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to mongoDB');
        app.listen(PORT,
            () => console.log(`Server is ready on port ${PORT}`))
    })
    .catch(err => console.log(`Mongo Error: ${err}`));



const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.use(storage.single("file"));

app.use(require('morgan')('dev')); 

app.use('/api', apiRoutes);
