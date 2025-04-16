import { BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { MongooseError } from 'mongoose';

@Catch(MongoServerError, MongooseError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError | MongoServerError) {
    let message = 'Internal Server Error';
    let errors: Record<string, any> | string[] | string = {};

    console.log(exception);
    if (exception instanceof MongoServerError) {
      switch (exception.code) {
        case 11000:
          message = 'Duplicate key error';
          // Extract the duplicated field(s) from the error message
          // eslint-disable-next-line no-case-declarations
          const match = exception.message.match(
            /index: (.+) dup key: \{ (.+):/,
          );
          if (match && match[1] && match[2]) {
            const field = match[2].trim();
            errors = { [field]: `Value already exists for field: ${field}` };
          } else {
            errors = exception.message;
          }
          break;
        default:
          message = `MongoDB Error: ${exception.message}`;
          break;
      }
    }

    throw new BadRequestException({ message, errors });
  }
}
