import re

def clean_text(text):
    # Remove non-ascii characters
    text = text.encode("ascii", "ignore").decode()
    # Replace newlines with spaces
    text = text.replace('\n', ' ')
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    # Convert to lowercase
    text = text.lower().strip()
    return text
