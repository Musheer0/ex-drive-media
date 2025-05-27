import express from 'express'
import { 
    AddPasswordFolderController, 
    AddSharedUsersController, 
    CreateFolderController, 
    GetFolderController, 
    RemoveSharedUsersController, 
    RenameFolderController, 
    UpdatePasswordController 
} from '../controllers/folder-controller.js';

export const FolderRouter = express.Router();

FolderRouter.post('/create',CreateFolderController);
FolderRouter.patch('/update/password/:id',UpdatePasswordController)
FolderRouter.patch('/update/add/shared-users/:id',AddSharedUsersController)
FolderRouter.patch('/update/remove/shared-users/:id',RemoveSharedUsersController)
FolderRouter.patch('/update/add/password/:id',AddPasswordFolderController)
FolderRouter.patch('/update/:id',RenameFolderController);
FolderRouter.post('/get/:id',GetFolderController);