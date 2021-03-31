const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
// const { playerSchema } = require('../schemas.js');
const Player = require('../models/player');


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

router.get("/new", (req, res) => {
    res.render("players/new");
})

router.post("/", catchAsync(async (req, res) => {

    const newPlayer = new Player(req.body);
    await newPlayer.save();
    req.flash('success', 'Successfully added a new player!');
    res.redirect(`/players/${newPlayer._id}`)
}));

router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedPlayer = await Player.findByIdAndDelete(id);
    res.redirect("/players");
}))

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const player = await Player.findById(id);
    res.render("players/view", { player });
}))

router.get("/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const player = await Player.findById(id);
    res.render("players/edit", { player });
}))
router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const player = await Player.findByIdAndUpdate(id, { ...req.body.player }, { runValidators: true, new: true });
    res.redirect(`/players/${player._id}`);
}))

module.exports = router;