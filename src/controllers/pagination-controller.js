import { GetFirstFolderPage,GetNextFolderPage } from "../models/folder-model.js";
import { GetFirstMediaPage, GetMediaNextPage ,GetFirstFolderMediaPage,GetFolderMediaNextPage} from "../models/media-model.js";
import { DecodeCursor } from "../utils/decode-cursor.js";
import { logger } from "../utils/logger.js";

export const PaginationMediaController = async(req,res)=>{
    const user =req.user;
    try {
        const cursor = req.query.cursor ? DecodeCursor(req.query.cursor): null;
        const folder = req.body?.folder;
        if(cursor?.id==='no next page') return res.status(400).json({
            data: [],
            cursor: null,
            message: 'pages ended'
        });
      const fetch_media = () =>
  folder
    ? (cursor ? GetFolderMediaNextPage(user.id, cursor, folder) : GetFirstFolderMediaPage(user.id, folder))
    : (cursor ? GetMediaNextPage(user.id, cursor) : GetFirstMediaPage(user.id));
        const medias =await fetch_media()
        const extra = {id:null, updated_at:null}
        if(medias.length>10){
            console.log(medias[10])
            extra.id = medias[10].id;
            extra.updated_at =  medias[10].updated_at
        }
        else{
                    return res.json({data:medias.slice(0,5),cursor:null})

        }
        return res.json({data:medias.slice(0,10),cursor:Buffer.from(JSON.stringify(extra)).toString('base64')})
    } catch (error) {
        logger.error(error,'pagination');
        throw new Error(error);
    }
}
export const PaginationFolderController = async(req,res)=>{
    const user =req.user;
    try {
        const cursor = req.query.cursor ? DecodeCursor(req.query.cursor): null;
   
        if(cursor?.id==='no next page') return res.status(400).json({
            data: [],
            cursor: null,
            message: 'pages ended'
        })
        const folders =cursor ? await GetNextFolderPage(user.id, cursor): await GetFirstFolderPage(user.id);
        const extra = {id:null, updated_at:null}
        if(folders.length>10){
            console.log(folders[10])
            extra.id = folders[10].id;
            extra.updated_at =  folders[10].updated_at
        }
        else{
                    return res.json({data:folders.slice(0,10),cursor:null})

        }
        return res.json({data:folders.slice(0,10),cursor:Buffer.from(JSON.stringify(extra)).toString('base64')})
    } catch (error) {
        logger.error(error,'pagination');
        throw new Error(error);
    }
}