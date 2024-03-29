const fs = require('fs');
const download = require('image-downloader');

const rawData = fs.readFileSync('cardinfo.php.json');
const data = JSON.parse(rawData).data;

function Download(card) {
  if (typeof card.card_images[0].image_url != 'undefined') {
    const name = card.name.replace(/[/\\?%*:|"<>]/g, '');

    let folder = 'cards';

    const url = card.card_images[0].image_url;
    const n = url.lastIndexOf('.');
    const extension = url.substring(n + 1);

    download
      .image({
        url: url,
        dest: `../../${folder}/${name}_${card.race}_${card.type}${
          card.level ? '_lvl' + card.level : ''
        }${card.attribute ? '_' + card.attribute : ''}.${extension}`,
      })
      .catch((err) => console.log(err));
  }
}

// start here
let index = 12700;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function start() {
  for (let key = index; key < data.length; key++) {
    const card = data[key];

    Download(card);
    await wait(500);
  }
}

start();
