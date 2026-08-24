// Vercel serverless function example — functions/process-review.js
// Deploy this file under a Vercel project that serves serverless functions.

module.exports = async (req, res) => {
  try {
    // Example background task: simple summary count
    // In real use this would be triggered by a queue or cron job
    const action = req.query.action || 'run';
    if (action === 'run') {
      // simulate background work
      const result = { processedAt: new Date().toISOString(), note: 'Example background job completed' };
      return res.status(200).json(result);
    }
    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
};
