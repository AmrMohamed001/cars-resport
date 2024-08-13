import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable, pipe } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): {}; // means any class
}
//decorator
export function serialize(Dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(Dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private Dto: ClassConstructor) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // code to run before request hit handler

    return next.handle().pipe(
      map((data: any) => {
        // code to run before response
        return plainToClass(this.Dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
