const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dirs = [
  'C:/Users/DELL/KCA/Kone-Code-Academy/Kone-Consult/public/assets/blog',
  'C:/Users/DELL/KCA/Kone-Code-Academy/kca-landing-page/src/assets/blog'
];

(async () => {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      console.log('Dir not found:', dir);
      continue;
    }
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.png')) {
        const input = path.join(dir, file);
        const output = path.join(dir, file.replace('.png', '.webp'));
        console.log('Converting', input);
        await sharp(input).webp({ lossless: true }).toFile(output);
        fs.unlinkSync(input);
      }
    }
  }
  console.log('All conversions done!');
})();
