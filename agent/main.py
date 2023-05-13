#!/usr/bin/python3
import subprocess
import json
import requests

# Replace with your API endpoint
API_ENDPOINT = "https://rtl-433-server.azurewebsites.net/data"

# Function to send data to your API
def send_data_to_api(data):
    try:
        response = requests.post(API_ENDPOINT, json=data)
        print(f"Data sent to API: {response.status_code}")
    except Exception as error:
        print(f"Error sending data to API: {error}")


# Start the rtl_433 process
rtl_433 = subprocess.Popen(["rtl_433","-f", "315M", "-g","26", "-F", "json"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

try:
    while True:
        # Process the output from rtl_433
        line = rtl_433.stdout.readline().strip()
        if line:
            try:
                print('got line' + line)
                json_data = json.loads(line)
                print(json_data)
                send_data_to_api(json_data)
            except json.JSONDecodeError as error:
                print(f"Error parsing JSON data: {error}")

except KeyboardInterrupt:
    print("\nStopping...")

finally:
    # Clean up
    rtl_433.terminate()
    rtl_433.wait()
