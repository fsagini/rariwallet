export const authbase64 = (consumer_key: string, consumer_secret: string) => {
    const buffer = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');
    return buffer;
};
