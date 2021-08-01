const fs = require("fs");
const Jimp = require("jimp");
const uploadFile = require("./s3");

/*Manipulates images by resizing and adding watermark */
async function writeFile(file, dim) {
  var image = await Jimp.read(file.path);
  var imgFormat = "";
  /* Changes image format based on mime type */
  if (file.mimetype == "image/jpeg") {
    imgFormat = ".jpeg";
  } else imgFormat = ".png";
  image.resize(dim, dim);
  var watermark = await Jimp.read(
    `https://raw.githubusercontent.com/CodeMonk263/File-Repo/master/watermark_${dim.toString()}.png`
  );
  /* Blends in the watermark image with specified opacity on the image */
  image.composite(watermark, 0, 0, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacityDest: 1,
    opacitySource: 1,
  });
  var fileBuffer;
  /* returns the image buffer of the edited image */
  image.getBuffer(file.mimetype, async (err, buffer) => {
    if (err) return console.error(err);
    fileBuffer = buffer;
  });
  var url = await uploadFile(fileBuffer, imgFormat, dim);
  return url;
}

module.exports = writeFile;
