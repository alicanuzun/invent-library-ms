import { Router, Request, Response } from 'express';
import db from '../models';
import { DataResponse, ErrorResponse } from '../interfaces/responses';
import { Borrow } from '../models/borrow';
import { bookController } from '../controllers/BookController';
import redisClient from '../config/redis';

const router = Router();

// Get all books
router.get('/', async (req: Request, res: Response) => {
  try {
    const books = await db.Book.findAll();
    const response: DataResponse<typeof books> = {
      success: true,
      data: books,
    };
    res.status(201).json(response);
  } catch (error:any) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: error.message,
    };
    res.status(500).json(errorResponse);
  }
});

// Get a book by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id
    const cacheKey = `book:${bookId}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
        const response: DataResponse<typeof cachedData> = {
            success: true,
            data: JSON.parse(cachedData),
          };
        return res.status(200).json(response);
    }
    let response = await bookController.getBookInfo(parseInt(bookId));
    res.status(response.status).json(response);
  } catch (error:any) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: error.message,
    };
    res.status(500).json(errorResponse);
  }
});

// Create a new book
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'The "name" field is required and cannot be null.',
      };
      return res.status(400).json(errorResponse);
    }

    const newBook = await db.Book.create({ name });

    const response: DataResponse<typeof newBook> = {
      success: true,
      data: newBook,
    };
    res.status(201).json(response);
  } catch (error:any) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: error.message,
    };
    res.status(500).json(errorResponse);
  }
});

export default router;
