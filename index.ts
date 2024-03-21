import * as express from 'express';
import { recommendation } from './helper';
import { displayRecommendations } from './helper';
import * as path from 'path';
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



app.get('/', (req, res) => {
    const title = req.query.title as string;
    console.log(`Title: ${title}`);
    // Read the titles.json file
    fs.readFile('titles.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading titles.json:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Parse the JSON data
        const titlesData = JSON.parse(data);

        // Render the EJS template and pass the titles data
        res.render('index', { titles: titlesData.titles });
    });
});
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
            displayRecommendations(jsonOutput);
        })
        .catch((error) => {
            console.error("An error occurred:", error);
            res.send("An error occurred");
        });
})

// app.get('/test', (req, res) => {
//     // req.res.render('test')
//     res.render('test')
// })

app.listen(3000, () => {    
    console.log('Server is running on port 3000');
});





// Usage example
// searchMovieId('The Matrix')
//     .then(movieId => {
//         console.log('Movie ID:', movieId);
//     })
//     .catch(error => {
//         console.error('An error occurred:', error);
//     });