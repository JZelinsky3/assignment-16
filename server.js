const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Joi = require('joi');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());

const dataPath = path.join(__dirname, 'movies.json');
let data = [];

// Load initial data from movies.json
try {
    const rawData = fs.readFileSync(dataPath);
    data = JSON.parse(rawData);
} catch (error) {
    console.error('Error reading movies.json:', error.message);
}

const schema = Joi.object({
    title: Joi.string().required(),
    genre: Joi.string().required(),
    director: Joi.string(),
    actors: Joi.array().items(Joi.string()),
    rating: Joi.number(),
    quotes: Joi.array().items(Joi.string()),
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/movies', (req, res) => {
    res.json(data);
});

app.post('/api/comedy-movies', (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newMovie = { id: (data.length + 1).toString(), ...req.body };
    data.push(newMovie);

    // Save the updated data to movies.json
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.json(newMovie);
});

app.put('/api/comedy-movies/:id', (req, res) => {
    const { id } = req.params;

    const movieToUpdate = data.find(movie => movie.id === id);
    if (!movieToUpdate) return res.status(404).json({ message: 'Movie not found' });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Update the movie data
    movieToUpdate.title = req.body.title;
    movieToUpdate.genre = req.body.genre;
    movieToUpdate.director = req.body.director;
    movieToUpdate.actors = req.body.actors;
    movieToUpdate.rating = req.body.rating;
    movieToUpdate.quotes = req.body.quotes;

    // Save the updated data to movies.json
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.json(movieToUpdate);
});

app.delete('/api/comedy-movies/:id', (req, res) => {
    const { id } = req.params;

    // Remove the movie data by ID
    data = data.filter(movie => movie.id !== id);

    // Save the updated data to movies.json
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.json({ message: 'Deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
