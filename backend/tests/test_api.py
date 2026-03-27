import os
import subprocess
import time
import requests
import sys

def run_test():
    # Assume we are running from the root of the repo
    backend_dir = 'backend'
    log_path = os.path.join(backend_dir, 'backend_test.log')

    with open(log_path, 'w') as log_file:
        # Start the backend server
        p = subprocess.Popen([sys.executable, 'app.py'],
                             cwd=backend_dir,
                             stdout=log_file,
                             stderr=subprocess.STDOUT)

        try:
            print("Waiting for server to start...")
            # Check for "Running on" in logs or just wait
            time.sleep(5)

            print("Sending request to backend...")
            r = requests.post('http://127.0.0.1:5001/api/inventory/query',
                             json={'query': 'How many medkits?'},
                             timeout=10)

            if r.status_code == 200:
                print("✅ Backend test passed!")
                print(f"Response: {r.json().get('ai_response')[:100]}...")
            else:
                print(f"❌ Backend test failed with status {r.status_code}")

        except Exception as e:
            print(f"❌ Error during testing: {e}")
        finally:
            print("Stopping server...")
            p.terminate()
            p.wait()

if __name__ == "__main__":
    run_test()
