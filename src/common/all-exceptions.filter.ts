import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Catch() // catch all exceptions
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // If it's an HttpException, we get its status code, otherwise 500
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : (exception as any).message || 'Oops! Something went wrong. Please try again later.';

        // For console
        console.error({
            message: (exception as any).message,
            stack: (exception as any).stack,
        });

        if (status >= 500 || // server errors
            [401, 403, 429].includes(status) // security-related client errors
        ) {
            // Log file path
            const logDir = path.join(__dirname, '../../logs');
            const date = new Date().toISOString().split('T')[0];
            const logFile = path.join(logDir, `errors-${date}.log`);

            // Create the logs folder if it doesn't exist
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }

            // Write to file
            const logEntry = `[${new Date().toISOString()}] ${request.method} ${request.url
                } - ${status}\n${JSON.stringify(message)}\n\n`;

            fs.appendFileSync(logFile, logEntry, 'utf8');
        }

        // Formatted JSON response
        response.status(status).json({
            success: false,
            path: request.url,
            timestamp: new Date().toISOString(),
            ...(typeof message === 'object' ? message : { message }),
        });
    }
}
