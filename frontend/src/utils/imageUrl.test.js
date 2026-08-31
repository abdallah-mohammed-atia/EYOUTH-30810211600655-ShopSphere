import { resolveProductImageUrl } from './imageUrl';

describe('resolveProductImageUrl()', () => {
  it('returns absolute URLs unchanged', () => {
    expect(resolveProductImageUrl('https://cdn.example.com/product.png')).toBe('https://cdn.example.com/product.png');
  });

  it('builds a full URL from the API origin', () => {
    expect(resolveProductImageUrl('/uploads/demo.png', 'http://localhost:5000')).toBe('http://localhost:5000/uploads/demo.png');
  });

  it('derives the base origin from REACT_APP_API_URL when origin is missing', () => {
    expect(resolveProductImageUrl('/uploads/demo.png', '', 'http://localhost:5000/api')).toBe('http://localhost:5000/uploads/demo.png');
  });

  it('defaults to the local backend origin in non-production environments', () => {
    expect(resolveProductImageUrl('/uploads/demo.png')).toBe('http://localhost:5000/uploads/demo.png');
  });
});
