import express from 'express'
import { PaginationMediaController,PaginationFolderController } from '../controllers/pagination-controller.js';

export const PaginationRouter = express.Router();
PaginationRouter.post('/media',PaginationMediaController)
PaginationRouter.post('/folder',PaginationFolderController)