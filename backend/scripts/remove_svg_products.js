require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sequelize, Product } = require('../src/models');

const UPLOADS_DIR = path.join(__dirname, '..', 'src', 'uploads');

async function removeSvgProducts() {
  await sequelize.sync();

  // Find products with .svg images
  const products = await Product.findAll();
  const toRemove = products.filter(p => p.imageUrl && p.imageUrl.toLowerCase().endsWith('.svg'));

  if (!toRemove.length) {
    console.log('No SVG-based products found.');
    await sequelize.close();
    return;
  }

  for (const p of toRemove) {
    // delete DB record
    await p.destroy();
    console.log('Deleted product record:', p.name || p.id);
    // delete file if exists
    try {
      const filename = path.basename(p.imageUrl);
      const filePath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted file:', filePath);
      }
    } catch (err) {
      console.warn('Failed to delete file for', p.name, err.message);
    }
  }

  await sequelize.close();
  console.log('SVG product cleanup complete.');
}

removeSvgProducts().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
