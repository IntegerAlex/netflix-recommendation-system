import { exec } from 'child_process';
import { join } from 'path';
import axios ,{AxiosResponse} from 'axios';

const scriptPath = join(__dirname, 'script.py');


export async function recommendation(movieName: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        // Execute the Python script
        exec(`/venv/bin/python3 ${scriptPath} "${movieName}"`, (error, stdout: string, stderr: string) => { //
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                reject([]);
            }

            // Split the stdout into an array of movie titles
            const titles = stdout.trim().split(',')
                .map(title => title.trim().replace(/^[\[\]'"\s]+|[\[\]'"\s]+$/g, '')); // Adjusted regex

            resolve(titles);

            if (stderr) {
                console.error('Script error:');
                console.error(stderr);
                reject([]);
            }
        });
    });
}


export async function displayRecommendations(moviesArray: string[]){
    try {
        let details = new Array<MovieDetails>();
        // Get the movie details for each movie in the array
        for (let i = 0; i < moviesArray.length; i++) {
            const movieDetails = await searchMovie(moviesArray[i]);
            details.push(movieDetails);
            // console.log(`Movie details for "${moviesArray[i]}":`, movieDetails);
           
        }
        return details;
    } catch (error:any) {

        console.error('Error displaying recommendations:', error.message);
        return [];
    }
}
async function searchMovie(movieName: string): Promise<MovieDetails> {
    const omdbApiKey = process.env.OMDB_API_KEY;
    const encodedMovieName = encodeURIComponent(movieName);

    try {
        // Send a GET request to search for the movie by name
        const response: AxiosResponse = await axios.get(`https://www.omdbapi.com/?t=${encodedMovieName}&apikey=${omdbApiKey}`);
        
        // Check if the response status is OK (200)
        if (response.status === 200 && response.data.Response === 'True') {
            // Extract relevant movie details
            const movieDetails: MovieDetails = {
                poster: response.data.Poster,
                title: response.data.Title,
                year: response.data.Year,
                genre: response.data.Genre,
                rating: response.data.imdbRating,
            };
            // Return the movie details
            return movieDetails;
        } else {
            console.error(`Error searching movie "${movieName}": `);
            const movieDetails: MovieDetails = {
                poster: "",
                title: movieName,
                year: "",
                genre: "",
                rating: "",
            };
            return movieDetails;
        }
    } catch (error:any) {
        // Handle errors
        console.error(`Error searching movie "${movieName}": ${error.message}`);
        const movieDetails: MovieDetails = {
            poster: "",
            title: movieName,
            year: "",
            genre: "",
            rating: "",
        };
        return movieDetails;
    }
}
interface MovieDetails {
    poster: string;
    title: string;
    year: string;
    genre: string;
    rating: string;
}

