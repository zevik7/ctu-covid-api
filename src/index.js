import express from 'express';
import morgan from 'morgan';
import ex from '#controllers/index.js';
import { connectDB } from './config/db/mongodb.js';

const app = express();

const port = process.env.APP_PORT;

app.use(morgan('combined'));

connectDB();

app.get('/', (req, res) => {
	const a = ex();
	res.send(a);
});

app.listen(port, () => {
	console.log(
		`Example app listening at http://${process.env.APP_HOST}:${port}`
	);
});
