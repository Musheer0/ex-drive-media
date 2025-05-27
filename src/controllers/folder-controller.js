import { addPasswordToFolder, addSharedUser, CreateFolder, getFolderInfo, getFolderPassword, removeSharedUser, renameFolder, updateFolderPassword } from "../models/folder-model.js";
import { compare_content, hash_content } from "../utils/argon-hasher.js";
import { logger } from "../utils/logger.js";
export const CreateFolderController = async(req,res)=>{
    const { name} = req.body;
    const user = req.user
   try {
     const folder = await CreateFolder(name,user.id);
    if( folder.password)  folder.password = true

     return res.json({
        data:folder
     });
   } catch (error) {
    logger.error(error, 'create-folder');
    return res.status(error.status||500).json({
        message:error.message||'Internal server error'
    });
   }



};
export const RenameFolderController = async(req,res)=>{
    const { name} = req.body;
    const id = req.params.id
    const user = req.user

   try {
     const folder = await renameFolder(id, name,user.id);
          delete folder.password

     return res.json({
        data:folder
     });
   } catch (error) {
    logger.error(error, 'create-folder');
    return res.status(error.status||500).json({
        message:error.message||'Internal server error'
    });
   }



};
export const AddPasswordFolderController = async(req,res)=>{
    const { password} = req.body;
        if(password.trim().length<6) return res.status(400).json({
        message: 'password too short'
    })

    const id = req.params.id
    const user = req.user
   try {
    const hashed_password =await hash_content(password,id);
     const folder = await addPasswordToFolder(id,hashed_password,user.id);
     delete folder.password
     return res.json({
        data:folder
     });
   } catch (error) {
    logger.error(error, 'create-folder');
    return res.status(error.status||500).json({
        message:error.message||'Internal server error'
    });
   }
};
export const GetFolderController = async(req,res)=>{
    const body = req.body;
    const id = req.params.id
    const user = req.user
   try {
    const folder = await getFolderInfo(id);
       if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

    let  isCorrectPassword = false;
    const FolderHasPassword = !!folder.password;
    if(FolderHasPassword){
      isCorrectPassword =   await compare_content(body?.password,folder.password||'no pass',id);
    }
    const CanAccessFileDirectly = folder.user_id===user.id || folder.shared_users.includes(user.id);
      if( folder.password)  folder.password = true

    if(folder.is_private){
           if(!FolderHasPassword && CanAccessFileDirectly ){
                  return res.json({
                    data:folder
                });
        }
        if(FolderHasPassword && CanAccessFileDirectly && isCorrectPassword){
               return res.json({
                    data:folder
                });
        } 
        else{
            return res.status(401).json({
                message:'wrong password'
            })
         }
     
    }
    else{
          if(FolderHasPassword  && isCorrectPassword){
               return res.json({
                    data:folder
                });
        }
         else{
            return res.status(401).json({
                message:'Unauthorized'
            })
         }
    }
   } catch (error) {
    logger.error(error, 'create-folder');
    return res.status(error.status||500).json({
        message:error.message||'Internal server error'
    });
   }
};
export const UpdatePasswordController = async(req,res)=>{
    const { password, new_password} = req.body;
    if(!new_password) return res.status(400).json({
        message: 'missing new password'
    });
    if(new_password.trim().length<6) return res.status(400).json({
        message: 'password too short'
    })
    const id = req.params.id
    const user = req.user;

    const original_password = await getFolderPassword(id, user.id);
    if(!original_password) return res.status(400).json({message: 'Folder not found'});
    const isCorrectPassword = await compare_content(password, original_password.password, id);
    if(!isCorrectPassword) return res.status(400).json({message: 'Incorrect Password'});
    const hashed_password = await hash_content(new_password, id)
    const Updated_Folder = await updateFolderPassword(id,hashed_password,user.id);
    Updated_Folder.password =true
    return res.json({
        data:Updated_Folder
    })

};
export const AddSharedUsersController = async(req,res)=>{
    const id = req.params.id
    const user = req.user;
    const {password,users} = req.body;
    const FolderHasPassword = await getFolderPassword(id, user.id);
   let isCorrectPassword = false;
   if(FolderHasPassword.password){
        isCorrectPassword = await compare_content(password, FolderHasPassword.password, id);
   }    
   const canAccessFolder = FolderHasPassword.password ? isCorrectPassword : true;
   if(canAccessFolder){
    const  updated_folder = await addSharedUser(id, user.id,users);
     return res.json({
        data:updated_folder
    });
   }
   else{
     return res.status(400).json({
        message: 'incorrect password'
    });
   }
}
export const RemoveSharedUsersController = async(req,res)=>{
    const id = req.params.id
    const user = req.user;
    const {password,users} = req.body;
    const FolderHasPassword = await getFolderPassword(id, user.id);
   let isCorrectPassword = false;
   if(FolderHasPassword.password){
        isCorrectPassword = await compare_content(password, FolderHasPassword.password, id);
   }    
   const canAccessFolder = FolderHasPassword.password ? isCorrectPassword : true;
   if(canAccessFolder){
    const  updated_folder = await removeSharedUser(id, user.id,users);
     return res.json({
        data:updated_folder
    });
   }
   else{
     return res.status(400).json({
        message: 'incorrect password'
    });
   }
}
