let put;

try {
  ({ put } = require('@vercel/blob'));
} catch (err) {
  put = null;
}

/**
 * Uploads an in-memory file (from multer's memoryStorage) to Vercel Blob and
 * returns its public URL. If Blob is unavailable in the current runtime, the
 * upload is skipped gracefully instead of crashing the API.
 */
async function uploadProductImage(file) {
  if (!file) return null;

  if (!put) {
    return null;
  }

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
