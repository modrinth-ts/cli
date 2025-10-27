import { createHash } from 'node:crypto';

export const calculateSHA512 = (data: ArrayBuffer) =>
    createHash('sha512').update(Buffer.from(data)).digest('hex');

export const checkSHA512 = async (data: ArrayBuffer, expectedHash: string) =>
    calculateSHA512(data) === expectedHash.trim();
