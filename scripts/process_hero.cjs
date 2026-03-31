const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGE_PATH = path.join(process.cwd(), 'public/img/wess_matrix_white.jpeg');
const OUTPUT_PATH = path.join(process.cwd(), 'public/img/wess_tron_raw.txt');

async function processImage() {
  try {
    const image = sharp(IMAGE_PATH);
    const metadata = await image.metadata();

    const COLS = 160;
    const char_ratio = 0.55;
    const ROWS = Math.floor(COLS * (metadata.height / metadata.width) * char_ratio);

    const buffer = await image
      .resize(COLS, ROWS)
      .grayscale()
      .negate() // Invert for Tron background
      .modulate({ brightness: 1.05, contrast: 2.4 })
      .raw()
      .toBuffer();

    const data = [];
    for (let i = 0; i < buffer.length; i++) {
       const p = buffer[i];
       if (p < 15)    data.push(0);
       else if (p < 65)  data.push(1);
       else if (p < 120) data.push(2);
       else if (p < 175) data.push(3);
       else              data.push(4);
    }

    const raw = data.join('');
    fs.writeFileSync(OUTPUT_PATH, raw);
    console.log(JSON.stringify({
      cols: COLS,
      rows: ROWS,
      rawPath: OUTPUT_PATH,
      preview: raw.substring(0, 100)
    }));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

processImage();
