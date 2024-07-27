import { BorrowParams, ReturnParams } from '../interfaces/borrowParams';
import { DataResponse, ErrorResponse } from '../interfaces/responses';
import db from '../models';
import { Book } from '../models/book';
import { Borrow } from '../models/borrow';
const borrowBook = async(borrowParams: BorrowParams):Promise<any> =>{
    const user = await db.User.findByPk(borrowParams.userId);
    const book = await db.Book.findByPk(borrowParams.bookId);
    if(!user){
        const errorResponse: ErrorResponse = {
            success: false,
            error: "The user does not exist!",
          }
          return {status:404, data:errorResponse}
    }
    if(!book){
        const errorResponse: ErrorResponse = {
            success: false,
            error: "The book does not exist!",
          }
          return {status:404, data:errorResponse}
    }
    if(!book.is_available){
      const errorResponse: ErrorResponse = {
        success: false,
        error: "The book is not available!",
      }
      return {status:404, data:errorResponse}
    }
    const transaction = await db.Borrow.sequelize!.transaction();
    try{
        const newBorrow = await db.Borrow.create({
            user_id: user.id,
            book_id: book.id,
        },
        {transaction}
        );

        await db.Book.update(
            {is_available: false},
            {
                where:{
                    id: book.id,
                }  
            }
        );
        await transaction.commit();
        const dataResponse: DataResponse<typeof newBorrow> = {
            success: true,
            data: newBorrow,
        }
        return {status: 201,data: dataResponse}

    }catch(error:any){
        await transaction.rollback();
        console.error("transaction error:",error.message);
        return {status:500,data:error.message}
    }
}
const returnBook = async(returnParams: ReturnParams): Promise<any> =>{
    const user = await db.User.findByPk(returnParams.userId);
    const book = await db.Book.findByPk(returnParams.bookId);
    const rating = returnParams.rating;
    if(!user){
        const errorResponse: ErrorResponse = {
            success: false,
            error: "The user does not exist!",
          }
          return {status:404, data:errorResponse}
    }
    if(!book){
        const errorResponse: ErrorResponse = {
            success: false,
            error: "The book does not exist!",
          }
          return {status:404, data:errorResponse}
    }
    if(book.is_available){
      const errorResponse: ErrorResponse = {
        success: false,
        error: "The book is not borrowed!",
      }
      return {status:404, data:errorResponse}
    }

    const borrowedBook = await db.Borrow.findOne({
        where: {
            user_id: user.id,
            book_id: book.id,
            return_date: null,
        }
    });
    if(!borrowedBook){
        const errorResponse: ErrorResponse = {
            success: false,
            error: "The book is borrowed by other user!"
        }
        return {status:404,data:errorResponse}
    }
    const transaction = await db.Borrow.sequelize!.transaction();
    try{
        await db.Borrow.update({
            return_date: new Date(Date.now()),
            score: rating,
        },
        {
            where:{
                id: borrowedBook.id
            }
        },
        {transaction}
        );

        await db.Book.update(
            {is_available: true},
            {
                where:{
                    id: borrowedBook.book_id,
                }  
            }
        );
        await transaction.commit();
        const dataResponse: DataResponse<string> = {
            success: true,
            data: "The book successfully returned!",
        }
        return {status: 201,data: dataResponse}

    }catch(error:any){
        await transaction.rollback();
        console.error("transaction error:",error.message);
        return {status:500,data:error.message}
    }
}

const getUserInfo = async(id: number):Promise<any> =>{
    try{
        const user = await db.User.findByPk(id,{
            include: [
              {
                model: Borrow,
                as:'borrows',
                attributes:['id', 'user_id', 'book_id','borrow_date','return_date','score'],
                include: [
                  {
                    model: Book,
                    as: 'book',
                    attributes: ['id','name']
                  }
                ]
              
              },
            ],
          }
          );
          if (user) {
            const currentBorrows = user.borrows.filter((borrow:any) => !borrow.return_date);
            const previousBorrows = user.borrows.filter((borrow:any) => borrow.return_date);
      
            const userResponse = {
              name: user.name,
              currentlyBorrowedBooks: currentBorrows.map((borrow:any) => ({
                id: borrow.book.id,
                name: borrow.book.name,
                borrowDate: borrow.borrow_date,
              })),
              previouslyBorrowedBooks: previousBorrows.map((borrow:any) => ({
                id: borrow.book.id,
                name: borrow.book.name,
                borrowDate: borrow.borrow_date,
                returnDate: borrow.return_date,
                score: borrow.score,
              })),
            };
            const response: DataResponse<typeof userResponse> = {
              success: true,
              data: userResponse,
            };
            return {status: 200, data: response}
            // res.status(201).json(response);
          } else {
            const errorResponse: ErrorResponse = {
              success:false,
              error: "User not found!"
            }
            return {status: 404, data: errorResponse}
            // res.status(404).json(errorResponse);
          }
    } catch(error:any){
        console.error("error:",error.message);
        return {status:500,data:error.message}
    }
}
export const userController = {
    borrowBook,
    returnBook,
    getUserInfo
}

