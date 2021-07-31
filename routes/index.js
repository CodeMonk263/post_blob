var express = require("express");
var router = express.Router();
var fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "public/images/" });

var writeFile = require("../uploader/index");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/post_blob", upload.single("image"), async function (req, res) {
  const signedUrlSmall = await writeFile(req.file, 100);
  const signedUrlLarge = await writeFile(req.file, 200);
  fs.unlink(req.file.path, function (err) {});
  res.send({
    urls: { smallUrl: signedUrlSmall, largeUrl: signedUrlLarge },
  });
});

module.exports = router;
