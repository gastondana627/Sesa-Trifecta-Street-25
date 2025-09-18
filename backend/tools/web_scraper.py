from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time

def scrape_nasa_data(query: str) -> str:
    """
    Uses Selenium to perform a search on NASA's technical reports server
    and returns the top 3 results as a formatted string.
    """
    print(f"--- TOOLBOX ACTIVATED: Web Scraper ---")
    print(f"Executing search for: '{query}'")

    # Configure Chrome to run in "headless" mode (no visible browser window)
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    try:
        # Automatically downloads and manages the correct chromedriver for your system
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        
        # Target the NASA Technical Reports Server (NTRS)
        driver.get(f"https://ntrs.nasa.gov/search?q={query}")
        
        # Wait a few seconds for the page's JavaScript to load the search results
        time.sleep(3) 

        # Find the result titles (this CSS selector is specific to the NTRS website)
        results = driver.find_elements(By.CSS_SELECTOR, 'h4.heading-5')
        
        if not results:
            driver.quit()
            return "Web scraper ran successfully but found no results on the NASA technical reports server for that query."

        # Format the findings into a clean, readable string
        scraped_text = "Found the following top results from NASA's public database:\n"
        for i, result in enumerate(results[:3]):
            scraped_text += f"  - {result.text}\n"

        driver.quit()
        return scraped_text.strip()

    except Exception as e:
        print(f"An error occurred in the web scraper tool: {e}")
        return f"Error: The web scraper tool failed to execute. Details: {e}"
