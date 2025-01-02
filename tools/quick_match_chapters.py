# This script automatically matches chapters for audiobooks using AudiobookShelf API.
# Handle with care! If chapters are manually added to a book, they might get overwritten.
# Chapters are considered "missing" based on a threshold setting.
# For example, if there are 123 chapters locally and 127 are found, chapters will be replaced.
# However, if 120-126 chapters are found, they won’t be replaced.

import time
import requests
from urllib import parse

# Configuration constants
CHAPTER_THRESHOLD = 3  # Threshold for determining missing chapters. Do disable overwriting existing chapters, set to 99999999 ;)
ABS_HOST = ""  # AudiobookShelf Host URL
LIBRARY_ID = ""  # Library UUID
API_KEY = ""  # API Key from user settings
PROVIDER = "audible.de"  # Metadata provider (See available providers in API documentation https://api.audiobookshelf.org/#metadata-providers)
REGION = "DE"  # Region code (e.g., US, DE)
DISABLE_RATE_PROTECTION = False  # Rate protection, disable to speed up but risk timeouts
SEARCH_FOR_ASIN = True  # Search for ASIN if not available. Disable this to use tracks as chapters if no ASIN is available.
USE_TRACKS_AS_CHAPTERS = False  # Use tracks as chapters if no asin available (Fallback)


############################################################################################################

book_info = {}

# Fetch all library items
library_url = f"{ABS_HOST}/api/libraries/{LIBRARY_ID}/items?token={API_KEY}"
print(f"Fetching library items from: {library_url}")
response = requests.get(library_url)

if response.status_code != 200:
    print("Error fetching library items:", response.status_code)
    exit()

items = response.json().get('results', [])
print(f"Found {len(items)} items in the library.")

