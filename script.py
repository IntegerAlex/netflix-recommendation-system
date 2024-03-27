# Description: This file contains the code to get movie recommendations based on the movie name.
import argparse
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

parser = argparse.ArgumentParser(description='Get movie recommendations.')
parser.add_argument('movie_name', type=str, help='Name of the movie to get recommendations for')
args = parser.parse_args()


# Function to clean data
def clean_data(x):
    return str.lower(x.replace(" ", " "))

# Function to create a combined feature
def create_soup(x):
    return x['title'] + ' ' + x['director'] + ' ' + x['cast'] + ' ' + x['listed_in'] + ' ' + x['description']

# Function to get movie recommendations
def get_recommendations(movie_name, cosine_sim, netflix_data):
    title = clean_data(movie_name)
    if title not in indices:
        return ["No recommendations available for the provided movie name."]
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:9]  # Exclude the movie itself
    movie_indices = [i[0] for i in sim_scores]
    result = netflix_data['title'].iloc[movie_indices].tolist()
    return result

if __name__ == "__main__":


    # Load data
    netflix_overall = pd.read_csv('netflix_titles.csv').fillna('')
    netflix_data = netflix_overall[['title', 'director', 'cast', 'listed_in', 'description']]

    # Clean data and create combined feature
    for feature in netflix_data.columns:
        netflix_data = netflix_data.assign(**{feature: netflix_data[feature].apply(clean_data)})

    # Create combined feature using .apply with axis=1
    soup_df = netflix_data.apply(lambda row: create_soup(row), axis=1)

    # Create a new DataFrame with the 'soup' column
    netflix_data = netflix_data.assign(soup=soup_df)

    # Create CountVectorizer and calculate cosine similarity
    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(netflix_data['soup'])
    cosine_sim2 = cosine_similarity(count_matrix, count_matrix)

    # Reset index and create series for easy indexing
    netflix_data = netflix_data.reset_index()
    indices = pd.Series(netflix_data.index, index=netflix_data['title'])

    # Get movie recommendations and print


def predict_movie(movie_name):
    return get_recommendations(movie_name, cosine_sim2, netflix_data)



# test
print(predict_movie(args.movie_name))

