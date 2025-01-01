# MAKE A BACKUP BEFORE USE! DATA IS NOT RECOVERABLE IF THERE IS A PROBLEM WITH RETURNED DATA!
# This script automatically deletes all listening sessions that are larger than a given threshold.
# Depending on the size of the database, this script might take a while to run.
import sys
import time
import requests

# Configuration constants
ABS_HOST = ""  # AudiobookShelf Host URL
USER_IDS = []  # The users that should be processed to delete. Keep empty to process all users.
API_KEY = ""
LISTENING_SESSION_THRESHOLD = 16  # Threshold in hours to delete listening sessions. Everything larger than this will be deleted.
SESSIONS_TO_FETCH = 2000000  # Number of sessions to fetch per user. The script does not use pagination as it is a one-time script. Just set to a high number to fetch all sessions.


######### Code #########

if len(USER_IDS) == 0:
    print(f"{ABS_HOST}/api/users?token={API_KEY}")

    # Use Bearer token to get user data
    user_response = requests.get(f"{ABS_HOST}/api/users?token={API_KEY}")
    print(user_response.reason)
    for user in user_response.json()['users']:
        USER_IDS.append(user['id'])

print(f"Processing {len(USER_IDS)} users")

for user_id in USER_IDS:
    sessions_response = requests.get(f"{ABS_HOST}/api/users/{user_id}/listening-sessions?itemsPerPage={2000000}&token={API_KEY}")
    sessions_to_delete = []
    session_time_not_deleted = 0
    session_time_deleted = 0
    for session in sessions_response.json()['sessions']:
        session_id = session['id']
        if session['timeListening'] is None:
            continue
        session_duration = session['timeListening'] / 3600
        if session_duration > LISTENING_SESSION_THRESHOLD:
            session_time_deleted += session_duration
            print("Session greater than threshold:", session_id, session_duration, "hours")
            sessions_to_delete.append((session_id, session_duration))
        else:
            session_time_not_deleted += session_duration
    print(f"User {user_id} has {len(sessions_to_delete)} sessions to delete with a total duration of {session_time_deleted} hours. ({session_time_not_deleted} hours not deleted)")

    for session in sessions_to_delete:
        session_id = session[0]
        delete_response = requests.delete(f"{ABS_HOST}/api/sessions/{session_id}?token={API_KEY}")
        if delete_response.status_code == 200:
            print(f"Deleted session {session_id}")
        else:
            print(f"Error deleting session {session_id}: {delete_response.status_code}")
    print("\n----------------------\n")

print("Done")