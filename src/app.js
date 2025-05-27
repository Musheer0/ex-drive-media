import express from 'express'
import dotenv from 'dotenv'
import { logger } from './utils/logger.js';
import cookieParser from 'cookie-parser';
import { FolderRouter } from './routes/folder-routes.js';
import { ErrorHandler } from './middlewares/error-handler.js';
import { AuthMiddleware } from './middlewares/auth-middleware.js';
import { MediaRouter } from './routes/media-routes.js';
import { PaginationRouter } from './routes/pagination-router.js';
import cors from 'cors'
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use((req,res,next)=>{
    logger.info(`${req.url}      --${req.method}`)
    next()
});
app.use(cors({
       origin:(or, cb)=>{
        if(or===process.env.FRONTEND)
        cb(null ,true)
        else
         cb(new Error("Invalid origin"), false)
       },
           methods: ['POST','GET', 'PUT','DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Bearer','Authorization'],
    exposedHeaders: ['X-user-Id'],
    preflightContinue: false,
    maxAge: '15'
}));
app.use(AuthMiddleware)
app.get('/',(_,res)=>{
    res.send("welcome to media service")
});
app.use('/api/pages',PaginationRouter)
app.use('/api/media',MediaRouter)
app.use('/api/folder',FolderRouter)
app.use(ErrorHandler)
app.listen(process.env.PORT,()=>{
    logger.info('app running on port '+process.env.PORT)
})