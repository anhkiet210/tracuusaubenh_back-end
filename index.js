import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';

//ham ket noi db
import connectDB from './config/db.config.js';

//import cac router
import UserRouter from './src/routes/user.route.js';
import CropRouter from './src/routes/crop.route.js';
import QuestionRouter from './src/routes/question.route.js';
import AnwserRouter from './src/routes/anwser.route.js';
import PestRouter from './src/routes/pest.route.js';
import PesticideRouter from './src/routes/pesticide.route.js';
import PostRouter from './src/routes/post.route.js';
import AdminRouter from './src/routes/admin.route.js';

const app = express();
dotenv.config({ path: '.env' });

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    fileUpload({
        useTempFiles: true,
    }),
);

app.use(cors());
app.use('/api/users', UserRouter);
app.use('/api/crop', CropRouter);
app.use('/api/question', QuestionRouter);
app.use('/api/answer', AnwserRouter);
app.use('/api/pest', PestRouter);
app.use('/api/pesticide', PesticideRouter);
app.use('/api/post', PostRouter);
app.use('/api/admin', AdminRouter);

app.get('/', (req, res) => {
    res.send('tracuusaubenh-Thấu hiểu cây trồng');
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Connect successfully to ${port}!`));
