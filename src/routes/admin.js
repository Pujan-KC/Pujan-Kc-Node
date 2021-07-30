const express = require("express");
const router = express.Router();
const { adminpage, users, admins } = require("../../controller/admin_conrol");

//get admin info
router.get("/", adminpage);

//get user info
router.get("/users", users);

//get admin info
router.get("/admins", admins);

module.exports = router;
