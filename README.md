# VedaAI — AI Assessment Creator

VedaAI is an intelligent assessment creation platform that leverages generative AI to help educators design comprehensive, structured question papers in minutes. Teachers describe their assessment requirements through a simple form, and VedaAI uses the GLM-4-Flash API to generate complete, professionally formatted exam papers with multiple question types, difficulty levels, and answer keys.

Built for modern pedagogy, VedaAI combines a responsive Next.js frontend with a robust Node.js backend powered by asynchronous job processing, real-time WebSocket updates, and MongoDB persistence—all orchestrated through BullMQ for reliable background job handling.

---

## ✨ Features

- **AI-Generated Question Papers** — Instantly create exam papers with structured sections and varied question types
- **Multiple Question Types** — MCQ, Short Answer, Long Answer, True/False, and Case Study questions
- **Difficulty Customization** — Set difficulty levels (Easy, Medium, Hard) per question type
- **Real-Time Progress Updates** — WebSocket-powered live status feeds during generation
- **Academic Layout** — Print-ready, professionally formatted exam papers matching academic standards
- **Answer Key Generation** — Automatic answer key with question numbering and solution references
- **Assignment Management** — Dashboard for viewing, creating, and managing all assignments
- **Asynchronous Processing** — Background job queue ensures the app stays responsive during AI generation
- **Fallback Polling** — Automatic fallback to REST polling if WebSocket disconnects
- **PDF Export** — Print to PDF directly from the browser with optimized print CSS

---

## 🏗️ Architecture Overview

### System Design

VedaAI employs a **job queue architecture** to handle computationally expensive AI generation tasks without blocking user interactions. When a teacher submits an assignment form, the backend immediately returns a job ID and spawns an asynchronous worker process. This pattern is critical because LLM API calls typically take 5–30 seconds, and forcing users to wait would create a poor experience.

The flow is:
1. **Immediate Response** — User submits form → API returns `{ assignment, jobId }` in milliseconds
2. **Background Processing** — BullMQ worker picks up the job and calls the GLM API
3. **Real-Time Feedback** — WebSocket emits progress events as the job runs
4. **Data Persistence** — Once complete, the question paper is saved to MongoDB
5. **Navigation** — Frontend automatically routes to the output page when complete

This separation of concerns ensures the app remains responsive while complex AI tasks run in the background.

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | Next.js 16 (App Router) | Server-side rendering, file-based routing, API routes |
| **Language** | TypeScript | Type safety across frontend and backend |
| **Frontend Styling** | Tailwind CSS v4 | Utility-first CSS with custom themes |
| **State Management** | Zustand | Lightweight, hook-based store for assignments and papers |
| **HTTP Client** | Axios | REST API calls with request/response interceptors |
| **Real-Time** | Socket.io-client | WebSocket for live job progress updates |
| **Form Validation** | Zod | Runtime type validation for LLM responses and user input |
| **PDF Export** | react-to-print | Browser-based print functionality |
| **Backend Runtime** | Node.js + Express | Lightweight, event-driven HTTP server |
| **Database** | MongoDB + Mongoose | Document storage for assignments and question papers |
| **Cache/Queue** | Redis + BullMQ | Job queue and session caching |
| **Background Jobs** | BullMQ + paper.worker | Reliable job processing with retries |
| **LLM API** | Z.AI GLM-4-Flash | OpenAI-compatible API endpoint for question generation |
| **WebSocket Server** | Socket.io | Real-time, room-based event broadcast |

### Data Flow Diagram

