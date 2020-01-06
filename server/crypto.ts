import crypto from 'crypto';

class Crypto {
    private readonly algorithm = 'aes-256-cbc';
    private readonly IV_LENGTH = 16;
    private key: string;

    constructor() {
        this.key = crypto.randomBytes(256 / 8).toString('hex');
    }

    public encrypt = (text: string) => {
        const iv = crypto.randomBytes(this.IV_LENGTH);
        const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key, 'hex'), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }

    public decrypt = (text: string) => {
        const [iv, encryptedText] = text.split(':').map((part: string) => Buffer.from(part, 'hex'));
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
}

export default new Crypto();