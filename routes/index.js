var express = require("express");
var router = express.Router();
var fs = require("fs");
var writeFile = require("../uploader/index");
const multer = require("multer");
/* stores the uploaded image blobs temporarily in the specified folder */
const upload = multer({ dest: "public/images/" });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* POST Blob Requests */
/* searches for the form entry with image as the tag and uploads the blob to temporary folder */
router.post("/post_blob", upload.single("image"), async function (req, res) {
  const signedUrlSmall = await writeFile(req.file, 100);
  const signedUrlLarge = await writeFile(req.file, 200);
  /* unlinks temporary files created */
  fs.unlink(req.file.path, function (err) {});
  res.send({
    urls: { smallUrl: signedUrlSmall, largeUrl: signedUrlLarge },
  });
});

module.exports = router;
