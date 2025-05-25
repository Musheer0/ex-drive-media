import express from 'express'
import dotenv from 'dotenv'
import { logger } from './utils/logger.js';
dotenv.config();
const app = express();
app.use(express.json());


app.listen(process.env.PORT,()=>{
    logger.info('app running on port '+process.env.PORT)
})