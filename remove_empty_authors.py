# This scripts deletes all authors that have no books associated with them.
import requests

# Configuration constants
ABS_HOST = ""  # AudiobookShelf Host URL
LIBRARY_ID = None  # Leave None to process all libraries you have
API_KEY = ""  # API Key from user settings
DELETE_WITHOUT_CONFIRMATION = False  # Set to True to delete authors without confirmation


library_ids = []
if LIBRARY_ID is None:
    all_libraries_response = requests.get(f"{ABS_HOST}/api/libraries?token={API_KEY}")
    for library in all_libraries_response.json()['libraries']:
        library_ids.append(library['id'])
else:
    library_ids.append(LIBRARY_ID)

print(f"Processing {len(library_ids)} libraries")

for library_id in library_ids:
    print(f"Processing library {library_id}")
    authors_response = requests.get(f"{ABS_HOST}/api/libraries/{library_id}/authors?token={API_KEY}")
    authors_to_delete = []
    for author in authors_response.json()['authors']:
        author_id = author['id']
        author_name = author['name']
        author_num_books = author['numBooks']
        if author_num_books == 0:
            authors_to_delete.append((author_id, author_name, author_num_books))
    print(f"\n\nFound {len(authors_to_delete)} authors without books")
    print("The following authors will be deleted:")
    for author in authors_to_delete:
        print(f"{author[1]} ({author[2]} books) - ID: {author[0]}")
    if not DELETE_WITHOUT_CONFIRMATION:
        user_input = input("Do you want to delete these authors? (y/n): ")
        if user_input.lower() != "y":
            print("Skipping deletion")
            continue
    print("\n\n----------------------\n\n")
    for author in authors_to_delete:
        author_id = author[0]
        delete_response = requests.delete(f"{ABS_HOST}/api/authors/{author_id}?token={API_KEY}")
        if delete_response.status_code == 200:
            print(f"Deleted author {author[1]}")
        else:
            print(f"Error deleting author {author[1]}: {delete_response.status_code}")
    print("\n\n----------------------\n\n")

print("Done")