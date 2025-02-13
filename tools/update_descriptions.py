# This script automatically updates the description for library items using the AudiobookShelf API.

import time
import requests
from urllib import parse

# Configuration constants
ABS_HOST = ""  # AudiobookShelf Host URL
LIBRARY_ID = ""  # Library UUID
API_KEY = ""  # API Key from user settings
PROVIDER = "audible.com"  # Metadata provider (See available providers in API documentation https://api.audiobookshelf.org/#metadata-providers)
DISABLE_RATE_PROTECTION = True  # Rate protection, disable to speed up but risk timeouts


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
for count, (item) in enumerate(items):
	book_id = item['id']
	metadata = item['media']['metadata']
	title = metadata.get('title', "Unknown Title")
	authors = metadata.get('authorName', "Unknown Author")
	book_info[book_id] = { 'id': book_id, 'title': title, 'status': 'ERROR', 'comment': 'Unknown Error' }

	print(f"\n--- Processing Book: {title} ---")

	if 'asin' not in metadata or metadata['asin'] is None:
		book_info[book_id]['status'] = 'NO_ASIN'
		match_url = f"{ABS_HOST}/api/search/books?title={parse.quote(title)}&author={parse.quote(authors)}&provider={PROVIDER}&token={API_KEY}"
	else:
		book_info[book_id]['status'] = 'ASIN_SEARCH'
		match_url = f"{ABS_HOST}/api/search/books?title={metadata['asin']}&provider={PROVIDER}&token={API_KEY}"

	new_item_response = requests.get(match_url)

	if new_item_response.status_code != 200:
		print(f"    Error matching book '{title}':", new_item_response.json())
		book_info[book_id]['comment'] = 'Error matching book'
		continue

	if len(new_item_response.json()) == 0:
		print(f"    Error matching book '{title}' (No results found).")
		book_info[book_id]['comment'] = 'No results found'
		continue

	best_match = new_item_response.json()[0]
	description = best_match.get('description', None)

	if description is None:
		print(f"    Error matching book '{title}' (No description found).")
		book_info[book_id]['comment'] = 'Description retrieval failed - No description found'
		continue

	print(f"    Description found")
	new_metadata = {}
	new_metadata['description'] = description

	# Update description for the book
	update_url = f"{ABS_HOST}/api/items/{book_id}/media?token={API_KEY}"
	update_data = {"metadata": new_metadata}
	update_response = requests.patch(update_url, json=update_data)

	if update_response.status_code == 200:
		print(f"    Description updated successfully for '{title}'.")
		book_info[book_id]['status'] = 'FINISHED'
		book_info[book_id]['comment'] = 'Description updated'
	else:
		print(f"    Error updating description for '{title}'. Response Code:", update_response.status_code)
		book_info[book_id]['comment'] = 'Description update failed'

	# Respect rate-limiting if enabled
	if not DISABLE_RATE_PROTECTION:
		time.sleep(2)


print("\n--- Summary ---")
for book_id, info in book_info.items():
	print(f"{info['title']} ({info['status']}): {info['comment']}")

print("\n--- Failed Books ---")
for book_id, info in book_info.items():
	if info['status'] != 'FINISHED':
		print(f"{info['title']} ({info['status']}): {info['comment']}")

