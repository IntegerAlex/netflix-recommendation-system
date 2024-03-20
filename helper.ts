import { exec } from 'child_process';
import { join } from 'path';

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
