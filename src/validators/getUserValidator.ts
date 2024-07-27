import { checkSchema } from 'express-validator';

const getUserInfoSchema = checkSchema({
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

export default getUserInfoSchema;