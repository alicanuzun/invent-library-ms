import { Router, Request, Response, NextFunction } from 'express';
import db from '../models';
import { userController } from '../controllers/UserController';
import { DataResponse, ErrorResponse } from '../interfaces/responses';
import { BorrowParams, ReturnParams } from '../interfaces/borrowParams';
import { param, query, body, validationResult, ContextRunner, checkSchema } from 'express-validator';
import borrowSchema from '../validators/borrowValidator';
import returnSchema from '../validators/returnValidator';
import { Book } from '../models/book';
import { Borrow } from '../models/borrow';
import userCreateSchema from '../validators/userCreateValidator';
import getUserInfoSchema from '../validators/getUserValidator';
const router = Router();

/** List Users */
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await db.User.findAll();
    const response: DataResponse<typeof users> = {
      success: true,
      data: users,
    };
    res.status(200).json(response);
  } catch (error: any) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: error.message,
    };
    res.status(500).json(errorResponse);
  }
});

/** Get User Info */
router.get('/:id', getUserInfoSchema, async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    console.error(result)
    
    if (!result.isEmpty()) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: result.array().map(r => r.msg).join(", "),
      }
      return res.status(400).json(errorResponse);
    }
    let response = await userController.getUserInfo(parseInt(req.params.id));
    res.status(response.status).json(response);
  } catch (error: any) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: error.message,
    };
    res.status(500).json(errorResponse);
  }
});

/** Create User Route */
router.post('/', userCreateSchema, async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    console.error(result)
    
    if (!result.isEmpty()) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: result.array().map(r => r.msg).join(", "),
      }
      return res.status(400).json(errorResponse);
    }

    const { name } = req.body;
    const newUser = await db.User.create({ name });
    const response: DataResponse<typeof newUser> = {
      success: true,
      data: newUser,
    };
    res.status(201).json(response);
  } catch (error: any) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: error.message,
    };
    res.status(500).json(errorResponse);
  }
});

/** Borrow Book Route */
router.post('/:userId/borrow/:bookId',borrowSchema, async (req:Request, res:Response) => {
  try{
    const result = validationResult(req);
    console.error(result)
    
    if (!result.isEmpty()) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: result.array().map(r => r.msg).join(", "),
      }
      return res.status(400).json(errorResponse);
    }
    const borrowParams: BorrowParams = {
      userId: parseInt(req?.params?.userId),
      bookId: parseInt(req.params.bookId),
    }
    let response = await userController.borrowBook(borrowParams)
    res.status(response.status).json(response);
    // res.status(201).json(response);
  }catch(error:any){
    const errorResponse: ErrorResponse = {
      success: false,
      error: error.message,
    };
    res.status(500).json(errorResponse);
  }
});

/** Return Book Route */
router.post('/:userId/return/:bookId',returnSchema, async (req:Request, res:Response) => {
  try{
    
    const result = validationResult(req);
    console.error(result)
    
    if (!result.isEmpty()) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: result.array().map(r => r.msg).join(", "),
      }
      return res.status(400).json(errorResponse);
    }
    const returnParams: ReturnParams = {
      userId: parseInt(req?.params?.userId),
      bookId: parseInt(req?.params?.bookId),
      rating: parseInt(req?.body?.score),
    }
    let response = await userController.returnBook(returnParams)
    res.status(response.status).json(response);
    // res.status(201).json(response);
  }catch(error:any){
    const errorResponse: ErrorResponse = {
      success: false,
      error: error.message,
    };
    res.status(500).json(errorResponse);
  }
})
export default router;
