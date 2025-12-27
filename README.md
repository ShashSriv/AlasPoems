# AlasPoems

A Full-Stack Poem Portfolio website built with Next.js, Express, and MongoDB.

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Lucide React Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Tooling:** Concurrently (to run both servers)

## Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (installed and running locally, or a remote URI)

## Installation

1.  **Clone the repository** (if you haven't already).
2.  **Install dependencies** for both root, server, and client:

    ```bash
    npm run install:all
    ```
    
    *Alternatively, you can install them individually:*
    ```bash
    npm install
    cd server && npm install
    cd client && npm install
    ```

3.  **Environment Setup:**
    - The project comes with a `.env.example` file in the root.
    - Create a `.env` file in the root directory:
      ```bash
      cp .env.example .env
      ```
    - Update `MONGODB_URI` if your MongoDB instance is different from `mongodb://localhost:27017/alaspoems`.

## Running the Application

To run both the Frontend (port 3000) and Backend (port 5000) simultaneously:

```bash
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:5000](http://localhost:5000)

## API Endpoints

### Poems

- **GET /api/poems**: Retrieve all poems.
- **POST /api/poems**: Create a new poem.
  - Body: `{ "title": "...", "content": "...", "category": "..." }`
- **PUT /api/poems/:id**: Update a poem (Requires `x-admin: true` header).
- **DELETE /api/poems/:id**: Delete a poem (Requires `x-admin: true` header).

## Testing

1.  Ensure MongoDB is running.
2.  Run `npm run dev`.
3.  Use Postman or curl to add poems via the API (since there is no UI for creation in this version):

    ```bash
    curl -X POST http://localhost:5000/api/poems \
    -H "Content-Type: application/json" \
    -d "{\"title\": \"My First Poem\", \"content\": \"This is the first stanza.\n\nThis is the second.\", \"category\": \"Free Verse\"}"
    ```

4.  Refresh the homepage to see the poems.

## Folder Structure

- `/client`: Next.js Frontend application.
- `/server`: Express Backend application.
- `package.json`: Root configuration to run scripts.
