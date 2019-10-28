const express = require('express');
const router = express.Router();
const Puzzle = require('../../models/puzzle');
const cors = require('cors');



router.get('/', function (req, res) {
    res.status(500).send('Not implemented yet'); //@todo
});

router.get('/all', async (req, res) => {
    try {
        const puzzles = await Puzzle.getAll();
        res.json(puzzles);
    } catch (err) {
        res.sendStatus(500);
    }
});

router.get('/:id([\\da-z]{24})', async (req, res) => {
    const puzzle_id = req.params.id
    try {
        const puzzle = await Puzzle.getById(puzzle_id);
        if (!puzzle)
            res.sendStatus(404);
        else 
            res.json(puzzle);

    } catch (err) {
        res.sendStatus(500);
    }
});

router.delete('/:id([\\da-z]{24})', async (req, res) => {
    try {
        const puzzleId = req.params.id;
        await Puzzle.deleteById(puzzleId);
    } catch (err) {
        res.sendStatus(500);
    }
});

router.post('/new', async (req, res) => {

    const puzzle = await Puzzle.getPuzzleFromFormRequest(req);
    try {
        await Puzzle.insert(puzzle);
    } catch {
        res.sendStatus(500);
    }

});

router.patch('/:id([\\da-z]{24})', async (req, res) => {
    const puzzle = await Puzzle.getPuzzleFromFormRequest(req);

    const puzzleId = req.params.id;
    puzzle._id = puzzleId;
    
    try {
        Puzzle.update(puzzle);
    } catch {
        res.sendStatus(500);
    }
});

router.get('/filters', async (req, res) => {
    try {
        const filters = await Puzzle.getFilters();
        res.json(filters);
    } catch {
        res.sendStatus(500);
    }
});

module.exports = router;