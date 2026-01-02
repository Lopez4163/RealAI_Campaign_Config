# REAL.AI CAMPAIGN CONFIGURATOR

A lightweight Next.js micro-app that parses free-form user input into structured timeline data using a gemmini model

---

## 🚀 Quick Start (Get Running in Minutes)

This project is designed to be run locally with minimal setup.

### 1. Clone the Repository
```bash
git clone https://github.com/Lopez4163/RealAI_Campaign_Config.git
cd REAL-AI-CONFIG-POC
```
### 2. Install Dependecies
```bash
npm install
```
### 3. Enviorment Variables
Create a .env file in the root directory `/campaign_configurator`.
The current build is using the following model:
```bash 
model: "gemini-2.0-flash",   #DIRECTORY --> /app/api/generate/route.ts
```
Use appropriate GoogleAI Key or change the model. Add code below and enter key: 
```bash
GOOGLE_API_KEY=""    #REMOVE( "" )
```
### 4. Run Dev Server
```bash
npm run dev
```
### 5. Open Browser
```bash
http://localhost:3000
```
## 🚀 Edit Prompt for Engineering

All prompt logic lives in a dedicated file, making it easy to iterate on
prompt design without touching frontend or API code.

This is the primary area to modify model behavior and output structure.

### Prompt Location
```bash
campaign_configurator/app/lib/prompts/prompts.ts
```
## 🧠 Prompt Variants

The app uses different prompt functions depending on the selected
`campaignType`. Each prompt receives the same `UserContext` input.
output from the model.

### Audience Prompt

Used when the leed selects `Targeted audience for my product`.
```ts
export function audiencePrompt(ctx: UserContext) 
```
### Product Prompt

Used when the leed selects `Products that will engage my existing audience`.
```ts
export function productPrompt(ctx: UserContext) 
```
The prompt functions accept a `UserContext` object and inject user-provided
values (such as `industry` and `description`) directly into the model prompt.

