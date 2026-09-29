# MealMate Backend
Backend for **MealMate**, a hyperlocal marketplace connecting customer to verified home cooks in Nigeria. Customers order/subscribe to meals,cooks manage menus and orders,riders deliver, admins verify and moderate.

>Source of truth: **Cohort 8 Capstone project document ( Group 7)

## Stack 
Node.js * Express * MongonDB + Mongoose * JWT * bcryptjs * dotenv * ES Modules only (no CommonJS,no TypeScript)

## Roles
CUTOMER * COOK * RIDER * ADMIN

##Setup
> *git clone <repo-url>*
> *npm install*
> *npm run dev*
> 
Test it : GET hptt://localhost:5000/api -> should return **200**


## Stay Aligned: Shared Constants
Fixed values (roles, order statues, etc) lives in src/constants/. import them. **Never retype the strings**. Prevent mismatch like "cook" vs "Cook" .


## Project Structure

Backend service for the project

## Project Structure
src/
├── config/
├── constants/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── app.js
└── server.js

Flow : *Route -> Middleware -> C0ntrolller -> Mole/DB -> Responses*

## API Response Format
**Success**
{
success" : true,
"message" : "....",
"data" : []
}

**Error**
{
success" : false,
"message" : "error"
}
## Git Workflow

* main — stable only, no direct pushes
* dev — merged, tested features
* feature/<name> — one branch per task → PR into dev
**Commit types:** feat · fix · docs · refactor · chore
Pull dev often. Stay in your task's files. Edit shared files (app.js, .env.example, constants/) in small PRs and flag them to the team.

## PR Checklist
[ ] Up to date with dev, server runs clean
[ ] Endpoints tested in Postman
[ ] New env vars added to .env.example + README
[ ] Shared constants imported, not retyped
[ ] No secrets/.env committed
[ ] Endpoint documented (method, URL, auth, body, responses)

## Team
Backend Lead (architecture, reviews, merges) · Backend devs (assigned modules) 
Unclear requirement? Flag it to the Lead — don't guess.
 
