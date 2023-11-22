const express = require('express');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const jwtSec = "HellobachhophysicsWallah&1$2"

router.post("/CreateUser",
    body('email', 'invalid email').isEmail(),
    body('name', 'Invalid name').isLength({ min: 5 }),
    body('password', 'Invalid Password').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt);

        // checking if already existing user or not
        const ifExisting = await User.findOne({ email: req.body.email });
        if (!ifExisting) {
            try {
                await User.create({
                    name: req.body.name,
                    password: secPassword,
                    email: req.body.email,
                    location: req.body.location
                })
                res.json({ success: true });
            } catch (error) {
                console.log(error);
                res.json({ success: false });
            }
        }
        else {
            return res.status(409).json({ errors: "Already Existing User" });
        }
    })

router.post("/LoginUser",
    body('email', 'invalid email').isEmail(),
    body('password', 'Invalid Password').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email;
        try {
            let userData = await User.findOne({ email });
            if (!userData) {
                return res.status(400).json({ errors: "Wrong email" });
            }
            const passComp = await bcrypt.compare(req.body.password, userData.password)
            if (!passComp) {
                return res.status(400).json({ errors: "Wrong password" });
            }
            const data = {
                user: {
                    id: userData.id
                }
            }
            const authToken = jwt.sign(data, jwtSec);
            return res.json({ success: true, authToken: authToken });
        }
        catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })

module.exports = router;