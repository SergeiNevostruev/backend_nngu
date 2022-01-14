import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routes from './routes';
import ErrorHandler from './middleware/ErrorHandler';

const root = path.join.bind(this, __dirname, '../');
dotenv.config({ path: root('.env') });

// console.log(process.env.MONGO_URI);
mongoose
  .connect('mongodb+srv://user:user@mynewdb.bybi4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true })
  .catch((e) => console.log(e));

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', ...routes);

app.use('*', (request, response) => {
  response.status(404).send('Endpoint not found on server!');
});

app.use(ErrorHandler);

app.listen(3000, () => {
  console.log('Express server run http://localhost:3000/');
});
