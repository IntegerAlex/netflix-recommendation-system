import * as express from 'express';
import { recommendation } from './helper';
import axios from 'axios';
// import { title } from 'process';
const app = express();


app.get('/', (req,res) => {
  
    res.sendFile(__dirname + '/index.html');
})
app.use(express.json())
// app.use(body-parcer)

app.get('/recommendation', (req, res) => {
    // const movieName = req.query.movieName as string;
    const movieName = req.body.movieName as string;
    console.log(`Movie name: ${movieName}`);

    // Import the recommendation function from helper.ts
 
    
    // Call the recommendation function
    recommendation(movieName)
        .then((jsonOutput) => {
            console.log("Recommendations:");
            console.log(jsonOutput);
            res.send(jsonOutput);
        })
        .catch((error) => {
            console.error("An error occurred:", error);
            res.send("An error occurred");
        });
})


app.listen(3000, () => {    
    console.log('Server is running on port 3000');
});



async function searchMovieId(movieName:string) {
    try {
        // Send a GET request to search for the movie by name
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(movieName)}`);
        
        // Check if any results were returned
        if (response.data.results.length > 0) {
            // Return the ID of the first result
            axios.get(`https://api.themoviedb.org/3/movie/${response.data.results[0].id}?api_key=${process.env.TMDB_API_KEY}`).
            then((response) => {    
                console.log(response.data);
            })
            return response.data.results[0].id;
        } else {
            throw new Error('Movie not found');
        }
    } catch (error:any) {
        console.error('Error searching movie:', error.message);
        throw error;
    }
}

// Usage example
searchMovieId('The Matrix')
    .then(movieId => {
        console.log('Movie ID:', movieId);
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });