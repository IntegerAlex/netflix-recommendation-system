import express from 'express';
import { recommendation } from './helper';
import { displayRecommendations } from './helper';
import * as path from 'path';
import { rateLimit } from 'express-rate-limit';
// import axios from 'axios';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();



// import { title } from 'process';
const app = express();

/**
 * Serve static images from public directory
 * @route GET /public/:image
 */
app.get('/public/:image', (req: Request, res: Response) => {
    const imageName = req.params.image;
    res.sendFile(path.join(__dirname, 'public', imageName));
}
);

// app.use((req, res, next) => {
//     // Check if the request is coming from the backend
//     const allowedOrigins = ['http://localhost:3000']; // Add more origins if needed
//     const origin = req.headers.origin;
//     if (allowedOrigins.includes(origin)) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     next();
// });
// app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(express.static('public'));

// Define a rate limiting middleware
// const limiter = rateLimit({
//     windowMs: 60 * 60 * 1000, // 1 hour
//     max: 30 // limit each IP to 15 requests per windowMs
// });

// // Apply the rate limiter to all requests
// app.use(limiter);

/**
 * Handle root route - displays movie search interface
 * @route GET /
 */
app.get('/', (req: Request, res: Response) => {
    // Log client IP for monitoring
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = forwardedFor ? (forwardedFor as string).split(',')[0] : req.socket.remoteAddress;
    console.log(`Request from IP: ${ip}`);

    // Read movie titles from JSON file
    fs.readFile('titles.json', 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
        if (err) {
            console.error('Error reading titles.json:', err);
            res.status(500).render('error', { 
                message: 'Failed to load movie database. Please try again later.' 
            });
            return;
        }

        try {
            const titlesData = JSON.parse(data);
            res.render('index', { titles: titlesData.titles });
        } catch (error) {
            console.error('Error parsing titles.json:', error);
            res.status(500).render('error', { 
                message: 'Invalid movie database format. Please contact support.' 
            });
        }
    });
});
app.use(express.json())
// app.use(body-parcer)

/**
 * Handle movie recommendation requests
 * @route GET /recommendation
 * @param {string} movieName - Name of the movie to get recommendations for
 */
app.get('/recommendation', (req: Request, res: Response) => {
    const movieName = req.query.movieName as string;
    
    // Validate input
    if (!movieName || movieName.trim().length === 0) {
        res.status(400).render('error', { 
            message: 'Please provide a movie name' 
        });
        return;
    }

    // Start timing the request
    console.log(`Processing recommendation request for: ${movieName}`);
    const startTime = Date.now();

    // Get and process recommendations
    recommendation(movieName)
        .then((jsonOutput) => {
            if (!Array.isArray(jsonOutput) || jsonOutput.length === 0) {
                throw new Error('No recommendations found');
            }
            return displayRecommendations(jsonOutput);
        })
        .then((details) => {
            if (!details || details.length === 0) {
                throw new Error('Failed to fetch movie details');
            }
            const endTime = Date.now();
            console.log(`Request completed in ${endTime - startTime}ms`);
            res.render('recommendation', { details });
        })
        .catch((error) => {
            const endTime = Date.now();
            console.error(`Error occurred after ${endTime - startTime}ms:`, error);
            
            // Provide user-friendly error messages
            let errorMessage = 'Failed to get recommendations. Please try again.';
            if (error.message.includes('Python')) {
                errorMessage = 'Server configuration error. Please contact support.';
            } else if (error.message.includes('No recommendations found')) {
                errorMessage = 'No recommendations found for this movie. Please try another one.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Unable to fetch movie details. Please try again later.';
            }
            
            res.status(500).render('error', { message: errorMessage });
        });
});



// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`);
});


// app.get('/test', (req, res) => {
//     res.render('recommendation', { details: [
//         {
//             title: 'The Shawshank Redemption',
//             year: '1994',
//             genre: 'Drama',
//             recommendation: '9.3'

//         }
//     ] });
// })
