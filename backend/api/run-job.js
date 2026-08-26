module.exports = async (req, res) => {
  // Example background job: ping review service health and return status
  const reviewUrl = process.env.REVIEW_SERVICE_URL;
  const fetch = require('node-fetch');

  if (!reviewUrl) {
    return res.status(400).json({ message: 'REVIEW_SERVICE_URL not configured' });
  }

  try {
    const r = await fetch(new URL('/api/health', reviewUrl).toString());
    const body = await r.json();
    return res.status(200).json({ reviewService: body });
  } catch (err) {
    return res.status(500).json({ message: 'background job failed', error: err.message });
  }
};
