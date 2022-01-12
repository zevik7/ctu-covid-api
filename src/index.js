import express from 'express';
import morgan from 'morgan';
import ex from '#controllers/index.js';
import { connectDB } from '#config/db/mongodb.js';

const app = express();

const port = process.env.APP_PORT;

const host = process.env.APP_HOST;

// Console log for requests
app.use(morgan('combined'));

// Parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

app.get('/', (req, res) => {
	const a = ex();
	res.send(a);
});

app.listen(port, () => {
	console.log(`Example app listening at http://${host}:${port}`);
});
