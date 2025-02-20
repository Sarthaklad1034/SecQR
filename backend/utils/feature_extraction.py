# utils/feature_extraction.py
from urllib.parse import urlparse
import re
from tld import get_tld

def extract_features(url):
    """
    Extract features from a URL for malicious URL detection.
    Returns a dictionary of features.
    """
    features = {}
    
     # Parse URL - ensure it has a scheme
    parsed_url = urlparse(url)
    if not parsed_url.scheme:
        parsed_url = urlparse('http://' + url)
    
    # Remove 'www.' if present
    url = re.sub(r'www\.', '', url)
    
    # Length of the URL
    features['url_len'] = len(str(url))
    
    # Count special characters
    feature_chars = ['@', '?', '-', '=', '.', '#', '%', '+', '$', '!', '*', ',', '//']
    for char in feature_chars:
        features[char] = url.count(char)

    # Abnormal URL check - use parsed_url for consistency
    hostname = parsed_url.hostname
    features['abnormal_url'] = 1 if hostname and re.search(hostname, url) else 0

    # Check for HTTPS
    features['https'] = 1 if parsed_url.scheme == 'https' else 0

    # Digit count
    features['digits'] = sum(c.isnumeric() for c in url)

    # Letter count
    features['letters'] = sum(c.isalpha() for c in url)

    # Check for shortening service
    shortening_services = (
        'bit\.ly|goo\.gl|shorte\.st|go2l\.ink|x\.co|ow\.ly|t\.co|tinyurl|tr\.im|is\.gd|cli\.gs|'
        'yfrog\.com|migre\.me|ff\.im|tiny\.cc|url4\.eu|twit\.ac|su\.pr|twurl\.nl|snipurl\.com|'
        'short\.to|BudURL\.com|ping\.fm|post\.ly|Just\.as|bkite\.com|snipr\.com|fic\.kr|loopt\.us|'
        'doiop\.com|short\.ie|kl\.am|wp\.me|rubyurl\.com|om\.ly|to\.ly|bit\.do|t\.co|lnkd\.in|'
        'db\.tt|qr\.ae|adf\.ly|goo\.gl|bitly\.com|cur\.lv|tinyurl\.com|ow\.ly|bit\.ly|ity\.im|'
        'q\.gs|is\.gd|po\.st|bc\.vc|twitthis\.com|u\.to|j\.mp|buzurl\.com|cutt\.us|u\.bb|yourls\.org|'
        'x\.co|prettylinkpro\.com|scrnch\.me|filoops\.info|vzturl\.com|qr\.net|1url\.com|tweez\.me|v\.gd|'
        'tr\.im|link\.zip\.net'
    )
    features['Shortining_Service'] = 1 if re.search(shortening_services, url) else 0

    # Check for IP address
    ip_regex = (
        '(([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\/)|'  # IPv4
        '(([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\/)|'  # IPv4 with port
        '((0x[0-9a-fA-F]{1,2})\\.(0x[0-9a-fA-F]{1,2})\\.(0x[0-9a-fA-F]{1,2})\\.(0x[0-9a-fA-F]{1,2})\\/)' # IPv4 in hexadecimal
        '(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|'
        '([0-9]+(?:\.[0-9]+){3}:[0-9]+)|'
        '((?:(?:\d|[01]?\d\d|2[0-4]\d|25[0-5])\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d|\d)(?:\/\d{1,2})?)'  # IPv6
    )
    features['having_ip_address'] = 1 if re.search(ip_regex, url) else 0

    return features