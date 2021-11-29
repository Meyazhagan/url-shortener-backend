const router = require("express").Router();
const URL = require("../services/urlShortener.services");

router.get("/", URL.getAll);
router.get("/:id", URL.get);
router.post("/", URL.create);
router.patch("/:id", URL.update);
router.delete("/:id", URL.remove);

module.exports = router;
