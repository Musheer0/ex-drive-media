import pg from 'pg'
import dotenv from 'dotenv';
dotenv.config()
const db =new pg.Pool({
    connectionString: process.env.DB
});

export const query = (text, params)=>{
    return db.query(text,params)
};