import multer from 'multer'
import express from 'express'
import { AddFolderToMediaController, DeleteMediaController, GetMediaInfoByUserController, GetMediaInfoPublicController, GetSingleMediaFromFolderController, RemoveFolderFromMediaController, TogglePrivacyController, UploadFileController } from '../controllers/media-controller.js';
export const MediaRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
                if(!req.user)  return cb(new Error("Un-authorised"))
        cb(null,'./src/uploads');
    },
    filename:(req,file,cb)=>{
        if(!req.user) return cb(new Error("Un-authorised"))
        const filename = `${req.user.id}-${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});
const upload = multer({
    storage: storage,
    limits:{ fileSize: (1024 * 1024 * 1024 )},
});
MediaRouter.post('/upload',upload.single('file'),UploadFileController)
MediaRouter.delete('/delete/:id',DeleteMediaController);
MediaRouter.patch('/privacy/:id',TogglePrivacyController);
MediaRouter.patch('/folder/add/:id',AddFolderToMediaController);
MediaRouter.patch('/folder/remove/:id',RemoveFolderFromMediaController);
MediaRouter.get("/media/:id", GetMediaInfoByUserController);             // for logged-in user's media
MediaRouter.get("/media/public/:id", GetMediaInfoPublicController);      // for public media access
MediaRouter.get("/media/folder/:folderId/:id", GetSingleMediaFromFolderController); // media from folder by logged-in user
