import requests
from liveness_module import runLivenessCheck, LIVENESS_PASSED

API_BASE = "http://localhost:3000"


def login_with_liveness():
    result = runLivenessCheck()

    if result != LIVENESS_PASSED:
        print("Liveness failed. Stopping login.")
        return None

    print("Liveness passed. Proceeding to login...")

    username = input("Username: ")
    password = input("Password: ")

    payload = {
        "username": username,
        "password": password,
        "livenessVerified": True
    }

    response = requests.post(f"{API_BASE}/login", json=payload)
    print("Raw /login response:", response.text)

    data = response.json()

    challenge_id = data.get("challengeId")
    if challenge_id:
        print("Received challengeId:", challenge_id)
        return challenge_id
    else:
        print("No challengeId in response.")
        return None


def complete_mfa(challenge_id):
    payload = {
        "challengeId": challenge_id,
        "code": "123456"
    }

    response = requests.post(f"{API_BASE}/mfa/verify", json=payload)
    print("Raw /mfa/verify response:", response.text)

    data = response.json()

    session_token = data.get("sessionToken")
    if session_token:
        print("Authenticated. Session token:", session_token)
        return session_token
    else:
        print("MFA failed or no session token.")
        return None


if __name__ == "__main__":
    challenge = login_with_liveness()
    if challenge:
        complete_mfa(challenge)
