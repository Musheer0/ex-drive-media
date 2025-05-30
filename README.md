# 📁 Media-Folder API

A Node.js + Express backend for managing secure, shareable media folders. Designed to support folder-level password protection, user-level media access, file uploads (Cloudinary), and granular privacy controls.

## 🔧 Features

- 🔐 Password-protected folders
- 👥 Share folders with selected users
- 📤 Upload media with file-type validation
- 🧾 Paginate folders/media
- 📁 Add/remove media from folders
- 🌐 Public and private media access
- 🚫 Delete media, toggle privacy
- 💬 Built-in middleware for user auth and file filtering

---

## 🧱 Tech Stack

- **Backend:** Node.js, Express
- **Storage:** Cloudinary
- **Security:** Argon2 (hashed folder passwords)
- **Middleware:** `multer`, custom auth
- **Utils:** Logger, file filters

---

## 📦 Folder API

### `POST /api/folder/create`
Create a new folder.

### `PATCH /api/folder/update/:id`
Rename folder.

### `PATCH /api/folder/update/add/password/:id`
Add password to a folder.

### `PATCH /api/folder/update/password/:id`
Update existing folder password.

### `POST /api/folder/get/:id`
Get folder info. Requires password (if set) or shared access.

### `PATCH /api/folder/update/add/shared-users/:id`
Add shared users to folder (requires correct password if set).

### `PATCH /api/folder/update/remove/shared-users/:id`
Remove users from shared folder access.

---

## 🗃️ Media API

### `POST /api/media/upload?folder=<folderId>`
Upload a media file to a folder (uses `multipart/form-data`).

- Only supports allowed file types (`checkFileSupported` in `utils`)
- Files > 10MB get uploaded as large files

### `DELETE /api/media/delete/:id`
Delete media by ID.

### `PATCH /api/media/privacy/:id`
Toggle privacy status of a media item.

### `PATCH /api/media/folder/add/:id`
Add media to folder.

### `PATCH /api/media/folder/remove/:id`
Remove media from folder.

### `GET /api/media/media/:id`
Get media info (for logged-in user).

### `GET /api/media/media/public/:id`
Get public media info (no auth needed).

### `GET /api/media/media/folder/:folderId/:id`
Get media in a specific folder (user-specific).

---

## 📚 Pagination API

### `POST /api/pages/media`
Paginate media list.

### `POST /api/pages/folder`
Paginate folder list.

---

## ⚠️ Security & Access

- Folder passwords are hashed with Argon2 and salted using folder ID.
- Media can be public or private.
- Private folders enforce password + shared-user access.
- Uploads are sanitized and temp files auto-deleted.



## 📁 Project Structure

```

src/
├── controllers/        # API route logic
├── models/             # DB/model abstraction layer
├── utils/              # Hashing, Cloudinary config, logger, etc.
├── routes/             # Express routers
├── uploads/            # Temp uploads (cleared after cloud upload)

````

---

## 🚀 Quick Start

```bash
git clone <repo>
cd media-folder-api
npm install
npm run dev
````

Make sure to add your Cloudinary creds in `.env`.

---

## 🧠 Dev Note

* Written by someone who hates fluff, loves clean code, and gets shit done.
* Built for personal file organization, mini-Drive clone, or as a feature in a bigger SaaS.

---

## 📜 License

MIT – go crazy.

```

