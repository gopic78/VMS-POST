const express = require("express");
const { register, allUsers, getOneUser, login } = require("../Controller/login");

const router = express.Router();


router.route('/register')
    .get(allUsers)
    .post(register)

router.route('/register/:id')
    .get(getOneUser)

router.route('/login')
    .post(login)

const userouter = router;
module.exports = userouter;