import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: this.getSuccessMessage(method, url),
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }

  private getSuccessMessage(method: string, url: string): string {
    const resource = this.extractResource(url);
    
    switch (method) {
      case 'GET':
        return `${resource} retrieved successfully`;
      case 'POST':
        return `${resource} created successfully`;
      case 'PUT':
      case 'PATCH':
        return `${resource} updated successfully`;
      case 'DELETE':
        return `${resource} deleted successfully`;
      default:
        return 'Operation completed successfully';
    }
  }

  private extractResource(url: string): string {
    const segments = url.split('/').filter(Boolean);
    const resourceSegment = segments.find(segment => 
      !segment.includes('api') && 
      !segment.includes('v1') && 
      !['me', 'profile'].includes(segment)
    );
    
    return resourceSegment ? 
      resourceSegment.charAt(0).toUpperCase() + resourceSegment.slice(1) : 
      'Resource';
  }
}