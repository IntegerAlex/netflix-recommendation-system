# Netflix Recommendation System

[![DeepSource](https://app.deepsource.com/gh/IntegerAlex/netflix-recommendation-system.svg/?label=resolved+issues&show_trend=true&token=Wf2-GuVUSjTodDd2sMJ2zYrm)](https://app.deepsource.com/gh/IntegerAlex/netflix-recommendation-system/)
[![CodeScene Code Health](https://codescene.io/projects/51785/status-badges/code-health)](https://codescene.io/projects/51785)
![CodeQL](https://github.com/IntegerAlex/netflix-recommendation-system/workflows/CodeQL/badge.svg)

This Netflix Recommendation System is a web application developed using Node.js and Express. It utilizes a recommendation engine written in Python to provide personalized Netflix recommendations based on user input. The system integrates with the OMDB API to fetch movie details and leverages a large dataset for accurate recommendations. [ALGORITHM](/ALORITHM.md)

## Features

- Personalized Recommendations: Users can input their preferences, and the system provides tailored movie recommendations.
- Advanced Search Functionality: The system offers a comprehensive search feature to help users find specific movies.
- Integration with OMDB API: Utilizes the OMDB API to retrieve detailed information about movies, including posters, release years, genres, and ratings.

## Technologies Used

- Node.js: The backend of the application is developed using Node.js, providing a fast and scalable environment.
- Express: Express.js is used to handle routing and middleware functions, facilitating the development of the RESTful API.
- Python: The recommendation engine is implemented in Python, allowing for efficient and accurate movie recommendations.
- EJS: EJS is used as the templating engine to dynamically generate HTML pages.
- OMDB API: Integration with the OMDB API enables access to a vast database of movie information.

### Screenshots

Here are some screenshots showcasing our application:

- ![Home page](/screenshots/index.html.png)
  Landing page

- ![Loading screen](/screenshots/loading.png)
 After Input wait for Loading

- ![Recommendations](/screenshots/recommendations.png)
  Recommedations generated after user input

## Demo

Here is a demo using the application

[![DEMO](/screenshots/yt.png)](http://www.youtube.com/watch?v=013HnsjD75w "DEMO")

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or improvements, please feel free to open an issue or submit a pull request.

Please note that this project is released with a Contributor Code of Conduct. By participating in this project, you agree to abide by its terms.

## License

This project is licensed under the [GPL V3](LICENSE).
