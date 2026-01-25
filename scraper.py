import trafilatura
from bs4 import BeautifulSoup

def fetch_web_content(url: str) -> str:
    """Fetches and cleans text from a URL."""
    try:
        print(f"🌐 Fetching content from: {url}...")
        downloaded = trafilatura.fetch_url(url)
        
        if not downloaded:
            print("❌ Error: Could not download content.")
            return ""

        # Extract Main Text
        main_text = trafilatura.extract(downloaded, include_comments=False, include_tables=True)
        
        # Extract Image Alt Text (Optional context)
        soup = BeautifulSoup(downloaded, 'html.parser')
        article_body = soup.find('article') or soup.find('main') or soup.body
        alt_texts = []
        if article_body:
            for img in article_body.find_all('img'):
                alt = img.get('alt', '').strip()
                if len(alt) > 5:
                    alt_texts.append(f"[IMAGE DESCRIPTION]: {alt}")
        
        full_content = (main_text or "") + "\n\n" + "\n".join(alt_texts)
        return full_content

    except Exception as e:
        print(f"⚠️ Scraper Error: {e}")
        return ""