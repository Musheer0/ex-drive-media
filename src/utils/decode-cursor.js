export const DecodeCursor = (str)=>{
    return JSON.parse(Buffer.from(str,'base64').toString('utf-8'))
}