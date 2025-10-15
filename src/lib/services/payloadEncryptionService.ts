export interface Payload {
  move: string;
  salt: string;
}

export class PayloadEncryptionService {
  /**
   * @notice Derives an AES encryption key from the user's wallet signature.
   * @dev Hashes the signature using SHA-256 and imports it as an AES-GCM key.
   * @param signature The wallet signature string.
   * @return The derived AES CryptoKey for encryption and decryption.
   */
  static async deriveKeyFromSignature(signature: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const sigBytes = enc.encode(signature);
    const hash = await crypto.subtle.digest("SHA-256", sigBytes);
    return crypto.subtle.importKey("raw", hash, "AES-GCM", true, [
      "encrypt",
      "decrypt",
    ]);
  }

  /**
   * @notice Encrypts the player's move and salt into a secure payload.
   * @dev Uses the wallet signature to derive the AES key and encrypt the payload.
   * @param payload The object containing move and salt to encrypt.
   * @param signature The wallet signature used for key derivation.
   * @return The encrypted payload string.
   */
  static async encryptPayload(
    payload: Payload,
    signature: string
  ): Promise<string> {
    const key = await this.deriveKeyFromSignature(signature);
    const enc = new TextEncoder();
    const encodedData = enc.encode(JSON.stringify(payload));

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encodedData
    );

    const ivHex = Array.from(iv)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const ctHex = Array.from(new Uint8Array(ciphertext))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return `${ivHex}:${ctHex}`;
  }

  /**
   * @notice Decrypts an encrypted payload containing the player's move and salt.
   * @dev Uses the wallet signature to derive the AES key and decrypt the payload.
   * @param encrypted The encrypted payload string.
   * @param signature The wallet signature used for key derivation.
   * @return The decrypted payload object containing move and salt.
   */
  static async decryptPayload(
    encrypted: string,
    signature: string
  ): Promise<Payload> {
    const key = await this.deriveKeyFromSignature(signature);
    const [ivHex, ctHex] = encrypted.split(":");
    const iv = new Uint8Array(
      ivHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
    );
    const ct = new Uint8Array(
      ctHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ct
    );
    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decryptedBuffer)) as Payload;
  }
}
