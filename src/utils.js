const jimp = require('jimp');
const colorThief = require('color-thief-jimp');

const getImageColor = async (url) => {
  const image = await jimp.read(url);
  return colorThief.getColor(image);
}

module.exports = {
  getImageColor
}
