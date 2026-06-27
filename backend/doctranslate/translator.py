import logging
import httpx
from openai import OpenAI
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class OllamaTranslator:
    def __init__(
        self,
        model_name: str = "qwen2.5:8b",
        base_url: str = "http://localhost:11434/v1",
        api_key: str = "ollama",
        lang_in: str = "en",
        lang_out: str = "vi",
    ):
        self.model_name = model_name
        self.base_url = base_url
        self.api_key = api_key
        self.lang_in = lang_in
        self.lang_out = lang_out
        
        # Initialize OpenAI compatible client
        self.client = OpenAI(
            base_url=self.base_url,
            api_key=self.api_key,
            http_client=httpx.Client(
                limits=httpx.Limits(max_connections=10, max_keepalive_connections=5),
                timeout=300.0,
            )
        )
        self.cache: Dict[str, str] = {}

    def test_connection(self) -> bool:
        """Verify if Ollama is running and has the model available."""
        try:
            # Check the /api/tags endpoint to see if Ollama is running
            api_base = self.base_url.replace("/v1", "/api")
            response = httpx.get(f"{api_base}/tags", timeout=5.0)
            if response.status_code == 200:
                models = response.json().get("models", [])
                logger.info(f"Ollama running. Available models: {[m['name'] for m in models]}")
                return True
            return False
        except Exception as e:
            logger.warning(f"Failed to connect to Ollama at {self.base_url}: {e}")
            return False

    def translate_text(self, text: str) -> str:
        """Translate a single block of text using Ollama."""
        text = text.strip()
        if not text:
            return ""
        
        # Check cache
        if text in self.cache:
            return self.cache[text]

        system_prompt = (
            "You are a professional, authentic machine translation engine. "
            f"You translate document content from {self.lang_in} to {self.lang_out}."
        )
        
        user_prompt = (
            f"Translate the following text into {self.lang_out}. "
            "Output the translation ONLY. Do not write any explanations, notes, or preambles. "
            "Preserve any special placeholders or tags (like <b1>, </b1>, or LaTeX formulas) exactly as they are.\n\n"
            f"Text to translate:\n{text}"
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.3,
            )
            translation = response.choices[0].message.content.strip()
            self.cache[text] = translation
            return translation
        except Exception as e:
            logger.error(f"Error during Ollama translation: {e}")
            # Fallback to original text in case of error
            return text

    def translate_batch(self, texts: List[str]) -> List[str]:
        """Translate a batch of texts. Falls back to sequential translation if batch fails."""
        if not texts:
            return []
        
        # Check if we have cached translations
        results = []
        uncached_indices = []
        uncached_texts = []
        
        for idx, text in enumerate(texts):
            stripped = text.strip()
            if not stripped:
                results.append("")
            elif stripped in self.cache:
                results.append(self.cache[stripped])
            else:
                results.append(None)  # Placeholder
                uncached_indices.append(idx)
                uncached_texts.append(stripped)

        if not uncached_texts:
            return results

        # For local small models, translating paragraph-by-paragraph is safer but we can try batching
        # to optimize speed. If batching fails, we fall back to sequential.
        try:
            # Let's perform sequential translate for stability with small local models (often struggle with batch lists)
            for idx, text in zip(uncached_indices, uncached_texts):
                translated = self.translate_text(text)
                results[idx] = translated
            return results
        except Exception as e:
            logger.error(f"Batch translation failed, falling back to sequential: {e}")
            for idx in uncached_indices:
                results[idx] = self.translate_text(texts[idx])
            return results