```
┌─────────────────┐
│  Teacher Form   │
└────────┬────────┘
         │ POST /api/assignments
         ▼
┌─────────────────────────────────┐
│  Express API (Port 8000)        │
│  - Validate request             │
│  - Save to MongoDB              │
│  - Create BullMQ job            │
│  - Return { assignment, jobId } │
└────────┬────────────────────────┘
         │
         ├─────────────────────────────────────┐
         │                                     │
         ▼                                     ▼
   ┌──────────────┐              ┌──────────────────────┐
   │  MongoDB     │              │  BullMQ Queue + Job  │
   │  (Persist)   │              │  (paper.worker)      │
   └──────────────┘              │  - Build prompt      │
                                 │  - Call GLM API      │
                                 │  - Parse response    │
                                 │  - Validate w/ Zod   │
                                 │  - Save QuestionPaper│
                                 │  - Emit progress     │
                                 └──────────┬───────────┘
                                            │
                      ┌─────────────────────┴──────────────────┐
                      │                                        │
                      ▼                                        ▼
            ┌──────────────────┐                  ┌──────────────────┐
            │  GLM API         │                  │  Redis (Cache)   │
            │  (LLM inference) │                  │  (Job state)     │
            └──────────────────┘                  └──────────────────┘
                      │
                      ▼
            ┌──────────────────────┐
            │  Socket.io Broadcast │
            │  'job:progress'      │
            │  'job:completed'     │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Next.js Frontend    │
            │  (Port 3000)         │
            │  - Listen for events │
            │  - Update UI state   │
            │  - Show progress     │
            │  - Navigate to /     │
            │    output/[paperId]  │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Output Page         │
            │  - Fetch paper data  │
            │  - Render exam layout│
            │  - Show answer key   │
            │  - Print / Download  │
            └──────────────────────┘
```

### Key Components

#### **promptBuilder.ts** (Backend)
Constructs the AI prompt from assignment metadata. Takes:
- Assignment title, subject, grade level
- Selected question types with counts and marks per question
- Difficulty levels for each type
- Teacher's assessment requirements and instructions

Outputs a structured prompt that tells the GLM API to respond with a JSON object containing an array of question sections, each with questions, options, answers, and explanations. Uses JSON mode to ensure parseable responses.

#### **responseParser.ts** (Backend)
Validates LLM output using Zod schemas that mirror the expected QuestionPaper structure. Ensures:
- All sections present and complete
- Question counts match requested counts
- Marks are positive integers
- Answer options are properly formatted
- No missing required fields

If validation fails, the BullMQ job is retried automatically (up to 3 times by default).

#### **paper.worker.ts** (Backend)
The BullMQ worker that handles paper generation:
1. Receives job data (assignmentId, questionConfigs, instructions)
2. Calls promptBuilder to create the prompt
3. Makes API call to GLM with JSON mode enabled
4. Parses response with responseParser
5. Saves validated QuestionPaper to MongoDB
6. Emits progress events to Socket.io
7. Marks job as complete

Runs as a separate process (`npm run worker`) that consumes jobs from the Redis queue.

#### **useWebSocket.ts** (Frontend)
React hook that manages the Socket.io connection:
- Initializes socket connection on mount
- Joins a room when a new job starts (room = jobId)
- Listens for 'job:progress', 'job:completed', 'job:failed' events
- Dispatches events to Zustand store
- Cleans up listeners on unmount
- Handles reconnection logic

Runs in the background, separate from the UI component lifecycle.

#### **useJobStatus.ts** (Frontend)
Polling fallback mechanism:
- If WebSocket doesn't emit an update within 5 seconds, starts polling
- Polls `/api/papers/jobs/:jobId` every 3 seconds
- Updates store with latest status
- Stops polling once job completes
- Provides graceful degradation if WebSocket fails

Ensures users always see progress, even if WebSocket is unavailable.

---

