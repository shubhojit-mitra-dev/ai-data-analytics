Project: AI SQL Data Agent for Complex Business Analytics

Goal:
Build a full-stack application using React (frontend) and Node.js (backend)
that uses the Gemini Pro API (Google's GenAI model) to answer complex, vague business questions
from an SQL database with a dirty schema (e.g., unnamed tables/columns, inconsistent data).

Requirements:
- Natural language to SQL agent using Gemini Pro (via Vertex AI REST API)
- Agent must infer intent from vague or ambiguous prompts
- SQL queries must be dynamically generated and executed
- Results must be visualized as charts and tables
- Frontend: React + Tailwind CSS + Recharts or Chart.js
- Backend: Node.js + Express + Supabase/PostgreSQL
- Handle bad schemas and dirty data with intelligent reasoning
- Questions like: "Why did sales drop in Q2 in the southern zone?"

Automation:
- Use Supabase CLI to automate schema setup, data seeding
- Backend connects to Gemini via Vertex AI REST API with API key

Tasks:
1. Create Supabase schema with complex interlinked tables (e.g., sales, users, products, regions)
2. Backend route: POST /ask → takes a user question → sends to Gemini → gets SQL + explanation
3. Run SQL on Supabase DB → return results
4. Frontend displays explanation + table + chart

## Implementation Checklist

- [x] 1. Project Setup: Initialize Git repo, create frontend (React + Tailwind) and backend (Node.js + Express) projects
- [x] 2. Supabase Setup: Install CLI, create project, set up local development environment
- [x] 3. Database Design: Create schema with intentionally complex/dirty data structure (sales, users, products, regions)
- [x] 4. Data Seeding: Populate database with realistic business data including edge cases
- [ ] 5. Backend API: Implement Express routes for handling natural language questions
- [ ] 6. Gemini Integration: Set up Vertex AI client with system prompt describing database schema
- [ ] 7. SQL Generation: Implement natural language to SQL conversion with error handling
- [ ] 8. Query Execution: Create secure SQL execution pipeline with result formatting
- [ ] 9. Frontend UI: Build responsive interface with question input and results display
- [ ] 10. Visualization: Implement dynamic chart generation based on query results
- [ ] 11. Testing & Deployment: Test with various business questions and deploy application

