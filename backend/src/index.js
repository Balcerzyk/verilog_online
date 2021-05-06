import dotenv from 'dotenv';
dotenv.config({path: '.env'});
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from './config/passport.js';

// config
import config from './config/config.js';
import databaseConfig from './config/database.js';

// middleware
import { notFound, catchErrors } from './middlewares/errors.js';

// routes
import users from './routes/users.js'
import projects from './routes/projects.js'
import files from './routes/files.js'

console.log('Starting server...')

passport();

await mongoose.connect(databaseConfig.mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
mongoose.connection.on('error', (err) => {
    console.log(`Could not connect to the database on ${databaseConfig.mongoUrl}`);
    process.exit();
});
console.log(`Successfully connected to the database on ${databaseConfig.mongoUrl}`);

const app = express();
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// routes
app.use('/api/users', users())
app.use('/api/projects', projects())
app.use('/api/files', files())

// errors handling
app.use(notFound);
app.use(catchErrors);

app.listen(config.server.port, () => {
    console.log(`Server is listening on port: ${config.server.port}`);
});

// import { exec } from 'child_process';
// exec('cd users_projects && cd test_our && make', (err, stdout, stderr) => { //verilator -Wall --cc our.v --exe --build sim_main.cpp
//   if (err) {
//     console.log(`nie ma`);
//     console.log(`stderr: ${stderr}`);
//     // node couldn't execute the command
//     return;
//   }

//   // the *entire* stdout and stderr (buffered)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// });