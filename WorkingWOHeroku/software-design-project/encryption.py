def customEncrypt(inputText, N, D):
    if (not inputText.isprintable()) or ("!" in inputText) or (" " in inputText):
        return -1

    if N < 1:
        return -1

    if D != -1 and D != 1:
        return -1

    reversedText = inputText[::-1]
    encryptedText = ""
    if D == 1:
        # do forward encryption
        # (inputChar-34+N)%93 + 34
        for c in reversedText:
            encryptedText += chr((ord(c) - 34 + N) % 93 + 34)
    elif D == -1:
        # do backward encryption
        for c in reversedText:
            r = ord(c) - 34
            if r - N < 0:
                r = 93 - N
            else:
                r -= N
            r += 34
            encryptedText += chr(r)

    return encryptedText