
# Mini RAG AI Explorer

**Mini RAG AI Explorer** is a simple yet powerful web application demonstrating the concept of Retrieval-Augmented Generation (RAG). It allows users to provide a text document, ask questions about it, and receive answers that are grounded in the document's content, complete with inline citations. This project is built with React, TypeScript, and Tailwind CSS, and it uses the Google Gemini API for its advanced retrieval, reranking, and generation capabilities.

---

## 🔗 Project Links

-   **Live URL**: `[Insert Live URL Here]`
-   **Public GitHub Repo**: `[Insert GitHub Repo URL Here]`

---

## ✨ Features

-   **Provide Your Own Context**: Paste text directly or upload a `.txt` file to serve as the knowledge base.
-   **Secure API Key Handling**: Prompts for your Gemini API key and stores it safely in your browser's session storage.
-   **AI-Powered RAG Pipeline**: Implements a multi-step process of semantic retrieval, reranking, and generation.
-   **Grounded Answers**: The AI's responses are based *only* on the information present in the document.
-   **Inline Citations**: Each part of the answer is linked back to the specific source chunk it came from, ensuring verifiability.
-   **Performance Metrics**: Displays response time and estimated token usage for each query.
-   **Responsive Design**: A clean, modern, and responsive user interface.

---

## 🚀 Architecture & Index Configuration

The application follows a sophisticated, multi-step RAG pipeline simulated entirely on the client-side using the Gemini API.

1.  **Document Ingestion & Chunking (Index Config)**:
    -   When a user provides a document, the text is split into smaller, manageable chunks.
    -   **Strategy**: The text is divided into chunks of approximately 3500 characters with a 15% overlap. This overlap helps maintain context between chunks. This process serves as the basic "indexing" for our retrieval system.

2.  **Semantic Retrieval (Simulated Vector Search)**:
    -   When a query is submitted, the application uses the Gemini API to perform **semantic retrieval**.
    -   It sends the query and the content of all chunks to the model, instructing it to act as a retrieval engine and return the IDs of the top 5 chunks most relevant to the query.
    -   This is an advanced simulation that replaces a naive keyword search with an AI-driven understanding of the content's meaning, mimicking the behavior of a true vector database search.

3.  **Reranking**:
    -   The top 5 chunks identified during the retrieval step are then passed to a second Gemini API call.
    -   This "reranker" step re-evaluates the retrieved chunks specifically in the context of the query and reorders them from most to least relevant. This ensures the best possible context is prioritized.

4.  **Generation**:
    -   The user's query and the content of the top 3 reranked chunks are formatted into a final prompt.
    -   This prompt is sent to the Gemini API (`gemini-2.5-flash` model), instructing it to generate an answer based *only* on the provided source chunks and to include citations in the format `[1]`, `[2]`, etc.

5.  **Display**:
    -   The generated answer is displayed with clickable citations that scroll to the corresponding source chunk below.

---

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai`) for Retrieval, Reranking, and Generation.

---

## ⚙️ Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   A modern web browser (like Chrome, Firefox, or Safari).
-   A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

This project is a pure client-side application and can be run without any complex setup.

1.  **Download the project files.**
2.  **Open `index.html`:** Simply open the `index.html` file in your web browser. Alternatively, you can serve the project directory using any static file server.

### Setting Up Your API Key

The application requires a Google Gemini API key to function.

-   When you first open the application, you will be prompted to enter your API key.
-   The key is stored securely in your browser's **session storage** and is only used for the current session. It is never transmitted to any server other than Google's.
-   You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
-   You can change the key at any time by clicking the settings icon in the header.

---

## 📝 Remarks

### Limitations & Trade-offs

-   **Client-Side Architecture**: The entire RAG pipeline runs in the browser. This is simple for a demo but is not scalable for large documents and introduces latency due to multiple sequential API calls.
-   **No Vector Database**: To meet the spirit of the requirements within a client-side context, this project simulates semantic retrieval and reranking using Gemini. A production system would use a dedicated, persistent vector database (like Pinecone, Weaviate, etc.) for efficient, scalable retrieval. This would involve a one-time "embedding" cost during ingestion rather than a dynamic retrieval cost on every query.
-   **No Persistence**: The uploaded document and conversation are lost on page refresh. There is no backend or database to store state.
-   **API Key Handling**: This application runs entirely in the browser. To handle the Gemini API key, it prompts the user to enter their key, which is then stored in the browser's `sessionStorage`. This means the key is only available for the duration of the browser tab session and is not hardcoded in the source code. While this is safer than exposing a hardcoded key, a production-grade application should always proxy API calls through a secure backend server to completely protect the API key.
-   **Stateless QA**: The app does not maintain conversation history. Each query is treated as a new, independent question.

### What I'd Do Next (Future Improvements)

-   **Backend & Vector DB Integration**: The highest priority would be to build a backend service (e.g., using Node.js/Express) to handle the entire RAG pipeline. This includes:
    1.  Securing the API key.
    2.  Generating embeddings for chunks upon ingestion.
    3.  Storing those embeddings in a true vector database (e.g., Pinecone, Weaviate).
    4.  Performing the vector search on the backend.
-   **Streaming Responses**: Implement response streaming from the Gemini API to display the answer token-by-token, significantly improving the user experience by reducing perceived latency.
-   **Conversation History**: Add a chat interface that remembers previous questions and answers, allowing for follow-up questions and a more natural conversational flow.
-   **Support for More File Types**: Add support for uploading PDF, DOCX, and other common file formats, with parsing handled on the backend.

---

## 👨‍💻 Author

-   **Name**: `shreya singh`
-   **Resume**: [View Resume](https://drive.google.com/file/d/1lVNzHQlpm7UTtYdjgewjYZrh8NDtUwQi/view?usp=drive_link)
