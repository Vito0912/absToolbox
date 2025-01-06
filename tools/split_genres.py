# This script splits genres that contain ", " into multiple genres so you can more easily search for a single tag.
import base64

import requests

# Configuration constants

# PLEASE MAKE A BACKUP BEFORE RUNNING THIS SCRIPT!

ABS_HOST = ""  # AudiobookShelf Host URL
API_KEY = ""
LIBRARY_IDS = []  # Leave empty to process all libraries
SKIP_GENRES = ['Mystery, Thriller & Suspense']  # Genres to skip


###### Code ######

def get_all_genres():
    response = requests.get(
        f"{ABS_HOST}/api/genres",
        params={"token": API_KEY}
    )
    response.raise_for_status()
    return response.json()['genres']


# Returns all genres that include ", "
def get_multi_genres(genres):
    multi_genres = []
    for genre in genres:
        if ", " in genre:
            if genre not in SKIP_GENRES:
                multi_genres.append(genre)
    return multi_genres


def get_all_books_for_genre(genre: str, id):
    base64_genre = genre.encode('utf-8')
    url_encoded_genre = base64.urlsafe_b64encode(base64_genre).decode('utf-8')

    response = requests.get(
        f"{ABS_HOST}/api/libraries/{id}/items",
        params={
            "limit": 99999,
            "filter": f"genres.{url_encoded_genre}",
            "token": API_KEY
        }
    )
    response.raise_for_status()
    return response.json()['results']


def append_genre_to_book(book, genre):
    genres = genre.split(", ")
    book_genres = book['media']['metadata']['genres']

    # Join the two lists and remove duplicates
    book_genres = list(set(book_genres + genres))
    # Remove the genre from the book
    book_genres.remove(genre)

    book_id = book['id']

    patch_body = {"metadata": {"genres": book_genres}}

    response = requests.patch(
        f"{ABS_HOST}/api/items/{book_id}/media",
        params={"token": API_KEY},
        json=patch_body
    )
    response.raise_for_status()


def get_all_libraries():
    response = requests.get(
        f"{ABS_HOST}/api/libraries",
        params={"token": API_KEY}
    )
    response.raise_for_status()
    return response.json()['libraries']


if __name__ == "__main__":

    if len(LIBRARY_IDS) == 0:
        libraries = get_all_libraries()
        for library in libraries:
            LIBRARY_IDS.append(library['id'])

    print(f"Processing {len(LIBRARY_IDS)} libraries")
    print(LIBRARY_IDS)
    print("----------------------")
    multi_genres = get_multi_genres(get_all_genres())

    for genre in multi_genres:
        print(f"Processing genre {genre}", end="\n\n")
        book_titles_overall = []
        for library_id in LIBRARY_IDS:
            books = get_all_books_for_genre(genre, library_id)
            book_titles = [book['media']['metadata']['title'] for book in books]
            book_titles_overall += book_titles
            for book in books:
                try:
                    append_genre_to_book(book, genre)
                except Exception as e:
                    print(f"Error processing book {book['id']}: {e}")
        print(f"Processed {len(book_titles_overall)} books for genre {genre}: {book_titles_overall}", end="\n\n")
        print("----------------------", end="\n")
