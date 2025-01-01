# This script helps you migrate to a new server when the paths have changed.
# This is currently not supported by Audiobookshelf, so this script tries its best to migrate the data.
# KEEP A BACKUP OF YOUR DATA BEFORE RUNNING THIS SCRIPT! IT WILL CREATE A BACKUP, BUT BETTER SAFE THAN SORRY!
# MAKE A BACKUP OF YOUR SERVER NOW!

import json
import os
import shutil
import sqlite3

# HOW TO USE:
# 1. Make a backup :) - no, really, DO IT! - <your_domain>/config/backups - Then copy it somewhere not where this script runs!
# 2. Download this backup (down arrow icon).
# 3. Place the backup here (/tools) and rename it to "backup.audiobookshelf" (or change the BACKUP_FILE variable).
# 4. Set the paths (see below for examples) - Make sure to use / and not \! READ THE PATHS SECTION CAREFULLY!
# 5. Run the script - Your original file will now be replaced (a backup will be created, with the extension .bak). Check the last edited time to be sure.
# 6. Once the script finishes, it will output "Migration complete." - When you see this, you can proceed with the next steps. Note: This could take time for large databases.
# 7. Create your new server, create any user, and go to the backup section from step one. Then, upload the backup file.
# 8. Now you can restore the backup, and your paths should be correct.
# 9. IMPORTANT! Log out and log back in. Otherwise, the server will crash because the current user does not "exist" anymore.

# PATHS:
# 1. THIS SCRIPT CURRENTLY ONLY WORKS FOR SERVERS THAT SHARE THE SAME LOCATION FOR ALL LIBRARIES!
# -> Example: If you have a library "books" in /media/libraries/books and another library "podcasts" in
# /media/libraries/podcasts, the script will work as both share the path /media/libraries/.
# -> If you have a library "books" in /media/libraries/books and another library "podcasts" in /media/podcasts, the
# script will not work, as the paths are different.

# THE PATHS MUST BE INPUT VERY PRECISELY! ENSURE YOU KNOW YOUR CURRENT PATHS!
# For Docker, the default metadata path is /metadata.
# For libraries, if you have them in e.g. /books and /podcasts, you can use / as the path.
# OLD is the current path on your server, and NEW is the path where it will be on your new server.

# The metadata path is set as an ENV, so you cannot freely set the new one here. It MUST match the current one set as ENV.
# Please inform yourself about the metadata path in the documentation of the version/os you are using.
# Ensure you understand the paths and how they are set up on your new server.

# As long as you have a backup, you should (in theory) be able to recover the old data.
# But because you never should touch the current server (despite making and downloading a backup)
# There should be no data loss.



# ##### Configuration ####

BACKUP_FILE = "backup.audiobookshelf"

OLD_METADATA_DIR = r"/metadata"  # Default for docker
METADATA_DIR = r"C:\Users\finn\Downloads\metadata"

OLD_LIBRARIES_DIR = r"/"  # Default for docker example
LIBRARIES_DIR = r"C:\Users\finn\Downloads\libraries"

# ###### Code ####

# Create backup
print("Creating a backup of the original backup file...")
shutil.copy(BACKUP_FILE, f"{BACKUP_FILE}.bak")

# Unzip the backup
print("Unzipping the backup...")
shutil.unpack_archive(BACKUP_FILE, "backup", "zip")

# Check if the database exists
db_path = os.path.join("backup", "absdatabase.sqlite")
if not os.path.exists(db_path):
    print("Error: No database found in backup")
    exit()

# Connect to the database
try:
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    print("Connected to the database")
except Exception as e:
    print("Error connecting to database:", e)
    exit()


# Clean and normalize variables
def clean_path(path):
    tmp_path = os.path.normpath(path).replace("\\", "/")
    if not tmp_path.endswith("/"):
        tmp_path += "/"
    return tmp_path


METADATA_DIR = clean_path(METADATA_DIR)
LIBRARIES_DIR = clean_path(LIBRARIES_DIR)
OLD_METADATA_DIR = clean_path(OLD_METADATA_DIR)
OLD_LIBRARIES_DIR = clean_path(OLD_LIBRARIES_DIR)


# Function to replace paths in the database
def replace_path_in_db(table, column, old_path, new_path):
    print(f"Replacing paths in {table}.{column} from {old_path} to {new_path}...")
    if table == "playbackSessions":
        print("This may take a long time with many users and/or started sessions.")

    # Select only the rows that contain the old_path to minimize data fetched
    select_sql = f"SELECT id, {column} FROM {table} WHERE {column} LIKE ?"
    cur.execute(select_sql, (f'%{old_path}%',))
    rows = cur.fetchall()

    # Prepare updates
    updates = []
    for row_id, row_column in rows:
        if row_column is not None:
            # Replace only the first occurrence
            new_column = row_column.replace(old_path, new_path, 1)
            if new_column != row_column:
                updates.append((new_column, row_id))

    # Execute updates in a single batch
    update_sql = f"UPDATE {table} SET {column} = ? WHERE id = ?"
    cur.executemany(update_sql, updates)
    conn.commit()


