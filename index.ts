import * as express from 'express';
import { recommendation } from './helper';
import { displayRecommendations } from './helper';
import * as path from 'path';
import {rateLimit} from 'express-rate-limit';
// import axios from 'axios';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();



// import { title } from 'process';
const app = express();

app.get('/public/:image', (req, res) => {
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

app.use(express.static( 'public'));

// Define a rate limiting middleware
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30 // limit each IP to 15 requests per windowMs
});

// Apply the rate limiter to all requests
app.use(limiter);

// Handle requests to the root URL
app.get('/', (req, res) => {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = forwardedFor ? (forwardedFor as string).split(',')[0] : req.socket.remoteAddress;
    console.log(`Request from IP: ${ip}`);

    fs.readFile('titles.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading titles.json:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const titlesData = JSON.parse(data);
        res.render('index', { titles: titlesData.titles });
    });
});
app.use(express.json())
// app.use(body-parcer)

app.get('/recommendation', (req, res) => {
    const movieName = req.query.movieName as string;
    // const movieName = req.body.movieName as string;
    console.log(`Movie name: ${movieName}`);

    // Import the recommendation function from helper.ts
 
    
    // Call the recommendation function
    recommendation(movieName)
    .then((jsonOutput) => {
        // console.log("Recommendations:");
        // console.log(jsonOutput);
        // Call displayRecommendations and return its promise
        return displayRecommendations(jsonOutput);
    })
    .then((details) => {
        // Render the recommendation.ejs template with the details
        res.render('recommendation', { details: details });
    })
    .catch((error) => {
        console.error("An error occurred:", error);
        res.send("An error occurred");
    });

})



app.listen(8080, () => {    
    console.log('Server is running on port 8080');
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
