const express = require('express');
const { db, Track } = require('./database/setup');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
async function testConnection() {
    try {
        await db.authenticate();
        console.log('Connection to database established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

// Start server


app.get('/api/tracks', async (req, res) => {
    try {
        const sampleTracks = await Track.findAll();
        res.json(sampleTracks);
    } catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).json({ error: 'Failed to fetch tracks' });
    }
});
app.get('/api/tracks/:id', async (req, res) => {
    try {
        const tracks = await
    Track.findByPk(req.params.id);
    
        if (!tracks) {
            return res.status(404).json({ error: 
        'track not found' });
        }
    
        res.json(tracks);
    } catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).json({ error: 'Failed to fetch tracks' });
    }
});
app.post('/api/tracks', async (req, res) => {
    try {
        const {  songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;
        if (!songTitle||!artistName||!albumName||!genre)
        return res.status(400).json({error:"All Required fields must be provided"} );
    
        const newTrack = await Track.create({
            
            songTitle,
            artistName,
            albumName,
            genre,
            duration,
            releaseYear
        });
    
        res.status(201).json(newTrack);
    } catch (error) {
        console.error('Error creating track:', error);
        res.status(500).json({ error: 'Failed to  create tracks' })}
    
});
app.put('/api/tracks/:id', async (req, res) => { try {
        const { songTitle, artistName, albumName, genre,
    duration, releaseYear } = req.body;
    
        const [updatedRowsCount] = await Track.update(
            { songTitle, artistName, albumName, genre, 
        duration, releaseYear },
            { where: { trackId: req.params.id } }
);
    
        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 
        'track not found' });
        }
    
        const updatedTrack = await
    Track.findByPk(req.params.id);
        res.json(updatedTrack);
    } catch (error) {
        console.error('Error updating track:', error);
        res.status(500).json({ error: 'Failed to  update track' });
    }});

    app.delete('/api/tracks/:id', async (req, res) => {
    try {
        const deletedRowsCount = await
    Track.destroy({
            where: { trackId: req.params.id }
        });
    
        if (deletedRowsCount === 0) {
            return res.status(404).json({ error: 
        'track not found' });
        }
    
        res.json({ message: 'track deleted successfully' });
    } catch (error) {
        console.error('Error deleting track:', error);
        res.status(500).json({ error: 'Failed to delete track' });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});