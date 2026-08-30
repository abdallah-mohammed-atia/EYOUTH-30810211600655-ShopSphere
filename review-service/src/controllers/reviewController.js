const { getMongoDb } = require('../lib/mongo');

async function listReviews(req, res, next) {
  try {
    const db = await getMongoDb();
    const reviews = await db.collection('reviews').find({ productId: req.params.productId }).toArray();
    return res.status(200).json({ items: reviews });
  } catch (err) {
    next(err);
  }
}

async function createReview(req, res, next) {
  try {
    const db = await getMongoDb();
    const document = {
      productId: req.params.productId,
      userId: req.user?.id,
      author: req.user?.name || 'Anonymous',
      rating: Number(req.body.rating || 5),
      comment: req.body.comment || '',
      createdAt: new Date(),
    };
    const result = await db.collection('reviews').insertOne(document);
    return res.status(201).json({ review: { ...document, _id: result.insertedId } });
  } catch (err) {
    next(err);
  }
}

module.exports = { listReviews, createReview };
