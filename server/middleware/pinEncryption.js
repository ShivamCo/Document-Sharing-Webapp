import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ENCRYPTION_KEY = process.env.PIN_ENCRYPTION_KEY;
const IV_LENGTH = 16;

export function encryptPin(pin) {
  if (!pin) throw new Error("PIN is required for encryption");

  const key = Buffer.from(ENCRYPTION_KEY, "utf-8");
  if (key.length !== 32) throw new Error("PIN_ENCRYPTION_KEY must be 32 bytes");

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(pin, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptPin(encryptedPin) {
  if (!encryptedPin) throw new Error("Encrypted PIN is missing");

  const key = Buffer.from(ENCRYPTION_KEY, "utf-8");
  if (key.length !== 32) throw new Error("PIN_ENCRYPTION_KEY must be 32 bytes");

  const parts = encryptedPin.split(":");
  if (parts.length !== 2) throw new Error("Invalid encrypted PIN format");

  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = Buffer.from(parts[1], "hex");
  if (iv.length !== 16) throw new Error(`Invalid IV length: ${iv.length}`);

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
