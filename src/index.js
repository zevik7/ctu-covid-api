import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { connectDB } from '#config/db/mongodb.js';

import route from './routes/v1/index.js';

const app = express();

const port = process.env.APP_PORT || 3000;

const host = process.env.APP_HOST || 'localhost';

// Console log requests
app.use(morgan('combined'));

// Parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

// Static dir
app.use(express.static(path.join(path.resolve(), 'src/public')));

// Route init
route(app);

app.listen(port, () => {
	console.log(`Example app listening at http://${host}:${port}`);
});