# Replace paths in relevant tables and columns
replace_path_in_db('authors', 'imagePath', OLD_METADATA_DIR, METADATA_DIR)
replace_path_in_db('books', 'coverPath', OLD_METADATA_DIR, METADATA_DIR)
replace_path_in_db('feeds', 'coverPath', OLD_METADATA_DIR, METADATA_DIR)
replace_path_in_db('playbackSessions', 'coverPath', OLD_METADATA_DIR, METADATA_DIR)
replace_path_in_db('podcasts', 'coverPath', OLD_METADATA_DIR, METADATA_DIR)

replace_path_in_db('feedEpisodes', 'filePath', OLD_LIBRARIES_DIR, LIBRARIES_DIR)
replace_path_in_db('libraryFolders', 'path', OLD_LIBRARIES_DIR, LIBRARIES_DIR)
replace_path_in_db('libraryItems', 'path', OLD_LIBRARIES_DIR, LIBRARIES_DIR)

print("Correcting files in db. This can take a while...")

# Correct book files
sql = "SELECT id, audioFiles, ebookFile FROM books"
cur.execute(sql)
book_rows = cur.fetchall()

update_params = []

for book_id, audio_files, ebook_file in book_rows:
    new_audio_files = None
    new_ebook_file = None

    if audio_files is not None:
        audio_files = json.loads(audio_files)
        for audio_file in audio_files:
            audio_file['metadata']['path'] = audio_file['metadata']['path'].replace(OLD_LIBRARIES_DIR, LIBRARIES_DIR, 1)
        new_audio_files = json.dumps(audio_files)

    if ebook_file is not None:
        ebook_file = json.loads(ebook_file)
        ebook_file['metadata']['path'] = ebook_file['metadata']['path'].replace(OLD_LIBRARIES_DIR, LIBRARIES_DIR, 1)
        new_ebook_file = json.dumps(ebook_file)

    update_params.append((new_audio_files, new_ebook_file, book_id))

sql_update = "UPDATE books SET audioFiles = ?, ebookFile = ? WHERE id = ?"
cur.executemany(sql_update, update_params)
conn.commit()


# Correct libraryItems
sql = "SELECT id, libraryFiles FROM libraryItems"
cur.execute(sql)
lib_rows = cur.fetchall()

update_params = []

for item_id, library_files in lib_rows:
    new_library_files = None

    if library_files is not None:
        library_files = json.loads(library_files)
        for library_file in library_files:
            library_file['metadata']['path'] = library_file['metadata']['path'].replace(OLD_LIBRARIES_DIR, LIBRARIES_DIR, 1)
        new_library_files = json.dumps(library_files)

    update_params.append((new_library_files, item_id))

sql_update = "UPDATE libraryItems SET libraryFiles = ? WHERE id = ?"
cur.executemany(sql_update, update_params)
conn.commit()


# Correct podcast files
sql = "SELECT id, audioFile FROM podcastEpisodes"
cur.execute(sql)
podcast_rows = cur.fetchall()

update_params = []

for episode_id, audio_file in podcast_rows:
    new_audio_file = None

    if audio_file is not None:
        audio_file = json.loads(audio_file)
        audio_file['metadata']['path'] = audio_file['metadata']['path'].replace(OLD_LIBRARIES_DIR, LIBRARIES_DIR, 1)
        new_audio_file = json.dumps(audio_file)

    update_params.append((new_audio_file, episode_id))

sql_update = "UPDATE podcastEpisodes SET audioFile = ? WHERE id = ?"
cur.executemany(sql_update, update_params)
conn.commit()


# Correct server settings
sql = "SELECT \"key\", \"value\" FROM settings"
cur.execute(sql)
settings_rows = cur.fetchall()
for key, value in settings_rows:
    if key == "server-settings":
        json_content = json.loads(value)
        json_content['backupPath'] = json_content['backupPath'].replace(OLD_METADATA_DIR, METADATA_DIR, 1)
        new_value = json.dumps(json_content)
        print(f"Updating server settings: {key}")
        sql = "UPDATE settings SET value = ? WHERE key = ?"
        cur.execute(sql, (new_value, key))
        conn.commit()

# Close the database connection
conn.close()

# Repack the backup
print("Repacking the backup...")
shutil.make_archive("backup", 'zip', "backup")

# Rename the newly packed archive to the original backup file name
os.replace("backup.zip", BACKUP_FILE)

# Clean up the extracted backup folder
shutil.rmtree("backup")

print("Migration complete.")
