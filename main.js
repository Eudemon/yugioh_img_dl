const download = require('image-downloader');
const https = require('https');

async function getJson() {
  const url = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
  return new Promise((resolve, reject) => {
    https
      .get(url, resp => {
        let data = '';

        resp.on('data', chunk => {
          data += chunk;
        });

        resp.on('end', () => {
          const info = JSON.parse(data).data;
          resolve(info);
        });
      })
      .on('error', err => {
        console.log(`Error: ${err.message}`);
        reject(err);
      });
  });
}

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
let index = 13000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function start() {
  let data = ''
  await getJson().then(
    info => { data = info }
  ).catch(err => { process.exit() })

  for (let key = index; key < data.length; key++) {
    const card = data[key];

    Download(card);
    await wait(500);
  }
}

start();
