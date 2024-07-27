import { checkSchema } from 'express-validator';

const getBookInfoSchema = checkSchema({
  id: {
    in: ['params'],
    notEmpty: {
        errorMessage: 'Missing required field: ID'
    },
    isInt: {
      errorMessage: 'ID must be an integer!',
    },
  },
});

export default getBookInfoSchema;