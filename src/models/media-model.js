import { query } from "../db/db.js"
export const CreateMedia = async (data) => {
  const insert_query = data.folder
    ? `
    INSERT INTO media 
    (name, original_url, public_id, display_url, type, size, user_id, folder_id, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    RETURNING name, size, user_id, type, public_id, id, is_private, folder_id
  `
    : `
    INSERT INTO media 
    (name, original_url, public_id, display_url, type, size, user_id, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    RETURNING name, size, user_id, type, public_id, id, is_private, folder_id
  `;

  const result = data.folder
    ? await query(insert_query, [
        data.name,
        data.url,
        data.public_id,
        data.display_url,
        data.type,
        data.size,
        data.user,
        data.folder,
      ])
    : await query(insert_query, [
        data.name,
        data.url,
        data.public_id,
        data.display_url,
        data.type,
        data.size,
        data.user,
      ]);
  return result.rows[0];
};

export const TogglePrivacy = async (data) => {
  const { Isprivate, user, id } = data;
  const update_query = `
    UPDATE media 
    SET is_private = $3, updated_at = NOW()
    WHERE id = $1 AND user_id = $2 
    RETURNING name, size, user_id, type, public_id, id, is_private, folder_id
  `;
  const result = await query(update_query, [id, user, Isprivate]);
  return result.rows[0];
};

export const AddFolderToMedia = async ({ mediaId, userId, folderId }) => {
  const updateQuery = `
    UPDATE media
    SET folder_id = $3, updated_at = NOW()
    WHERE id = $1 AND user_id = $2
    RETURNING id, name, folder_id, user_id, type, public_id, is_private, size;
  `;
  const result = await query(updateQuery, [mediaId, userId, folderId]);
  return result.rows[0];
};

export const RemoveFolderFromMedia = async ({ mediaId, userId }) => {
  const updateQuery = `
    UPDATE media
    SET folder_id = NULL, updated_at = NOW()
    WHERE id = $1 AND user_id = $2
    RETURNING id, name, folder_id, user_id, type, public_id, is_private, size;
  `;
  const result = await query(updateQuery, [mediaId, userId]);
  return result.rows[0];
};

export const DeleteMedia = async(data)=>{
        const delete_query = `
    DELETE FROM   media WHERE id=$1 AND user_id=$2 AND public_id=$3
    RETURNING type
    `
    const result = await query(delete_query,[data.id, data.user,data.public_id]);
    return result.rows[0]
}
export const getMediaInfoByUser = async ({ mediaId, userId }) => {
  const queryText = `
    SELECT id, name, folder_id, user_id, type, public_id, is_private, size
    FROM media
    WHERE id = $1 AND user_id = $2
    LIMIT 1;
  `;
  const result = await query(queryText, [mediaId, userId]);
  return result.rows[0] || null;
};
export const getMediaInfoPublic = async (mediaId) => {
  const queryText = `
    SELECT id, name, folder_id, user_id, type, public_id, is_private, size
    FROM media
    WHERE id = $1 AND is_private = false
    LIMIT 1;
  `;
  const result = await query(queryText, [mediaId]);
  return result.rows[0] || null;
};

export const getSingleMediaFromFolder = async (folderId, mediaId) => {
  const queryText = `
    SELECT id, name, folder_id, user_id, type, public_id, is_private, size
    FROM media
    WHERE folder_id = $1 AND id = $2
    LIMIT 1
  `;
  const result = await query(queryText, [folderId, mediaId]);
  return result.rows[0] || null;
};
export const GetFirstMediaPage = async(user_id)=>{

    const search_query =  `
    SELECT id, name, folder_id, user_id, type, public_id, is_private, size ,created_at, updated_at
    FROM media
     WHERE 
     user_id=$1 
      ORDER BY   
      updated_at DESC,id LIMIT 10+1
    `
    const result =await query(search_query,[user_id]);
    return result.rows
};
export const GetMediaNextPage = async(user_id, {id,updated_at})=>{
    const search_query =  `
    SELECT id, name, folder_id, user_id, type, public_id, is_private, size ,created_at, updated_at
    FROM media 
    WHERE user_id=$1 
     AND id<=$2 AND updated_at<=$3
     ORDER BY updated_at DESC,id 
     LIMIT 10+1
    `
    const result =await query(search_query,[user_id,id, updated_at]);
    console.log(result, id ,updated_at)
    return result.rows
}
export const GetFirstFolderMediaPage = async(user_id,folder)=>{

    const search_query =  `
    SELECT id, name, folder_id, user_id, type, public_id, is_private, size,created_at, updated_at
     FROM media
      WHERE user_id=$1
       AND 
        folder_id=$2 
         ORDER BY   
         updated_at DESC,id LIMIT 10+1
    `
    const result =await query(search_query,[user_id,folder]);
    return result.rows
};
export const GetFolderMediaNextPage = async(user_id, {id,updated_at},folder)=>{
    const search_query =  `
    SELECT id, name, folder_id, user_id, type, public_id, is_private,created_at, updated_at size FROM media 
    WHERE user_id=$1 AND folder_id=$4
     AND id<=$2 AND updated_at<=$3
     ORDER BY updated_at DESC,id 
     LIMIT 10+1
    `
    const result =await query(search_query,[user_id,id, updated_at,folder]);
    console.log(result, id ,updated_at)
    return result.rows
}