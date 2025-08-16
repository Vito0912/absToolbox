import requests
import json
import os

absHost = 'http://localhost:3333'
absToken = ''
plexHost = 'http://localhost:32400'
plexToken = '' # Not tested. I don't needed one (I assume it has something to do when connecting with a plex account/claim)
plexSectionId = 1  # Tbh no idea what this is for, for me it's one
params = {
    'X-Plex-Token': plexToken,
    'type': 10,
    'includeCollections': 1,
    'includeExternalMedia': 1,
    'includeAdvanced': 1,
    'includeMeta': 1,
}

absHeaders = {
    'Authorization': f'Bearer {absToken}',
    'Accept': 'application/json',
}

absLibraries = requests.get(f"{absHost}/api/libraries?token={absToken}", timeout=30, headers=absHeaders)
absLibraries.raise_for_status()

allLibraryIds = [library['id'] for library in absLibraries.json()['libraries']]

libraryItemsId = []

for libraryId in allLibraryIds:
    libraryItemsResponse = requests.get(f"{absHost}/api/libraries/{libraryId}/items?token={absToken}", timeout=30, headers=absHeaders)
    libraryItemsResponse.raise_for_status()
    libraryItemsId.extend([item['id'] for item in libraryItemsResponse.json()['results']])

print('Fetching items from AudiobookShelf... (this may take a while)')
itemResponse = requests.post(f"{absHost}/api/items/batch/get?token={absToken}", json={
                             'libraryItemIds': libraryItemsId}, timeout=6000, headers=absHeaders)
itemResponse.raise_for_status()
libraryItems = itemResponse.json()['libraryItems']
print(f"Found {len(libraryItemsId)} items in AudiobookShelf with IDs")


plexItemResponse = requests.get(f"{plexHost}/library/sections/{plexSectionId}/all", params=params, timeout=30, headers={
    'Accept': 'application/json'
})
plexItemResponse.raise_for_status()
plexItems = plexItemResponse.json()["MediaContainer"]["Metadata"]

print(f"Found {len(libraryItems)} items in AudiobookShelf")
print(f"Found {len(plexItems)} items in Plex")

progressUpdates = []

for plexItem in plexItems:
    plexTrack = plexItem["Media"][0]["Part"][0]
    print(json.dumps(plexItem, indent=2))
    plexDuration = plexItem.get("duration", 0)
    plexOffset = plexItem.get("viewOffset")
    if plexOffset is None:
        view_count = plexItem.get("viewCount", 0)
        plexOffset = plexDuration if view_count and view_count > 0 else 0
    plexViewedAt = plexItem.get("lastViewedAt")
    plexPercent = 100 if plexDuration > 0 and (plexOffset / plexDuration * 100) >= 99 else (
        (plexOffset / plexDuration * 100) if plexDuration > 0 else 0)

    if plexViewedAt is None:
        print(f"Skipping item {plexItem['title']} - no viewedAt timestamp")
        continue

    for libraryItem in libraryItems:
        libraryFiles = libraryItem["libraryFiles"]

        for libraryFile in libraryFiles:
            if os.path.basename(libraryFile["metadata"]["path"]) == os.path.basename(plexTrack["file"]):
                print(f"Found match: {libraryItem['media']['metadata']['title']} ({libraryItem['id']})")

                progressUpdates.append({
                    "libraryItemId": libraryItem['id'],
                    "duration": plexDuration / 1000,
                    "progress": plexPercent / 100,
                    "currentTime": plexOffset / 1000,
                    "isFinished": plexPercent >= 100,
                    "finishedAt": None if plexPercent < 100 else plexViewedAt,
                    "startedAt": plexViewedAt,
                })

                break

print(f"Found {len(progressUpdates)} items to update progress for")
updateRequest = requests.patch(f"{absHost}/api/me/progress/batch/update", json=progressUpdates, timeout=6000, headers=absHeaders)
if updateRequest.status_code != 200:
    print(f"Error updating progress: {updateRequest.status_code} - {updateRequest.text}")
print("Progress updates sent to AudiobookShelf")
print("Done")