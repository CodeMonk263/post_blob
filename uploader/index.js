const fs = require("fs");
const Jimp = require("jimp");
const uploadFile = require("./s3");

async function writeFile(file, dim) {
  var image = await Jimp.read(file.path);
  var imgFormat = "";
  if (file.mimetype == "image/jpeg") {
    imgFormat = ".jpeg";
  } else imgFormat = ".png";
  image.resize(dim, dim);
  var watermark = await Jimp.read(
    `https://raw.githubusercontent.com/CodeMonk263/File-Repo/master/watermark_${dim.toString()}.png`
  );
  image.composite(watermark, 0, 0, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacityDest: 1,
    opacitySource: 1,
  });
  var fileBuffer;
  image.getBuffer(file.mimetype, async (err, buffer) => {
    if (err) return console.error(err);
    fileBuffer = buffer;
  });
  var res = await uploadFile(fileBuffer, imgFormat, dim);
  return res;
}

module.exports = writeFile;
