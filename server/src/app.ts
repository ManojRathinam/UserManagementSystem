import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/user-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as any)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log(error));

app.use('/api', userRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({ message: err.message });
});

export default app;
