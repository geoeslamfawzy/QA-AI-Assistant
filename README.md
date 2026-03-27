# QA AI Assistant

An AI-powered QA assistant built with Next.js that integrates with Jira, Figma, and AI services (Anthropic Claude, Google Gemini) to help with quality assurance workflows.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

You can verify your installations by running:

```bash
node --version
npm --version
git --version
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd QA-AI-Assistant
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   touch .env.local
   ```

   Add the following environment variables (fill in your actual values):

   ```env
   # AI Services (at least one is required)
   ANTHROPIC_API_KEY=your_anthropic_api_key
   GEMINI_API_KEY=your_gemini_api_key

   # Jira Integration (optional)
   JIRA_DOMAIN=your-company.atlassian.net
   JIRA_EMAIL=your-email@company.com
   JIRA_API_TOKEN=your_jira_api_token
   JIRA_PROJECT_KEY=YOUR_PROJECT_KEY
   XRAY_PROJECT_KEY=YOUR_XRAY_PROJECT_KEY

   # Figma Integration (optional)
   FIGMA_ACCESS_TOKEN=your_figma_access_token

   # Knowledge Base (optional)
   KNOWLEDGE_BASE_PATH=./knowledge-base

   # Cron Jobs (optional)
   CRON_SECRET=your_cron_secret
   ```

### Getting API Keys

#### Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys and create a new key

#### Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign up or log in
3. Create an API key

#### Jira API Token
1. Log in to [Atlassian Account](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a label and copy the generated token

#### Figma Access Token
1. Log in to Figma
2. Go to Account Settings
3. Scroll to "Personal access tokens" and generate a new token

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
QA-AI-Assistant/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   └── ...                # Page components
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── ai/               # AI client integrations
│   ├── jira/             # Jira API client
│   ├── figma/            # Figma API client
│   └── knowledge-engine/ # Knowledge base utilities
├── knowledge-base/        # Local knowledge base files
├── scripts/              # Utility scripts
└── public/               # Static assets
```

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: Zustand, TanStack Query
- **AI Services**: Anthropic Claude, Google Gemini
- **Code Editor**: Monaco Editor

## Troubleshooting

### `next: command not found`

This error occurs when dependencies are not installed. Run:

```bash
npm install
```

### API Key errors

Ensure your `.env.local` file exists and contains valid API keys. The application requires at least one AI service API key (Anthropic or Gemini) to function.

### Port already in use

If port 3000 is already in use, you can run on a different port:

```bash
npm run dev -- -p 3001
```

## License

Private - All rights reserved.
