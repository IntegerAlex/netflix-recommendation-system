import { exec } from 'child_process';
import { join } from 'path';
import axios, { AxiosResponse } from 'axios';
import { spawn } from 'child_process';
import * as path from 'path';

// Add type for __dirname
declare const __dirname: string;

// Get the Python executable path - try multiple common locations
function getPythonPath(): string {
    // Check environment variable first
    if (process.env.PYTHON_PATH) {
        return process.env.PYTHON_PATH;
    }

    // Common Python paths
    const possiblePaths = [
        'python3',           // Global Python 3
        'python',           // Global Python
        '/usr/bin/python3',  // Linux/Mac Python 3
        '/usr/bin/python',   // Linux/Mac Python
        'C:\\Python39\\python.exe',  // Windows Python (adjust version as needed)
        '/venv/bin/python3'  // Virtual environment
    ];

    // Return the first available Python path
    for (const pythonPath of possiblePaths) {
        try {
            // Try to execute Python with version flag
            const result = exec(`${pythonPath} --version`);
            if (result) {
                return pythonPath;
            }
        } catch (error) {
            continue;
        }
    }

    // Default to 'python3' if nothing else works
    return 'python3';
}

const PYTHON_PATH = getPythonPath();
const scriptPath = path.join(__dirname, 'script.py');

console.log(`Using Python path: ${PYTHON_PATH}`);

export async function recommendation(movieName: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        // Sanitize the movie name to prevent command injection
        const sanitizedMovieName = movieName.replace(/[^a-zA-Z0-9\s]/g, '');

        console.log(`Executing Python script with: ${PYTHON_PATH} ${scriptPath} "${sanitizedMovieName}"`);

        // Use spawn instead of exec for better security and output handling
        const pythonProcess = spawn(PYTHON_PATH, [scriptPath, sanitizedMovieName], {
            env: { ...process.env, PYTHONUNBUFFERED: '1' }
        });

        let outputData = '';
        let errorData = '';

        // Collect data from stdout
        pythonProcess.stdout.on('data', (data: Buffer) => {
            outputData += data.toString();
        });

        // Collect data from stderr
        pythonProcess.stderr.on('data', (data: Buffer) => {
            errorData += data.toString();
        });

        // Handle process completion
        pythonProcess.on('close', (code: number) => {
            if (code !== 0) {
                console.error(`Python script error (code ${code}):`, errorData);
                reject(new Error(`Script execution failed with code ${code}: ${errorData}`));
                return;
            }

            if (errorData) {
                console.warn('Python script warnings:', errorData);
            }

            try {
                // Parse the output and clean the movie titles
                const titles = outputData
                    .trim()
                    .split(',')
                    .map(title => title.trim().replace(/^[\[\]'"\s]+|[\[\]'"\s]+$/g, ''))
                    .filter(title => title.length > 0);

                if (titles.length === 0) {
                    reject(new Error('No recommendations found'));
                    return;
                }

                resolve(titles);
            } catch (error) {
                console.error('Error parsing Python script output:', error);
                reject(new Error('Failed to parse recommendations'));
            }
        });

        // Handle process errors
        pythonProcess.on('error', (error: Error) => {
            console.error('Failed to start Python process:', error);
            reject(new Error(`Failed to start Python process: ${error.message}`));
        });

        // Set a timeout
        const timeout = setTimeout(() => {
            pythonProcess.kill();
            reject(new Error('Python script execution timed out'));
        }, 30000); // 30 seconds timeout

        // Clear timeout when process ends
        pythonProcess.on('close', () => {
            clearTimeout(timeout);
        });
    });
}

export async function displayRecommendations(moviesArray: string[]) {
    try {
        // Create an array of promises for all API calls
        const moviePromises = moviesArray.map(movieName => searchMovie(movieName));

        // Wait for all API calls to complete in parallel
        const details = await Promise.all(moviePromises);
        
        // Filter out any failed requests (optional)
        return details.filter(detail => detail.title);
    } catch (error: any) {
        console.error('Error displaying recommendations:', error.message);
        return [];
    }
}

async function searchMovie(movieName: string): Promise<MovieDetails> {
    const omdbApiKey = process.env.OMDB_API_KEY;
    const encodedMovieName = encodeURIComponent(movieName);

    try {
        // Add timeout to prevent hanging requests
        const response: AxiosResponse = await axios.get(
            `https://www.omdbapi.com/?t=${encodedMovieName}&apikey=${omdbApiKey}`,
            { timeout: 5000 } // 5 second timeout
        );
        
        if (response.status === 200 && response.data.Response === 'True') {
            return {
                poster: response.data.Poster,
                title: response.data.Title,
                year: response.data.Year,
                genre: response.data.Genre,
                rating: response.data.imdbRating,
            };
        } else {
            console.warn(`No results found for movie "${movieName}"`);
            return createEmptyMovieDetails(movieName);
        }
    } catch (error: any) {
        console.error(`Error searching movie "${movieName}":`, error.message);
        return createEmptyMovieDetails(movieName);
    }
}

// Helper function to create empty movie details
function createEmptyMovieDetails(movieName: string): MovieDetails {
    return {
        poster: "",
        title: movieName,
        year: "",
        genre: "",
        rating: "",
    };
}

interface MovieDetails {
    poster: string;
    title: string;
    year: string;
    genre: string;
    rating: string;
}

