const upload = require("../middleware/multer");
const express = require("express");
const router = express.Router();
const { imageUpload, getImage, userImage } = require('../controllers/images')
const auth = require("../middleware/authenticate")

router.route('/images').post(auth, upload, imageUpload).get(auth, getImage);
router.route("/users/:id").get(userImage)
module.exports = router;
