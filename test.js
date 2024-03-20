const axios = require('axios');

async function getMovieIdByName(movieName) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: process.env.TMDB_API_KEY,
                query: movieName
            }
        });

        if (response.data.results.length > 0) {
            const movie = response.data.results[0];
            return { [movie.title]: movie.id };
        } else {
            console.log(`No movie found for "${movieName}"`);
            return { [movieName]: null };
        }
    } catch (error) {
        console.error('Error fetching movie ID:', error.message);
        throw error;
    }
}

async function getMovieIdsByNames(movieNames) {
    const movieIds = {};
    for (const movieName of movieNames) {
        const movieId = await getMovieIdByName(movieName);
        Object.assign(movieIds, movieId);
    }
    return movieIds;
}

// Usage example
const movieNames = ['The Matrix', 'Inception', 'Interstellar'];

getMovieIdsByNames(movieNames)
    .then(movieIds => {
        console.log('Movie IDs:', movieIds);
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });



