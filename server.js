const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

const filePath = './repertorio.json';

// Leer canciones del JSON
const readSongs = () => {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

// Escribir canciones en el JSON
const writeSongs = (songs) => {
    fs.writeFileSync(filePath, JSON.stringify(songs, null, 2), 'utf-8');
};

// Rutas

// Servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GET /canciones
app.get('/canciones', (req, res) => {
    const songs = readSongs();
    res.json(songs);
});

// POST /canciones
app.post('/canciones', (req, res) => {
    const songs = readSongs();
    const newSong = req.body;
    songs.push(newSong);
    writeSongs(songs);
    res.status(201).json({ message: 'Canción agregada', newSong });
});

// PUT /canciones/:id
app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const updatedSong = req.body;
    let songs = readSongs();
    songs = songs.map(song => song.id === parseInt(id) ? { ...song, ...updatedSong } : song);
    writeSongs(songs);
    res.json({ message: 'Canción actualizada', updatedSong });
});

// DELETE /canciones/:id
app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params; // Cambiado para obtener el id de los params
    let songs = readSongs();
    songs = songs.filter(song => song.id !== parseInt(id));
    writeSongs(songs);
    res.json({ message: 'Canción eliminada' });
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
