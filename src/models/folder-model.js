import { query } from "../db/db.js"

export const CreateFolder = async(name, user_id) => {
    const insert_query = `
        INSERT INTO folder (name, user_id, updated_at)
        VALUES ($1, $2, NOW())
        RETURNING *
    `;
    const result = await query(insert_query, [name, user_id]);
    if (result.rowCount === 0) return null;
    return result.rows[0];
};

export const renameFolder = async (folder_id, new_name, user_id) => {
    const update_query = `
        UPDATE folder
        SET name = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING *
    `;
    const result = await query(update_query, [new_name, folder_id, user_id]);
    if (result.rowCount === 0) return null;
    return result.rows[0];
};

export const addPasswordToFolder = async (folder_id, password, user_id) => {
    const update_query = `
        UPDATE folder
        SET password = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3 AND password IS NULL
        RETURNING *
    `;
    const result = await query(update_query, [password, folder_id, user_id]);
    if (result.rowCount === 0) return null;
    return result.rows[0];
};

export const getFolderInfo = async (id) => {
    const select_query = `
        SELECT id, name, created_at, password, is_private, user_id, shared_users
        FROM folder
        WHERE id = $1
    `;
    const result = await query(select_query, [id]);
    return result.rows[0];
};

export const getFolderPassword = async (id, user_id) => {
    const result = await query(
        `SELECT password FROM folder WHERE id = $1 AND user_id = $2 AND password IS NOT NULL`,
        [id, user_id]
    );
    return result.rows[0];
};

export const updateFolderPassword = async (folder_id, new_password, user_id) => {
    const update_query = `
        UPDATE folder
        SET password = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING *
    `;
    const result = await query(update_query, [new_password, folder_id, user_id]);
    if (result.rowCount === 0) return null;
    return result.rows[0];
};

export const addSharedUser = async (folder_id, user_id, users) => {
    const update_query = `
        UPDATE folder
        SET shared_users = (
            SELECT array_agg(DISTINCT u)
            FROM unnest(shared_users || $1::uuid[]) AS u
        ),
        updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING shared_users, id, name;
    `;
    const result = await query(update_query, [users, folder_id, user_id]);
    return result.rows[0];
};

export const removeSharedUser = async (folder_id, user_id, users) => {
    const update_query = `
        UPDATE folder
        SET shared_users = (
            SELECT array_agg(u)
            FROM unnest(COALESCE(shared_users, '{}')) AS u
            WHERE u NOT IN (SELECT unnest($1::uuid[]))
        ),
        updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING shared_users, id, name;
    `;
    const result = await query(update_query, [users, folder_id, user_id]);
    return result.rows[0];
};

export const deleteFolderWithouPassword = async (folder_id, user_id) => {
    const delete_query = `
        DELETE FROM folder
        WHERE id = $1 AND user_id = $2  AND password IS NULL
        RETURNING *;
    `;
    const result = await query(delete_query, [folder_id, user_id]);
    if (result.rowCount === 0) return null; // folder not found or not owned by user
    return result.rows[0]; // deleted folder info
};
export const GetFirstFolderPage = async(user_id)=>{

    const search_query =  `
    SELECT * FROM folder WHERE user_id=$1  ORDER BY   updated_at DESC,id LIMIT 10+1
    `
    const result =await query(search_query,[user_id]);
    return result.rows.map((folder)=>{
        return {
    ...folder,
    password: !!folder.password, // true if password exists, false otherwise
  };
    })
};
export const GetNextFolderPage = async(user_id, {id,updated_at})=>{
    const search_query =  `
    SELECT * FROM folder
    WHERE user_id=$1 
     AND id<=$2 AND updated_at<=$3
     ORDER BY updated_at DESC,id 
     LIMIT 10+1
    `
    const result =await query(search_query,[user_id,id, updated_at]);
    console.log(result, id ,updated_at)
    return result.rows.map((folder)=>{
        return {
    ...folder,
    password: !!folder.password, // true if password exists, false otherwise
  };
    })
}