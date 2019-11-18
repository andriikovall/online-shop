const express = require('express');
const router = express.Router();
const Puzzle = require('../../models/puzzle');

const {checkAdmin, checkAuth, checkManager} = require('../../config/passport');

router.post('',  async (req, res, next) => {
    try {
        const limit = req.body.limit;
        const offset = req.body.offset;
        if (limit === undefined) {
            limit = 10;
        } if (offset === undefined) {
            offset = 0;
        }
        const response = await Puzzle.getFilteredSearch(req.body);
        res.json(response);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/all', async (req, res, next) => {
    try {
        const puzzles = await Puzzle.getAll();
        res.json(puzzles);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id([\\da-z]+)', checkAuth, checkManager, checkPuzzle, async (req, res, next) => {
    try {
        const puzzleId = req.params.id;
        const result = await Puzzle.deleteById(puzzleId);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/new/mp',  checkAuth, checkManager ,async (req, res, next) => {
    const puzzle = await Puzzle.getPuzzleFromFormRequest(req);
    if (puzzle == null) {
        next({
            status: 400, 
            message: 'Missing puzzle name, manydacturerId or typeId'
        })
        return;
    }

    try {
        const insertedPuzzle = await Puzzle.insert(puzzle);
        res.status(201).send({
            puzzle: insertedPuzzle
        });
    } catch (err) {
        next(err);
    }

});

router.patch('/:id([\\da-z]{1,24})', checkAuth, checkManager, checkPuzzle, async (req, res, next) => {
    const puzzle = await Puzzle.getPuzzleFromFormRequest(req);
    const puzzleId = req.params.id;
    puzzle._id = puzzleId;
    try {
        await Puzzle.update(puzzle);
    } catch (err) {
        next(err);
    }
});

router.get('/filters', async (req, res, next) => {
    try {
        const filters = await Puzzle.getFilters();
        res.json(filters);
    } catch (err) {
        next(err);
    }
});

router.get('/:id([\\da-z]{1,24})', checkPuzzle, async (req, res, next) => {
    res.json(req.puzzle);
});


async function checkPuzzle(req, res, next) {
    const puzzleId = req.params.id;
    const err = {
        status: 404,
        message: `Puzzle with id ${puzzleId} not found`
    };
    if (puzzleId.length != 24) {
        next(err);
        return;
    }
    const foundPuzzle = await Puzzle.getById(puzzleId);
    if (!foundPuzzle) {
        next(err);
        return;
    }
    req.puzzle = foundPuzzle
    next();
}

module.exports = router;