import pg,{types} from 'pg'
import dotenv from 'dotenv';
types.setTypeParser(1114, str => str);  // timestamp without timezone
types.setTypeParser(1184, str => str);  // timestamp with timezone
dotenv.config()
const db =new pg.Pool({
    connectionString: "postgresql://postgres:muchi0169@localhost:5432/ex=drive"
});

export const query = (text, params)=>{
    return db.query(text,params)
};