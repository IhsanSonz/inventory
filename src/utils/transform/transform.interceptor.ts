import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'src/interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe<Response<T>>(
      map<any, Response<T>>((data: { message: string | null; result: T }) => {
        const statusCode =
          context.switchToHttp().getResponse<{ statusCode: number }>()
            .statusCode || 500;
        return {
          statusCode,
          message: data.message || (statusCode == 500 ? 'Server Error' : 'OK'),
          data: data.result,
        };
      }),
    );
  }
}
