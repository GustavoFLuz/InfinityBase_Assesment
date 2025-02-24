import express from 'express';
import router from './routes';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(cookieParser());
app.use(express.json());

app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
