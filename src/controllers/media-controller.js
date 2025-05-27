import cloudinary from "../utils/cloudinary-config.js";
import fs from "fs/promises";
import { checkFileSupported } from "../utils/filter-allowed-files.js";
import { AddFolderToMedia, CreateMedia, DeleteMedia, getMediaInfoByUser, RemoveFolderFromMedia, TogglePrivacy } from "../models/media-model.js";
import { logger } from "../utils/logger.js";
import { auth } from "../utils/auth.js";

export const UploadFileController = async (req, res) => {
  const file = req.file;
  const filePath = `./src/uploads/${file.filename}`;
  const folder = req.query.folder
  const fileExt = file.originalname.split('.').pop();
  const mimetype = file.mimetype;
  const common_ext = ['video', 'image']
  if (!checkFileSupported(fileExt)) {
    await fs.unlink(filePath); 
    return res.status(400).json({
      message: `File with extension '${fileExt}' is not allowed`,
    });
  }

  try {
    const uploadOptions = { resource_type: common_ext.includes(mimetype.split('/')[0])? mimetype.split('/')[0]: 'raw'};

    const response = file.size <= 10 * 1024 * 1024
      ? await cloudinary.uploader.upload(filePath, uploadOptions)
      : await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_large(filePath, uploadOptions, (err, res) => {
            if (err) return reject(err);
            resolve(res);
          });
        });
  const media = await CreateMedia({
    name:file.originalname,
    type:mimetype,
    size:file.size,
    public_id:response.public_id,
    url:response.secure_url,
    display_url:response.secure_url,
    user:req.user.id,
    folder 
  });
  return res.json(media)
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
  } finally {
    try {
      await fs.unlink(filePath);
    } catch (cleanupErr) {
      console.error("Failed to delete temp file:", cleanupErr);
    }
  }
};
export const DeleteMediaController=async(req,res)=>{
  const {public_id} = req.body;
  const id = req.params.id;
  const common_type = ['image', 'video']
  if(!public_id) return res.status(400).json({
    message: 'missing public id'
  });
  try {
    const user = await auth(req,{strict:true})
    if(!user)  return res.status(401).json({
    message: 'unAuthorized'
  });
    const result = await DeleteMedia({id,public_id,user:user.id})
    if(!result) {
      return res.status(400).json({
    message: 'invalid id or file already deleted'
  });
}
    console.log(result)
    await cloudinary.uploader.destroy(public_id,{
      invalidate:true,
      resource_type: common_type.includes(result.type.split('/')[0])?  result.type.split('/')[1]:'raw'
    },(err, res)=>{
      console.log(err,res)
    });
    return res.json({
      id,
      public_id
    })
  } catch (error) {
    logger.error(error,'file delete error');
    return res.status(500).json({
      message:'Internal server error'
    })
  }
  

}
export const TogglePrivacyController = async (req, res) => {
  const { id } = req.params;          // media id from URL param
  const { isPrivate } = req.body;    // new privacy status from body
  const userId = req.user.id;        // user id from req.user (assumed present)

  if (typeof isPrivate !== 'boolean') {
    return res.status(400).json({ message: "Invalid 'isPrivate' value; must be boolean" });
  }

  if (!id) {
    return res.status(400).json({ message: "Media id is required" });
  }

  try {
    const updatedMedia = await TogglePrivacy({ Isprivate: isPrivate, user: userId, id });
    if (!updatedMedia) {
      return res.status(404).json({ message: "Media not found or you're not authorized" });
    }
    return res.json(updatedMedia);
  } catch (err) {
    console.error("TogglePrivacy error:", err);
    return res.status(500).json({ message: "Failed to toggle privacy", error: err.message });
  }
};
export const AddFolderToMediaController = async (req, res) => {
  const { id: mediaId } = req.params;   // media id from URL param
  const { folderId } = req.body;        // folder id from request body
  const userId = req.user.id;

  if (!mediaId) {
    return res.status(400).json({ message: "Media id is required" });
  }

  if (!folderId) {
    return res.status(400).json({ message: "Folder id is required" });
  }

  try {
    const updatedMedia = await AddFolderToMedia({ mediaId, userId, folderId });
    if (!updatedMedia) {
      return res.status(404).json({ message: "Media not found or you don't own it" });
    }
    return res.json(updatedMedia);
  } catch (err) {
    console.error("AddFolderToMedia error:", err);
    return res.status(500).json({ message: "Failed to update folder", error: err.message });
  }
};
export const RemoveFolderFromMediaController = async (req, res) => {
  const { id: mediaId } = req.params;
  const userId = req.user.id;

  if (!mediaId) {
    return res.status(400).json({ message: "Media id is required" });
  }

  try {
    const updatedMedia = await RemoveFolderFromMedia({ mediaId, userId });
    if (!updatedMedia) {
      return res.status(404).json({ message: "Media not found or you don't own it" });
    }
    return res.json(updatedMedia);
  } catch (err) {
    console.error("RemoveFolderFromMedia error:", err);
    return res.status(500).json({ message: "Failed to remove folder", error: err.message });
  }
};
export const GetMediaInfoByUserController = async (req, res) => {
  const mediaId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const media = await getMediaInfoByUser({ mediaId, userId });

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    return res.json(media);
  } catch (err) {
    console.error("Error fetching media (user):", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const GetMediaInfoPublicController = async (req, res) => {
  const mediaId = req.params.id;

  try {
    const media = await getMediaInfoPublic(mediaId);

    if (!media) {
      return res.status(404).json({ message: "Media not found or private" });
    }

    return res.json(media);
  } catch (err) {
    console.error("Error fetching media (public):", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const GetSingleMediaFromFolderController = async (req, res) => {
  const { folderId, id: mediaId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const media = await getSingleMediaFromFolder(folderId, mediaId);

    if (!media || media.user_id !== userId) {
      return res.status(404).json({ message: "Media not found in this folder or access denied" });
    }

    return res.json(media);
  } catch (err) {
    console.error("Error fetching media (folder):", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};