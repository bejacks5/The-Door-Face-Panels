LIVENESS_PASSED = "LIVENESS_PASSED"
FAILED = "FAILED"

def runLivenessCheck():
    print("Liveness Check: Please blink or turn your head.")
    user_input = input("Type 'blink' to continue: ")

    if user_input.lower().strip() == "blink":
        return LIVENESS_PASSED
    else:
        return FAILED

if __name__ == "__main__":
    result = runLivenessCheck()
    print("Result:", result)


