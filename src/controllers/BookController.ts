import redisClient from "../config/redis";
import { DataResponse, ErrorResponse } from "../interfaces/responses";
import db from "../models";
import { Borrow } from "../models/borrow";

const getBookInfo = async(id:number):Promise<any> => {
    try{
        const book = await db.Book.findByPk(id,{
            include: [
                {
                  model: Borrow,
                  as: 'borrows',
                  attributes: ['score'],
                },
              ],
        });
        if (book) {
            const totalScores = book.borrows.reduce((acc: any, borrow: { score: number | 0; }) => acc + (borrow.score || 0), 0);
            const numberOfScores = book.borrows.filter((borrow: { score: number | 0; }) => borrow.score !== null).length;
            const averageScore = numberOfScores > 0 ? totalScores / numberOfScores : null;
    
            const bookResponse = {
                name: book.name,
                averageScore: averageScore !== null ? parseFloat(averageScore.toFixed(2)) : 'No scores yet',
            };
            const cacheKey = `book:${id}`;
            await redisClient.set(cacheKey, JSON.stringify(bookResponse), { EX: 3600 });

          const response: DataResponse<typeof bookResponse> = {
            success: true,
            data: bookResponse,
          };
          return {status:200,data:response}
        } else {
          const errorResponse: ErrorResponse = {
            success: false,
            error: 'Book not found',
          };
          return {status:404,data:errorResponse}
        }
    }catch(error:any){
        console.error("error:",error.message);
        return {status:500,data:error.message}
    }
}

export const bookController = {
    getBookInfo
}