## 🚀 Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or later ([download](https://nodejs.org))
- **Redis** (local instance for queue/cache)
- **MongoDB Atlas** account (free tier available at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- **Z.AI API Key** for GLM-4-Flash (free tier at [open.bigmodel.cn](https://open.bigmodel.cn))

### 1. Clone the Repository

```bash
git clone https://github.com/0Aryan1/vedaAI.git
cd vedaAI
```

### 2. Start Redis

Redis is required for job queuing and caching.

**macOS (with Homebrew):**
```bash
brew install redis
brew services start redis
redis-cli ping
# Expected output: PONG
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
redis-cli ping
```

**Docker:**
```bash
docker run -d -p 6379:6379 redis:latest
```

### 3. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server
NODE_ENV=development
PORT=8000

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Redis (for BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379

# GLM API (Z.AI)
GLM_API_KEY=your_z_ai_api_key_here
GLM_MODEL=glm-4-flash
GLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4

# Server Config
CORS_ORIGIN=http://localhost:3000
```

**Environment variable explanations:**
- `MONGO_URI`: Connection string from MongoDB Atlas (get this from your cluster settings)
- `REDIS_HOST` & `REDIS_PORT`: Local Redis instance coordinates (default: localhost:6379)
- `GLM_API_KEY`: Free API key from Z.AI dashboard
- `GLM_BASE_URL`: OpenAI-compatible endpoint (stays as shown)
- `CORS_ORIGIN`: Frontend origin (change for production)

### 4. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
```

**Environment variable explanations:**
- `NEXT_PUBLIC_API_URL`: Backend REST API endpoint (must include port)
- `NEXT_PUBLIC_SOCKET_URL`: Backend WebSocket endpoint (same as API URL)
- These are `NEXT_PUBLIC_` so they're accessible in the browser

### 5. Running the Project

You'll need **three terminal windows**:

**Terminal 1: Redis** (already running if you used `brew services`)
```bash
# Verify it's running:
redis-cli ping
# Should output: PONG
```

**Terminal 2: Backend**
```bash
cd backend
npm run dev
# Output should show: Server running on http://localhost:8000
```

**Terminal 3: Frontend**
```bash
cd frontend
npm run dev
# Output should show: ▲ Next.js 16.0.0
#                     - Local: http://localhost:3000
```

### 6. Usage

1. **Open the app** — Visit [http://localhost:3000](http://localhost:3000)

2. **Navigate to Assignments** — Click on "Assignments" in the sidebar

3. **Create a New Assignment** — Click the green "Create Assignment" button

4. **Fill in the Assignment Form:**
   - **Title** — e.g., "Final Exam - Chemistry"
   - **Subject** — e.g., "Chemistry"
   - **Grade Level** — e.g., "10th"
   - **Due Date** — Pick a date
   - **Question Types** — Click "Add Question Type" to select:
     - Multiple Choice (MCQ) — 1 mark each
     - Short Answer — 3 marks each
     - Long Answer — 5 marks each
     - True/False — 1 mark each
     - Case Study — 10 marks each
   - For each type, set:
     - **Number of Questions** — How many questions of this type
     - **Marks per Question** — Points awarded per question
     - **Difficulty** — Easy, Medium, or Hard
   - **Assessment Requirements** — Describe your exam (e.g., "3-hour final covering chapters 1-5")

5. **Generate Paper** — Click "Generate question paper"

6. **Watch Progress** — A progress bar shows real-time generation status

7. **View Output** — Once complete, automatically navigate to the exam paper

8. **Print or Export** — Click "Download as PDF" or use your browser's print function (Ctrl+P / Cmd+P)

---

## 📁 Project Structure

```
vedaAI/
├── README.md
├── FINAL_CHECKLIST.txt
├── folder-structure.txt
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts                   # MongoDB connection
│   │   │   ├── redis.ts                # Redis client
│   │   │   └── bullmq.ts               # BullMQ queue setup
│   │   ├── controllers/
│   │   │   ├── assignment.controller.ts# Assignment CRUD
│   │   │   └── paper.controller.ts     # Question paper queries
│   │   ├── jobs/
│   │   │   └── generatePaper.job.ts    # Paper generation job definition
│   │   ├── middlewares/
│   │   │   ├── errorHandler.ts         # Global error handler
│   │   │   └── validate.ts             # Request validation
│   │   ├── models/
│   │   │   ├── Assignment.model.ts     # Assignment schema
│   │   │   └── QuestionPaper.model.ts  # Question paper schema
│   │   ├── queues/
│   │   │   └── paper.queue.ts          # Queue initialization
│   │   ├── routes/
│   │   │   ├── assignment.routes.ts    # Assignment endpoints
│   │   │   └── paper.routes.ts         # Paper endpoints
│   │   ├── types/
│   │   │   ├── api.types.ts            # API request/response types
│   │   │   ├── assignment.types.ts     # Assignment-specific types
│   │   │   └── job.types.ts            # Job-related types
│   │   ├── utils/
│   │   │   ├── ApiError.ts             # Custom error class
│   │   │   ├── ApiResponse.ts          # Standard response wrapper
│   │   │   ├── asyncHandler.ts         # Async middleware wrapper
│   │   │   ├── promptBuilder.ts        # AI prompt construction
│   │   │   └── responseParser.ts       # LLM response validation
│   │   ├── workers/
│   │   │   └── paper.worker.ts         # BullMQ worker process
│   │   ├── app.ts                      # Express app setup
│   │   ├── constants.ts                # Global constants
│   │   └── index.ts                    # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                            # Environment variables
│   └── public/temp/                    # Temporary file storage
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   └── login/              # Login page (placeholder)
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx          # Dashboard layout wrapper
│   │   │   │   ├── assignments/        # Assignments list page
│   │   │   │   ├── dashboard/          # Home/dashboard page
│   │   │   │   └── output/
│   │   │   │       └── [id]/           # Question paper display
│   │   │   ├── api/                    # Next.js API routes (unused)
│   │   │   ├── globals.css             # Global styles & print CSS
│   │   │   ├── layout.tsx              # Root layout
│   │   │   └── page.tsx                # Root home page
│   │   ├── components/
│   │   │   ├── assignment/
│   │   │   │   ├── AssignmentForm.tsx  # Main form component
│   │   │   │   ├── FileUpload.tsx      # File input (future)
│   │   │   │   ├── InstructionsInput.tsx
│   │   │   │   ├── MarksConfig.tsx
│   │   │   │   └── QuestionTypeSelector.tsx
│   │   │   ├── output/
│   │   │   │   ├── ActionBar.tsx       # Download button
│   │   │   │   ├── PaperHeader.tsx     # Title & metadata
│   │   │   │   ├── StudentInfoSection.tsx
│   │   │   │   ├── GeneralInstructions.tsx
│   │   │   │   ├── SectionBlock.tsx    # Section container
│   │   │   │   ├── QuestionCard.tsx    # Individual question
│   │   │   │   ├── DifficultyBadge.tsx
│   │   │   │   ├── SuccessBanner.tsx
│   │   │   │   ├── AnswerKeySection.tsx
│   │   │   │   └── ... (other output components)
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.tsx # Main layout wrapper
│   │   │   │   ├── DesktopSidebar.tsx  # Left sidebar (md+)
│   │   │   │   ├── DesktopNavbar.tsx   # Top navbar (md+)
│   │   │   │   ├── MobileSidebar.tsx   # Mobile menu
│   │   │   │   ├── MobileNavbar.tsx    # Mobile top bar
│   │   │   │   ├── MobileBottombar.tsx # Mobile bottom nav
│   │   │   │   └── navbar-ui-clean.tsx # Reusable nav components
│   │   │   ├── pages/
│   │   │   │   ├── AssignmentsPage.tsx # Assignments list
│   │   │   │   ├── HomePage.tsx        # Dashboard home
│   │   │   │   └── ... (future pages)
│   │   │   ├── shared/
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── ... (shared components)
│   │   │   └── ui/
│   │   │       └── ... (UI primitives)
│   │   ├── constants/
│   │   │   ├── question-types.ts       # Question type config
│   │   │   ├── routes.ts               # Route paths
│   │   │   └── websocket-events.ts     # Socket event names
│   │   ├── hooks/
│   │   │   ├── useAssignmentForm.ts    # Form state & validation
│   │   │   ├── useWebSocket.ts         # Socket.io connection
│   │   │   ├── useJobStatus.ts         # Job polling fallback
│   │   │   └── usePdfExport.ts         # Print/download logic
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts           # Axios instance
│   │   │   │   ├── assignments.ts      # Assignment API calls
│   │   │   │   └── papers.ts           # Paper API calls
│   │   │   ├── socket/
│   │   │   │   └── socket-client.ts    # Socket.io singleton
│   │   │   ├── utils/
│   │   │   │   ├── formatters.ts
│   │   │   │   └── validators.ts
│   │   │   └── validators/
│   │   │       └── ... (Zod schemas)
│   │   ├── store/
│   │   │   ├── index.ts                # Store creation
│   │   │   └── slices/
│   │   │       ├── assignment.slice.ts # Assignment state
│   │   │       ├── navigation.slice.ts # Navigation state
│   │   │       └── ui.slice.ts         # UI state
│   │   └── types/
│   │       ├── api.ts                  # API response types
│   │       ├── assignment.ts           # Assignment types
│   │       ├── question-paper.ts       # Question paper types
│   │       └── websocket.ts            # Socket event types
│   ├── public/
│   │   ├── icons/
│   │   │   ├── logo.svg
│   │   │   ├── Arrow_Left.svg
│   │   │   └── ... (other icons)
│   │   └── ... (other static assets)
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── .env.local                      # Environment variables
│   └── eslint.config.mjs
│
└── .gitignore                          # Git ignore rules
```

Each folder serves a specific purpose:
- **config/** — Database and service initialization
- **controllers/** — Request handling and response logic
- **jobs/** — Background job definitions
- **models/** — MongoDB schemas
- **workers/** — Job processing threads
- **utils/** — Shared helper functions
- **hooks/** — React custom hooks
- **store/** — Zustand state management
- **components/** — React components organized by feature

---

## 🔌 API Reference

### Authentication
Currently, **no authentication is implemented**. All endpoints are publicly accessible. This is intentional for the MVP scope.

### Endpoints

#### Assignments

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/assignments` | Create assignment & queue paper generation | `{ title, subject, gradeLevel, dueDate, sections[], additionalInstructions? }` | `{ assignment, jobId }` |
| `GET` | `/api/assignments` | List all assignments | — | `{ data: Assignment[] }` |
| `GET` | `/api/assignments/:id` | Get single assignment | — | `{ data: Assignment }` |
| `DELETE` | `/api/assignments/:id` | Delete assignment | — | `{ message: "Deleted" }` |

#### Question Papers

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/papers/:id` | Get question paper by ID | — | `{ data: QuestionPaper }` |
| `GET` | `/api/papers/assignment/:assignmentId` | Get paper for assignment | — | `{ data: QuestionPaper }` |
| `GET` | `/api/papers/jobs/:jobId` | Get job status & progress | — | `{ data: { status, progress, paperId?, error? } }` |

#### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check | `{ status: "OK" }` |

### Request/Response Examples

**Create Assignment (POST /api/assignments)**

Request:
```json
{
  "title": "Final Exam - Chemistry",
  "subject": "Chemistry",
  "gradeLevel": "10th",
  "dueDate": "2026-06-15",
  "sections": [
    {
      "name": "Multiple Choice",
      "questionType": "mcq",
      "numberOfQuestions": 5,
      "marksPerQuestion": 1,
      "difficulty": "medium"
    },
    {
      "name": "Short Answer",
      "questionType": "short",
      "numberOfQuestions": 3,
      "marksPerQuestion": 3,
      "difficulty": "medium"
    }
  ],
  "additionalInstructions": "Cover chapters 1-5. Include questions on chemical bonds and reactions."
}
```

Response:
```json
{
  "statusCode": 201,
  "data": {
    "assignment": {
      "id": "assignment-1234567890-abc",
      "_id": "507f1f77bcf86cd799439011",
      "title": "Final Exam - Chemistry",
      "subject": "Chemistry",
      "gradeLevel": "10th",
      "dueDate": "2026-06-15",
      "questionConfigs": [
        { "id": "mcq", "label": "Multiple Choice (MCQ)", "count": 5, "marks": 1 },
        { "id": "short", "label": "Short Answer", "count": 3, "marks": 3 }
      ],
      "totalMarks": 14,
      "createdAt": "2026-05-25T10:30:00Z",
      "status": "processing",
      "jobId": "job-uuid-here"
    },
    "jobId": "job-uuid-here"
  },
  "message": "Assignment created successfully"
}
```

**Get Job Status (GET /api/papers/jobs/:jobId)**

Response (in progress):
```json
{
  "statusCode": 200,
  "data": {
    "status": "processing",
    "progress": 65,
    "message": "Generating question content..."
  }
}
```

Response (completed):
```json
{
  "statusCode": 200,
  "data": {
    "status": "completed",
    "progress": 100,
    "paperId": "507f1f77bcf86cd799439012",
    "message": "Paper generated successfully"
  }
}
```

---

## ⚙️ Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port (8000 to avoid macOS AirPlay conflict) | `8000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/vedaai?retryWrites=true&w=majority` |
| `REDIS_HOST` | Redis server hostname | `localhost` |
| `REDIS_PORT` | Redis server port | `6379` |
| `GLM_API_KEY` | Z.AI API key for GLM-4-Flash | `your_api_key_here` |
| `GLM_MODEL` | Model name (must be glm-4-flash) | `glm-4-flash` |
| `GLM_BASE_URL` | OpenAI-compatible GLM API endpoint | `https://open.bigmodel.cn/api/paas/v4` |
| `CORS_ORIGIN` | Allowed origin for frontend requests | `http://localhost:3000` |

**Getting these values:**

- **MONGO_URI**: Log into MongoDB Atlas → Cluster → Connect → Copy connection string
- **REDIS_HOST & REDIS_PORT**: Default localhost:6379 (change if using Docker/remote Redis)
- **GLM_API_KEY**: Sign up at [open.bigmodel.cn](https://open.bigmodel.cn) → API Keys → Create new key
- **CORS_ORIGIN**: Change to your frontend domain in production

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend REST API endpoint | `http://localhost:8000` |
| `NEXT_PUBLIC_SOCKET_URL` | Backend WebSocket endpoint (same as API) | `http://localhost:8000` |

**Notes:**
- These are `NEXT_PUBLIC_` so they're exposed to the browser (don't put secrets here)
- Both should point to the same backend server
- In production, use your domain: `https://api.vedaai.com`

---

## 🧠 AI Prompt Strategy

### Prompt Construction

The `promptBuilder.ts` utility converts assignment metadata into a carefully structured prompt that guides the LLM to produce valid, consistent JSON output.

**Input data:**
```typescript
{
  title: "Final Exam - Chemistry",
  subject: "Chemistry",
  gradeLevel: "10th",
  sections: [
    {
      name: "Multiple Choice",
      questionType: "mcq",
      numberOfQuestions: 5,
      marksPerQuestion: 1,
      difficulty: "medium"
    },
    {
      name: "Short Answer",
      questionType: "short",
      numberOfQuestions: 3,
      marksPerQuestion: 3,
      difficulty: "medium"
    }
  ],
  instructions: "Cover chapters 1-5. Focus on chemical bonds and reactions."
}
```

**Prompt generation:**
The builder constructs a prompt that:
1. Sets context (exam level, subject, time duration)
2. Specifies each section with exact question count and marks
3. Describes question format (MCQ has 4 options, short answer is 2-3 sentences, etc.)
4. Defines difficulty expectations (easy = commonly known concepts, medium = requires understanding, hard = application/synthesis)
5. Instructs JSON mode with specific schema
6. Includes teacher's custom instructions

Example prompt (simplified):
```
You are an expert educator creating a high-quality question paper for 10th grade Chemistry students.

Create a question paper with the following sections:

1. Multiple Choice (MCQ)
   - Number of questions: 5
   - Marks per question: 1
   - Difficulty: Medium
   - Format: Each question has 4 options (A, B, C, D), one correct answer

2. Short Answer
   - Number of questions: 3
   - Marks per question: 3
   - Difficulty: Medium
   - Format: Questions should require 2-3 sentence answers

Additional requirements:
- Cover chapters 1-5 of the chemistry textbook
- Focus on chemical bonds and reactions
- Ensure questions are academically appropriate for 10th graders
- Include an answer for each question

Respond with ONLY valid JSON in this exact schema:
{
  "sections": [
    {
      "name": "Multiple Choice",
      "questions": [
        {
          "questionNumber": 1,
          "questionText": "...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctAnswer": "A",
          "explanation": "...",
          "marks": 1,
          "difficulty": "medium"
        }
      ]
    }
  ]
}
```

### JSON Mode & Validation

**Why JSON mode?**
- Ensures the LLM response is always valid JSON (no markdown or explanations)
- Makes response parsing deterministic
- Allows strict schema validation with Zod before saving

**The flow:**
1. Send request to GLM with `response_format: { type: "json_object" }`
2. GLM returns guaranteed-valid JSON
3. `responseParser.ts` uses Zod to validate against expected schema
4. If validation passes → Save to MongoDB
5. If validation fails → BullMQ retries job (up to 3 attempts)

**Zod schema (example):**
```typescript
const QuestionSchema = z.object({
  questionNumber: z.number(),
  questionText: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  explanation: z.string(),
  marks: z.number().positive(),
  difficulty: z.enum(['easy', 'medium', 'hard'])
});

const QuestionPaperSchema = z.object({
  sections: z.array(z.object({
    name: z.string(),
    questions: z.array(QuestionSchema)
  }))
});
```

### Handling Generation Failures

If the GLM API returns malformed JSON or invalid data:
1. Zod validation fails with detailed error message
2. BullMQ worker catches the error
3. Job is automatically retried (exponential backoff: 2s, 4s, 8s)
4. After 3 failed attempts, job marked as `failed`
5. Frontend shows error to user: "Paper generation failed. Please try again."
6. User can click "Generate Again" to resubmit the same form

---

## 🔄 Real-Time Updates

### Primary Channel: WebSocket (Socket.io)

When a user submits an assignment form, the frontend immediately joins a **Socket.io room** named after the job ID:

```typescript
// Frontend: join room
socket.emit('join:job', { jobId });

// Backend: listen for user joins
socket.on('connection', (socket) => {
  socket.on('join:job', ({ jobId }) => {
    socket.join(`job:${jobId}`);
  });
});
```

The worker then broadcasts progress events to the room:

```typescript
// Backend: emit progress during generation
io.to(`job:${jobId}`).emit('job:progress', {
  status: 'processing',
  progress: 45,
  message: 'Parsing question responses...'
});

// Frontend: listen for progress
socket.on('job:progress', (data) => {
  updateStore({ status: data.status, progress: data.progress });
});
```

**Socket events:**
- `job:started` — Generation started
- `job:progress` — Progress update (includes progress percentage 0-100)
- `job:completed` — Generation finished, paperId available
- `job:failed` — Generation failed

### Fallback Channel: REST Polling

If WebSocket is unavailable or disconnects:

```typescript
// Frontend: useJobStatus hook
useEffect(() => {
  const pollTimer = setTimeout(() => {
    // If no WebSocket update in 5s, start polling
    setPolling(true);
  }, 5000);

  const interval = setInterval(async () => {
    const status = await assignmentApi.getJobStatus(jobId);
    updateStore(status);
    
    if (status.status === 'completed' || status.status === 'failed') {
      setPolling(false);
    }
  }, 3000); // Poll every 3 seconds

  return () => {
    clearTimeout(pollTimer);
    clearInterval(interval);
  };
}, [jobId]);
```

**Why both?**
- **WebSocket** is instant and efficient (low latency, single connection)
- **Polling** ensures resilience if WebSocket drops or user is on poor connectivity
- Users never experience "stuck" progress bars

### User Experience

1. User clicks "Generate Paper"
2. Form submits → API returns jobId instantly
3. Progress page shows 0% with spinner
4. WebSocket connects and joins job room
5. As worker processes:
   - `job:progress` events arrive ~every 2-5 seconds
   - Progress bar animates: 0% → 25% → 50% → 75% → 100%
   - Status messages update: "Initializing..." → "Building prompt..." → "Calling AI..." → "Parsing response..." → "Saving..." → "Done!"
6. When `job:completed` arrives, automatically navigate to `/output/[paperId]`
7. Paper loads and displays on screen

If WebSocket drops during step 5:
- Polling kicks in after 5s of silence
- Progress updates continue via REST
- User sees no interruption

---

## 🖨️ PDF Export

### Print-to-PDF Strategy

VedaAI uses the browser's native print functionality rather than a library like PDFKit. This approach:
- Works across all browsers without backend dependency
- Respects user's print settings (margins, colors, etc.)
- Produces publication-quality output
- Requires no additional server processing

### How It Works

**1. Custom Print CSS** (in `globals.css`)

```css
@media print {
  /* Hide interactive elements */
  .no-print { display: none !important; }
  nav, aside, header { display: none !important; }
  
  /* Reset body margins */
  body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Paper styling */
  #paper-print-area {
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
  }
  
  /* Page setup */
  @page {
    size: A4;
    margin: 1.5cm;
  }
  
  /* Prevent orphaned questions */
  li { break-inside: avoid; }
  
  /* Use serif font for academic look */
  #paper-print-area {
    font-family: Georgia, "Times New Roman", serif !important;
  }
  
  /* Ensure colors print */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
```

**2. Frontend Export Hook** (`usePdfExport.ts`)

```typescript
export function usePdfExport() {
  const exportPdf = () => {
    window.print();
  };
  
  return { exportPdf };
}
```

**3. ActionBar Component** (calls the hook)

```tsx
<button onClick={exportPdf}>
  Download as PDF
</button>
```

### User Experience

1. User clicks "Download as PDF"
2. Browser opens print dialog (Ctrl+P / Cmd+P)
3. User sees preview of clean academic paper
4. User can:
   - Save as PDF (default printer = "Save as PDF")
   - Print to physical printer
   - Adjust margins/orientation
5. User clicks "Save" or "Print"
6. PDF saved or printed

### Output Format

The printed/PDF output includes:
- **Paper Header** — Title, subject, grade, marks, time
- **Student Info Section** — Blanks for name, roll number, class
- **General Instructions** — 4 standard exam instructions
- **Question Sections** — Grouped by type (MCQ, Short Answer, etc.)
  - Section title and any section-specific instructions
  - Questions with difficulty badges
  - Proper numbering and mark allocation
- **Answer Key** — Global question numbering with answers and explanations

Everything is formatted in serif font (Georgia) for an academic, formal appearance.

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **No Authentication** — Anyone can create/view assignments. This is by design for the MVP; implement auth before production deployment.

2. **No File Upload** — Teachers cannot upload PDF, image, or text files for context. Planned for v2.

3. **GLM API Latency** — Generation takes 5–30 seconds depending on question count and API load. Consider showing tips or progress messages during long waits.

4. **No Paper Editing** — Teachers cannot modify questions after generation. All edits require regenerating the entire paper.

5. **macOS Port Conflict** — Port 8000 is used instead of the typical 5000 because macOS reserves 5000 for AirPlay. Not an issue on Linux/Windows.

6. **No Question Bank** — Questions are not saved separately; they only exist as part of the complete question paper. No ability to reuse questions across papers.

7. **Single Template** — Only one academic exam layout is available. Custom templates are not supported.

### Known Bugs

- **WebSocket Not Connecting** — If CORS is misconfigured, WebSocket may fail silently. Check browser console for errors.
- **Polling Never Stops** — In rare cases, if job status endpoint is slow, polling may continue even after job completes. A refresh of the page clears this.
- **Questions Cut Off on Print** — If a question is very long, it may get cut off at page boundary. Use the `break-inside: avoid` CSS rule on printed output.

---

## 🔮 Future Improvements

### Planned Features

- **User Authentication** — Register/login with email; users can only see their own assignments
- **PDF/File Upload** — Upload context documents that the AI considers when generating questions
- **Question Bank** — Reuse previously generated questions across multiple papers
- **Template Library** — Choose from multiple paper layouts (formal exam, quiz, homework, etc.)
- **Collaborative Editing** — Teachers work together on the same paper in real-time
- **Scheduling** — Schedule paper generation for specific dates
- **Analytics Dashboard** — View stats on papers created, questions generated, time saved
- **Share Papers** — Generate shareable links for student access/submission
- **Mobile App** — Native iOS/Android app for on-the-go assignment creation
- **Multi-Language Support** — Generate questions in Hindi, Spanish, French, etc.
- **Custom Difficulty Mapping** — Define what "Easy" means for your curriculum
- **Answer Verification** — Check student answers against generated answer key

### Architecture Improvements

- **Caching** — Cache frequently used prompts and responses to reduce API calls
- **Load Balancing** — Distribute worker processes across multiple servers
- **Database Optimization** — Index question papers by subject/grade for faster searches
- **API Rate Limiting** — Protect against abuse with rate limits per user
- **Monitoring & Alerts** — Track job failures, API latency, and alert on issues

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

---

## 🎯 Project Status

**Current Version:** 0.1.0 (MVP)

VedaAI is in active development. Core functionality is stable, but expect refinements and new features regularly. Not recommended for production use without security hardening (authentication, validation, rate limiting).

---

**Last Updated:** May 25, 2026  
**Built with ❤️ for educators and students**
