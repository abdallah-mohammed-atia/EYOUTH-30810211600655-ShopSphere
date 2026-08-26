const { put } = require('@vercel/blob');

/**
 * Uploads an in-memory file (from multer's memoryStorage) to Vercel Blob and
 * returns its public URL. Requires BLOB_READ_WRITE_TOKEN to be set (Vercel
 * sets this automatically once Blob storage is attached to the project).
 */
async function uploadProductImage(file) {
  if (!file) return null;

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = file.originalname.includes('.') ? file.originalname.split('.').pop() : 'jpg';
  const filename = `products/${uniqueSuffix}.${ext}`;

  const blob = await put(filename, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
  });

  return blob.url;
}

module.exports = { uploadProductImage };
