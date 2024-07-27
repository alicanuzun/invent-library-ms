import { checkSchema } from 'express-validator';

const returnSchema = checkSchema({
  userId: {
    in: ['params'],
    notEmpty:{
        errorMessage: 'Missing parameter: User ID',
    },
    isInt: {
      errorMessage: 'User ID must be an integer',
    },
    toInt: true,
  },
  bookId: {
    in: ['params'],
    notEmpty:{
        errorMessage: 'Missing parameter: Book ID',
    },
    isInt: {
      errorMessage: 'Book ID must be an integer',
    },
    toInt: true,
  },
  score: {
    in:['body'],
    notEmpty:{
        errorMessage: 'Missing parameter: Score',
    },
    isInt: {
        errorMessage: 'Score must be integer',
    },
    toInt: true,
  }
});

export default returnSchema;