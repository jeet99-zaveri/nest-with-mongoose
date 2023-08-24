import { HttpStatus } from '@nestjs/common';

export interface ResponseInterface {
  status: HttpStatus;
  message: string;
  data: object | any;
  error: object | null;
}

export const response = (
  status = HttpStatus.OK,
  message = 'OK',
  data = null,
  error = null,
) => {
  return { status, message, data, error };
};
