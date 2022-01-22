import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { connectDB } from '#database/mongodb.js';

import routeV1 from './routes/v1/index.js';

const app = express();

const port = process.env.APP_PORT || 3000;

const host = process.env.APP_HOST || 'localhost';

// Console log requests
app.use(morgan('combined'));

// Parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static dir
app.use(express.static(path.join(path.resolve(), 'src/public')));

// Init app
connectDB().then(() => {
	// Route init
	app.use(routeV1);

	// App listen
	app.listen(port, () => {
		console.log(`App listening at http://${host}:${port}`);
	});
});

export default app;