# Process each item in the library
for item in items:
    book_id = item['id']
    metadata = item['media']['metadata']
    title = metadata.get('title', "Unknown Title")
    subtitle = metadata.get('subtitle', "")
    authors = metadata.get('authorName', "Unknown Author")
    book_info[book_id] = { 'id': book_id, 'title': title, 'status': 'ERROR', 'comment': 'Unknown Error', 'asin': 'N/A' }

    print(f"\n--- Processing Book: {title} ---")

    # Check if book has ASIN (Amazon Standard Identification Number)
    if 'asin' not in metadata or metadata['asin'] is None:
        book_info[book_id]['status'] = 'NO_ASIN'
        book_info[book_id]['asin'] = 'N/A'

        if SEARCH_FOR_ASIN:
            match_url = f"{ABS_HOST}/api/search/books?title={parse.quote(title)}&author={parse.quote(authors)}&provider={PROVIDER}&token={API_KEY}"
            new_item_response = requests.get(match_url)

            if new_item_response.status_code != 200:
                print(f"Error matching book '{title}':", new_item_response.json())
                continue

            if len(new_item_response.json()) == 0:
                print(f"Error matching book '{title}' (No results found).")
                book_info[book_id]['comment'] = 'Asin retrieval failed'
                continue

            best_match = new_item_response.json()[0]
            asin = best_match.get('asin', None)

            if asin is None:
                print(f"Error matching book '{title}' (No ASIN found).")
                book_info[book_id]['comment'] = 'Asin retrieval failed - No ASIN found'
                continue

            item['media']['metadata']['asin'] = asin
            metadata['asin'] = asin
            print(f"ASIN found: {asin}")

    # Check if asin is now available
    if 'asin' not in item['media']['metadata'] or item['media']['metadata']['asin'] is None:
        if USE_TRACKS_AS_CHAPTERS:
            # Get the tracks and use them as chapters
            book_response = requests.get(f"{ABS_HOST}/api/items/{book_id}?expanded=1&token={API_KEY}")
            book_info[book_id]['status'] = 'TRACKS'
            if book_response.status_code != 200:
                print(f"Error fetching book '{title}':", book_response.status_code)
                book_info[book_id]['comment'] = 'Tracks retrieval failed'
                continue
            if len(book_response.json()['media'].get('audioFiles', [])) > 1:
                print(f"Using tracks as chapters for '{title}'.")
                tracks = book_response.json()['media'].get('audioFiles', [])
                new_chapters = []

                current_time = 0
                length_of_book = item['media']['duration']
                for i, track in enumerate(tracks):
                    duration = track['duration']
                    new_chapters.append({
                        "id": i,
                        "start": current_time,
                        "end": current_time + duration,
                        "title": f"Chapter {i+1}",
                        "error": None
                    })
                    current_time += duration - 0.001 # Subtract a tiny amount to avoid rounding issues
                    if length_of_book < current_time:
                        break

                print(f"Chapters updated successfully for '{title}' (Using tracks!).")
                book_info[book_id]['comment'] = 'Tracks used as chapters'
                book_info[book_id]['status'] = 'FINISHED'
                continue
            else:
                print(f"Error using tracks as chapters for '{title}' (No or 1 track found).")
                book_info[book_id]['comment'] = 'Tracks retrieval failed'
        else:
            print(f"Skipping book '{title}' (No ASIN found and Tracks not used as source).")
            book_info[book_id]['comment'] = 'Asin retrieval failed'
            continue
    else:
        book_info[book_id]['asin'] = item['media']['metadata']['asin']

    # Fetch chapters using ASIN
    asin = item['media']['metadata']['asin']
    chapter_url = f"{ABS_HOST}/api/search/chapters?asin={asin}&region={REGION}&token={API_KEY}"
    chapter_response = requests.get(chapter_url)

    if chapter_response.status_code != 200 or chapter_response.json().get('error') is not None:
        book_info[book_id]['comment'] = 'Chapters retrieval failed'
        print(f"Error fetching chapters for '{title}'. Response Code:", chapter_response.status_code)
        continue

    chapters = chapter_response.json().get('chapters', [])
    if len(chapters) == 0:
        book_info[book_id]['comment'] = 'No chapters found'
        print(f"No chapters found for '{title}'.")
        continue
    print(f"Chapters found for '{title}': {len(chapters)}")

    # Compare current and found chapters
    current_chapters_num = item['media'].get('numChapters', 0)
    found_chapters_num = len(chapters)
    print(f"Current chapter count: {current_chapters_num}")

    if abs(current_chapters_num - found_chapters_num) > CHAPTER_THRESHOLD or current_chapters_num == 0:
        print(f"Chapters are missing or incorrect for '{title}'. Updating...")

        new_chapters = []
        length_of_book = item['media']['duration']  # Book length in seconds

        for i, chapter in enumerate(chapters):
            start = chapter['startOffsetMs'] / 1000
            end = min((chapter['startOffsetMs'] + chapter['lengthMs']) / 1000, length_of_book)

            if start >= length_of_book:
                break

            new_chapters.append({
                "id": i,
                "start": start,
                "end": end,
                "title": chapter['title'],
                "error": None
            })

        # Update chapters for the book
        update_url = f"{ABS_HOST}/api/items/{book_id}/chapters?token={API_KEY}"
        update_data = {"chapters": new_chapters}
        update_response = requests.post(update_url, json=update_data)

        if update_response.status_code == 200:
            print(f"Chapters updated successfully for '{title}'.")
            book_info[book_id]['status'] = 'FINISHED'
            book_info[book_id]['comment'] = 'Chapters updated'
        else:
            print(f"Error updating chapters for '{title}'. Response Code:", update_response.status_code)
            book_info[book_id]['comment'] = 'Chapters update failed'
    else:
        book_info[book_id]['status'] = 'FINISHED'
        book_info[book_id]['comment'] = 'No chapters to update'
        print(f"Chapters are fine for '{title}'.")

    # Respect rate-limiting if enabled
    if not DISABLE_RATE_PROTECTION:
        time.sleep(2)

print("\n--- Summary ---")
for book_id, info in book_info.items():
    print(f"{info['title']} ({info['status']}): {info['comment']}\nLink: {ABS_HOST}/item/{book_id}\n")
    print("-" * 50)

print("\n--- Failed Books ---")
for book_id, info in book_info.items():
    if info['status'] == 'ERROR':
        print(f"{info['title']} ({info['status']}): {info['comment']}\nLink: {ABS_HOST}/item/{book_id}\n")
        print("-" * 50)