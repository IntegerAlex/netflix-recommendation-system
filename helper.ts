import { exec } from 'child_process';
import { join } from 'path';
import axios from 'axios';

const scriptPath = join(__dirname, 'script.py');

export async function recommendation(movieName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let movieResult: any[] = []; // Changed the type to an array

        // Execute the Python script
        exec(`python3 ${scriptPath} "${movieName}"`, (error, stdout: string, stderr: string) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                reject("null");
            }

            // console.log('Script output:');
            // console.log(stdout);

            // Split the stdout into an array of movie titles
            const titles = stdout.trim().split(',').map(title => title.trim());
            
            // Push an object for each movie title into movieResult array
            titles.forEach(title => {
                movieResult.push({ title });
            });

            // console.log('Movie recommendations:');
            // console.log(movieResult);

            // Create an object with movie name and recommendations
            const movieRecommendations : any= {  // Changed the type to any
                movieName: movieName,
                recommendations: movieResult
            }

            // Convert the object to JSON
            resolve(movieRecommendations);

            if (stderr) {
                console.error('Script error:');
                console.error(stderr);
                reject("null");
            }
        });
    });
}

// const movieName = "The Matrix";

// recommendation(movieName)
//     .then((jsonOutput) => {
//         console.log(typeof jsonOutput);
//         console.log("Recommendations:");
//         console.log(jsonOutput);
//     })
//     .catch((error) => {
//         console.error("An error occurred:", error);
//     });


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

export async function displayRecommendations(jsonOutput:any) {
    // Get the ID of the first movie in the recommendations
    for (let i = 0; i < jsonOutput.recommendations.length; i++) {
        const movieId = await searchMovieId(jsonOutput.recommendations[i].title);
        console.log(`Movie ID: ${movieId}`);
    }

}