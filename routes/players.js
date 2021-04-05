const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
// const { playerSchema } = require('../schemas.js');
const Player = require('../models/player');
const { isLoggedIn, isAuthor } = require('../middleware');


const validatePlayer = (req, res, next) => {
    const { error } = playerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get("/", catchAsync(async (req, res) => {
    const player = await Player.find({});
    res.render("players/home", { player });
}))

router.post("/", isLoggedIn, catchAsync(async (req, res, next) => {

    const newPlayer = new Player(req.body);
    newPlayer.owner = req.user._id;
    await newPlayer.save();
    req.flash('success', 'Successfully added a new player!');
    res.redirect(`/players/${newPlayer._id}`)
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("players/new");
})

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const player = await Player.findById(id).populate('owner');
    res.render("players/view", { player });
}))
router.patch('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const player = await Player.findByIdAndUpdate(id, { ...req.body.player }, { new: true })

    // await player.save();
    // // player.owner = req.user._id;

    console.log(req.body.player);
    req.flash('success', 'Successfully updated player!');
    res.redirect(`/players/${player._id}`);
}))
router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Player.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted player')
    res.redirect("/players");
}))

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const player = await Player.findById(id);
    res.render("players/edit", { player });
}))


module.exports = router;