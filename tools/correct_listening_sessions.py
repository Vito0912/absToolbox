# This script can correct listening session that are to long/inaccurate.
import os
import sys
import time
import requests

# Configuration constants
ABS_HOST = ""  # AudiobookShelf Host URL
USER_ID = ""  # The users that should be processed.
API_KEY = ""


######### Code #########

def seconds_to_time_string(seconds):
    return time.strftime('%H:%M:%S', time.gmtime(seconds))


def fetch_sessions(page):
    response = requests.get(
        f"{ABS_HOST}/api/users/{USER_ID}/listening-sessions",
        params={"itemsPerPage": 10, "page": page, "token": API_KEY}
    )
    response.raise_for_status()
    return response.json()


def display_sessions(sessions):
    print("\n" * 100)  # Clear console output
    for i, session in enumerate(sessions['sessions'], start=1):
        index = sessions['page'] * 10 + i
        title = session['mediaMetadata']['title']
        listening_time = seconds_to_time_string(session['timeListening'])
        print(f"{index}. {title} - {listening_time}")


def select_session(sessions, selection):
    session_index = selection - 1 - (sessions['page'] * 10)
    try:
        session = sessions['sessions'][session_index]
        return session
    except IndexError:
        print("Invalid selection. Please try again.")
        return None


def adjust_session(session):
    title = session['mediaMetadata']['title']
    listening_time = session['timeListening']
    start_time = session['startTime']
    end_time = session['currentTime']
    session_id = session['id']

    print("\nYou have selected the following session:")
    print(f"Title: {title}")
    print(f"Listening Time: {seconds_to_time_string(listening_time)}")
    print(f"Start Time: {seconds_to_time_string(start_time)}")
    print(f"End Time: {seconds_to_time_string(end_time)}")

    suggested_time = (end_time - start_time) / 3600
    user_input = input(
        f"Please enter the new listening time for the session (in hours, e.g., 2.5). The suggested value is {suggested_time:.3f}: ")

    try:
        if user_input == "":
            new_listening_time = suggested_time * 3600
        else:
            new_listening_time = float(user_input) * 3600
        session['timeListening'] = new_listening_time
        return session
    except ValueError:
        print("Invalid input. Please enter a numeric value.")
        return None


def update_session(session):
    session_id = session['id']
    delete_response = requests.delete(
        f"{ABS_HOST}/api/sessions/{session_id}",
        params={"token": API_KEY}
    )
    if delete_response.status_code == 200:
        print(f"Session {session_id} deleted.")
        create_response = requests.post(
            f"{ABS_HOST}/api/session/local",
            params={"token": API_KEY},
            json=session
        )
        if create_response.status_code == 200:
            print(f"Session {session_id} updated.")
        else:
            print(f"Error creating session {session_id}: {create_response.status_code}")
    else:
        print(f"Error deleting session {session_id}: {delete_response.status_code}")


def main():
    page_index = 0

    while True:
        sessions = fetch_sessions(page_index)
        display_sessions(sessions)

        user_input = input('\nType "next", "exit", or the number of the session you want to edit: ')

        if user_input.lower() == 'exit':
            break
        elif user_input.lower() == 'next':
            page_index += 1
        else:
            try:
                session_number = int(user_input)
                session = select_session(sessions, session_number)
                if session:
                    adjusted_session = adjust_session(session)
                    if adjusted_session:
                        update_session(adjusted_session)
            except ValueError:
                print("Invalid input. Please try again.")


if __name__ == "__main__":
    main()
