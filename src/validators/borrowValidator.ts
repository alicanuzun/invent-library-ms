import { checkSchema } from 'express-validator';

const borrowSchema = checkSchema({
  userId: {
    in: ['params'],
    notEmpty:{
        errorMessage: 'Missing required param: User ID'
    },
    isInt: {
      errorMessage: 'User ID must be an integer',
    },
    toInt: true,
  },
  bookId: {
    in: ['params'],
    notEmpty:{
        errorMessage: 'Missing required param: Book ID'
    },
    isInt: {
      errorMessage: 'Book ID must be an integer',
    },
    toInt: true,
  },
});

export default borrowSchema;