import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

# API anahtarını al
api_key = os.getenv("GEMINI_API_KEY")
client = None

if api_key:
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"!!! FATAL: Error initializing Gemini Client: {e}")
        client = None
else:
    print(
        "!!! WARNING: GEMINI_API_KEY not found in .env file. AI features will be disabled."
    )


def generate_drop_description(name: str, keywords: str | None = None) -> str:
    """
    Verilen drop adı ve anahtar kelimelerle Gemini API'sini kullanarak
    bir pazarlama açıklaması üretir.
    """
    if not client:
        return "Error: AI service is not configured or failed to initialize."

    prompt = (
        "You are a creative marketing assistant. Write a short, "
        "catchy, and exciting product description for a limited edition drop. "
        "The description should be 1-2 sentences long.\n\n"
        f"**Product Name:** {name}\n"
    )

    if keywords:
        prompt += f"**Key Features/Keywords:** {keywords}\n"

    prompt += "\n**Generated Description:**"

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text.strip()
    except Exception as e:
        print("--- GEMINI API EXCEPTION ---")
        print(f"Error Type: {type(e).__name__}, Details: {e}")
        print("----------------------------")
        return "Error generating description."
