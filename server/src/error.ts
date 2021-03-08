import { Request, Response } from "express";

export enum ErrorField {
  USERNAME,
  EMAIL,
  PASSWORD,
  PASSWORD2,
}

export function error(res: Response, message: string, field?: ErrorField) {
  res.send({ error: { message, field } });
}

export function internal(res: Response) {
  error(res, "A internal error occured");
}

export function fieldRequired(res: Response, field: ErrorField) {
  error(res, "This field is required", field);
}

type ExpressCall = (req: Request, res: Response) => Promise<void>;
