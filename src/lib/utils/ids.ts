import crypto from "node:crypto";

export function createId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(10).toString("hex")}`;
}

export function createTicketCode() {
  return `KP-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
}
