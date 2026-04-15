/**
 * KA Encryption Suite: Secure E2EE Utils
 * Implements AES-GCM 256 for dashboard-native encryption.
 */

const MASTER_KEY_STR = import.meta.env.VITE_ENCRYPTION_MASTER_KEY || "kone_academy_secure_2026_default";

/**
 * Derives a cryptographic key from the master string and a specific salt (access code)
 */
async function deriveKey(accessCode) {
    const encoder = new TextEncoder();
    const material = await crypto.subtle.importKey(
        "raw",
        encoder.encode(MASTER_KEY_STR + accessCode),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode(accessCode),
            iterations: 100000,
            hash: "SHA-256"
        },
        material,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

/**
 * Encrypts plaintext using AES-GCM
 */
export async function encryptMessage(text, accessCode) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const key = await deriveKey(accessCode);
    
    // Generate a unique IV for every message
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        data
    );

    // Combine IV + Encrypted Data and encode as Base64 for transit
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts ciphertext using AES-GCM
 */
export async function decryptMessage(cipherBase64, accessCode) {
    try {
        const decoded = new Uint8Array(atob(cipherBase64).split("").map(c => c.charCodeAt(0)));
        const iv = decoded.slice(0, 12);
        const data = decoded.slice(12);
        
        const key = await deriveKey(accessCode);
        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            data
        );

        return new TextDecoder().decode(decrypted);
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Invalid access code or corrupted message.");
    }
}
