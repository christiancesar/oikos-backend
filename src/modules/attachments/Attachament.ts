import { randomUUID } from "crypto";

type AttachmentConstructorParams = {
  id?: string;
  url: string;
  createdAt: Date;
  updatedAt?: Date | null;
};
export class Attachments {
  id: string;
  url: string;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor({ id, url, createdAt, updatedAt }: AttachmentConstructorParams) {
    this.id = id ?? randomUUID();
    this.url = url;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt;
  }
}
