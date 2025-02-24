# absToolbox

A collection of tools designed to assist with Audiobookshelf-related tasks.

> [!CAUTION]
> All scripts may have unforeseen side effects or might even crash the server completely. Therefore, before starting any script, you should make a backup via the settings—especially if this is mentioned in the script description.

> [!NOTE]  
> Currently, these are only Python scripts. However, there are plans to implement plugin support:
> [Plugin Support Pull Request](https://github.com/advplyr/audiobookshelf/pull/3745)
>
> Should this happen, I will try to integrate all scripts into ABS and create additional ones. Depending on how access to the database/UI is provided, possible developments include:
> - An issue tracker with an interface for management (if it is possible to register a settings page)
> - Ratings (if it is possible to access the database and/or create a custom table, and if the item view is customizable)
> - Shared listening states (if there is access to the database)


## Available Tools

The toolbox currently includes the following utilities:

- **`quick_match_chapters.py`**: Helps with quick chapter matching. It also fixes faulty chapters.
- **`remove_empty_authors.py`**: Removes authors with no books.
- **`cleanup_listening_sessions.py`**: Removes listening sessions with too much time. Make your statistics looks better and accurate again.
- **`migrate_backup_to_new_server.py`**: Migrate your backup to a new server that has different paths or generally change the paths of your backup. (Currently only limited support. See the comments how to use and if you can use it for your library.)
- **`update_descriptions.py`**: Replaces old descriptions with new ones that now support HTML descriptions.

## Installation & Usage

Follow these steps to set up and use absToolbox:

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/vito0912/absToolbox
   cd absToolbox/tools
   ```

2. Ensure Python is installed on your system.

3. Open the script you wish to use and configure the variables at the top of the file according to your requirements.

4. Run the script by executing the following command in your terminal:
   ```bash
   python <filename>
   ```

Replace `<filename>` with the name of the script you want to run.
