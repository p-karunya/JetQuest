from appwrite.client import Client
from appwrite.services.storage import Storage
from appwrite.exception import AppwriteException
import os

def main(context):
    client = Client()
    storage = Storage(client)

    # Set up the client with your Appwrite project details
    client.set_endpoint('https://cloud.appwrite.io/v1')  # Your API Endpoint
    client.set_project('67b14725db85192a152a')  # Your project ID
    client.set_key(os.getenv("APWR_KEY"))  # Your secret API key

    try:
        # List all files in the specified bucket
        bucket_id = '67b227840031b7167827'
        files = storage.list_files(bucket_id=bucket_id)

        leaderboard_data = []

        # Loop through each file and process JSON files only
        for file in files.get('files', []):
            if file.get('mimeType') == 'application/json':
                # Download the JSON file content; file_content is already a dict
                file_content = storage.get_file_download(bucket_id, file['$id'])
                user_data = file_content

                # Transform user_data to the desired leaderboard format
                leaderboard_entry = {
                    'id': len(leaderboard_data) + 1,
                    'name': user_data.get('name'),
                    'avatar': user_data.get('avatar'),
                    'points': user_data.get('totalPoints'),
                    'badges': user_data.get('badges', []),  # Assuming badges is included
                    'activities': user_data.get('stats')
                }
                leaderboard_data.append(leaderboard_entry)

        # Sort leaderboard data by points in descending order
        leaderboard_data.sort(key=lambda x: x.get('points', 0), reverse=True)

        # Return the response as JSON using context.res.json()
        return context.res.json({'leaderboard': leaderboard_data})

    except AppwriteException as e:
        context.log("AppwriteException: " + e.message)
        return context.res.json({'error': e.message})