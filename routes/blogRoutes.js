const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json([
        {
            title: "How to basic",
            author: "Swan",
            date: "12.6.21",
            body: "Just some body content"
        },
        {
            title: "How to basic",
            author: "Swan",
            date: "12.6.21",
            body: "Just some body content"
        },
        {
            title: "How to basic",
            author: "Swan",
            date: "12.6.21",
            body: "Just some body content"
        },
        {
            title: "How to basic",
            author: "Swan",
            date: "12.6.21",
            body: "Just some body content"
        },
        {
            title: "How to basic",
            author: "Swan",
            date: "12.6.21",
            body: "Just some body content"
        },
    ]);
});

module.exports = router;