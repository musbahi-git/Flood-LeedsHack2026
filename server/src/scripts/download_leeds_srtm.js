const fs = require('fs');
const path = require('path');
const https = require('https');
const unzipper = require('unzipper');

// Leeds SRTM tile (approximate, 53N 1W)
const SRTM_URL = 'https://srtm.csi.cgiar.org/wp-content/uploads/files/srtm_5x5/TIFF/srtm_38_03.zip';
const ZIP_PATH = path.join(__dirname, '../data/srtm_38_03.zip');
const OUT_DIR = path.join(__dirname, '../data');
const TIF_NAME = 'srtm_38_03.tif';

function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  https.get(url, response => {
    response.pipe(file);
    file.on('finish', () => file.close(cb));
  });
}

function unzip(zipPath, outDir, cb) {
  fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: outDir }))
    .on('close', cb);
}

if (!fs.existsSync(path.join(OUT_DIR, TIF_NAME))) {
  console.log('Downloading SRTM tile for Leeds...');
  download(SRTM_URL, ZIP_PATH, () => {
    console.log('Unzipping...');
    unzip(ZIP_PATH, OUT_DIR, () => {
      console.log('Done.');
      fs.unlinkSync(ZIP_PATH);
    });
  });
} else {
  console.log('SRTM GeoTIFF already exists.');
}
