const express = require("express");
const router = express.Router();
const {
  saveUserSLAParameter,
  recommendCloudService,
  selectCloudService,
  saveCloudSla,
} = require("../controllers/cloudSelectionController");
router.route("/userSla").post(saveUserSLAParameter);
router.route("/recommendService").post(recommendCloudService);
router.route("/selectService").post(selectCloudService);
router.route("/saveCloudSla").post(saveCloudSla);

module.exports = router;
