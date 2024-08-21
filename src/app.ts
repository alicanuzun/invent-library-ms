import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import usersRouter from './routes/users';
import booksRouter from './routes/books';

const app: Application = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/books', booksRouter);
// Hata yönetimi middleware'i
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
        res.status(400).json({
            data: null,
            error: 'Invalid JSON format'
        });
    } else {
        res.status(500).json({
            data: null,
            error: 'Internal Server Error'
        });
    }
});

export default app;
