const DEFAULT_API_URL = process.env.NODE_ENV !== 'production' ? 'http://localhost:5000/api' : '';

export function resolveProductImageUrl(
  imageUrl,
  apiOrigin = process.env.REACT_APP_API_ORIGIN,
  apiUrl = process.env.REACT_APP_API_URL || DEFAULT_API_URL
) {
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return null;
  }

  if (imageUrl.startsWith('data:') || /^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  const normalizedApiUrl = apiUrl ? apiUrl.replace(/\/api\/?$/, '') : '';
  const baseOrigin = apiOrigin || normalizedApiUrl || '';

  if (baseOrigin) {
    return `${baseOrigin}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  }

  return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
}
