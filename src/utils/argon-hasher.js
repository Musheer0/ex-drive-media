import  argon2 from "argon2"

export const hash_content = async(text,secret)=>{
        const hashed_password =await argon2.hash(text,{
            secret: Buffer.from(secret)
        });
        return hashed_password;
}

export const compare_content = async (text, hashed, secret) => {
    try {
        const isValid = await argon2.verify(hashed, text, {
            secret: Buffer.from(secret),
        });
        return isValid;
    } catch (err) {
        console.error("Argon2 verification failed:", err);
        return false;
    }
};
