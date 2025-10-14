
export interface Payload {
  move: string;
  salt: string;
}

export class PayloadEncryptionService {
  // Derive AES key from wallet signature
  static async deriveKeyFromSignature(signature: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const sigBytes = enc.encode(signature);
    const hash = await crypto.subtle.digest("SHA-256", sigBytes);
    return crypto.subtle.importKey("raw", hash, "AES-GCM", true, ["encrypt", "decrypt"]);
  }

  // Encrypt JSON payload
  static async encryptPayload(payload: Payload, signature: string): Promise<string> {
    const key = await this.deriveKeyFromSignature(signature);
    const enc = new TextEncoder();
    const encodedData = enc.encode(JSON.stringify(payload));

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedData);

    const ivHex = Array.from(iv).map((b) => b.toString(16).padStart(2, "0")).join("");
    const ctHex = Array.from(new Uint8Array(ciphertext)).map((b) => b.toString(16).padStart(2, "0")).join("");

    return `${ivHex}:${ctHex}`;
  }

  // Decrypt JSON payload
  static async decryptPayload(encrypted: string, signature: string): Promise<Payload> {
    const key = await this.deriveKeyFromSignature(signature);
    const [ivHex, ctHex] = encrypted.split(":");
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
    const ct = new Uint8Array(ctHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));

    const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decryptedBuffer)) as Payload;
  }
}
