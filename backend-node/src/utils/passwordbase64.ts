export const passwordbase64 = (shortCode: string, passkey: string, timestamp: any) => {
    const buffer = Buffer.from(shortCode + passkey + timestamp).toString('base64');
    return buffer;
};
