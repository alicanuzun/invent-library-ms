import { checkSchema } from 'express-validator';

const bookCreateSchema = checkSchema({
  name: {
    in: ['body'],
    notEmpty: {
        errorMessage: 'Missing required field: Name'
    },
    isString: {
      errorMessage: 'Name must be string!',
    },
  },
});

export default bookCreateSchema;