import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
export const CreateJwtToken =(data)=>{
    const token = jwt.sign(data, process.env.SECRET,{expiresIn: '60d'});
     return token
};

export const DecodeJwtToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        return decoded;
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return null;
    }
};
