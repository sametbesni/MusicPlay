
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/musicapp', { useNewUrlParser: true, useUnifiedTopology: true });

const songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    url: String
});

const Song = mongoose.model('Song', songSchema);

app.use(express.json());

app.post('/songs', async (req, res) => {
    const song = new Song(req.body);
    await song.save();
    res.status(201).send(song);
});

app.get('/songs', async (req, res) => {
    const songs = await Song.find();
    res.send(songs);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});