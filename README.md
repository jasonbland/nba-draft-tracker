# NBA Draft Tracker

A modern web application that displays the number of players drafted by each NBA team in the first two rounds. Built with React, TypeScript, and deployed on Cloudflare Workers.

**Live Demo:** [nba-draft-tracker.jasonbland.dev](https://www.nba-draft-tracker.jasonbland.dev)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Roadmap](#roadmap)
- [Known Limitations](#known-limitations)

---

## Overview

The NBA Draft Tracker provides an easy way to view draft analytics for NBA teams. Users can select any team from a dropdown and see how many players were drafted in rounds 1 and 2, helping visualize team-building strategies through the draft.

**Key Features:**
- All 30 NBA teams available for selection
- Real-time data from Ball Don't Lie API
- Draft round breakdown (rounds 1-2)
- Responsive UI with React Bootstrap
- Fast edge deployment via Cloudflare Workers

---

## Architecture

The application follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────┐
│   React UI      │  ← Presentational components (SelectTeamDropdown, DraftRoundCount)
└────────┬────────┘
         │
┌────────▼────────┐
│  State & Logic  │  ← App.tsx (orchestration, state management)
└────────┬────────┘
         │
┌────────▼────────┐
│  API Layer      │  ← balldontlieApi.ts (SDK wrapper, data transformation)
└────────┬────────┘
         │
┌────────▼────────┐
│ Ball Don't Lie  │  ← External NBA stats API
│      API        │
└─────────────────┘
```

**Design Patterns:**
- **Component Composition:** Presentational components receive data via props
- **Container/Presenter:** App.tsx acts as container component managing state
- **API Abstraction:** balldontlieApi.ts provides clean interface to external SDK
- **Error Boundaries:** Graceful degradation with user-friendly error messages
- **Edge-First:** Cloudflare Workers for low-latency global distribution

---

## Tech Stack

### Frontend
- **React 19** - UI library with hooks
- **TypeScript 5.8** - Type safety and developer experience
- **Vite 6.3** - Fast build tool with HMR
- **React Bootstrap 2.10** - Responsive component library
- **Bootstrap 5.3** - CSS framework

### Backend/Edge
- **Cloudflare Workers** - Serverless edge compute platform
- **Hono 4.7** - Lightweight web framework for Workers
- **Wrangler 4.12** - Cloudflare developer tooling

### External APIs
- **Ball Don't Lie API** - NBA player and team data via [@balldontlie/sdk](https://www.npmjs.com/package/@balldontlie/sdk)

### Development Tools
- **Jest 29.7** - Testing framework
- **React Testing Library 16.3** - Component testing utilities
- **ESLint 9.25** - Code quality and style enforcement
- **ts-jest** - TypeScript transformation for Jest

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- (Optional) Cloudflare account for deployment

### Installation

```bash
# Clone the repository
git clone https://github.com/jasonbland/nba-draft-tracker.git
cd nba-draft-tracker

# Install dependencies
npm install
```

### Development Server

```bash
# Start Vite dev server
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
nba-draft-tracker/
├── src/
│   ├── app/                      # React application
│   │   ├── App.tsx              # Main component (state management)
│   │   ├── main.tsx             # React DOM entry point
│   │   ├── App.css              # Application styles
│   │   └── index.css            # Global styles
│   ├── components/               # React UI components
│   │   ├── SelectTeamDropdown.tsx   # Team selection dropdown
│   │   ├── NBATeamsForm.tsx         # Form wrapper component
│   │   ├── DraftRoundCount.tsx      # Results display
│   │   └── ErrorPage.tsx            # Error UI
│   ├── functions/
│   │   └── balldontlieApi.ts    # API integration layer
│   └── worker/
│       └── index.ts             # Cloudflare Worker entry point
├── test/
│   ├── app/
│   │   └── App.test.tsx         # Integration tests
│   ├── mocks/
│   │   └── fileMock.js          # Asset mocking for Jest
│   └── jest.setup.ts            # Jest configuration
├── public/                       # Static assets
├── dist/                         # Build output (gitignored)
├── package.json
├── tsconfig.json                # Root TypeScript config
├── tsconfig.app.json            # App-specific TS config
├── tsconfig.worker.json         # Worker-specific TS config
├── vite.config.ts               # Vite build configuration
├── jest.config.ts               # Jest test configuration
├── wrangler.json                # Cloudflare Worker config
└── eslint.config.js             # ESLint rules
```

### Key Directories

- **`src/app/`** - React application entry point and main component
- **`src/components/`** - Reusable React components (presentation layer)
- **`src/functions/`** - Business logic and API integration
- **`src/worker/`** - Cloudflare Workers edge runtime code
- **`test/`** - Test files and test configuration

---

## How It Works

### Data Flow

1. **Initialization**
   - App.tsx mounts and triggers useEffect hook
   - `getNBATeams()` fetches all 30 NBA teams from Ball Don't Lie API
   - Teams populate SelectTeamDropdown component

2. **Team Selection**
   - User selects a team from dropdown
   - Form submission triggers state update with selected team ID

3. **Player Lookup**
   - `getNBAPlayers({ teamId })` fetches all players for the selected team
   - Returns array of NBAPlayer objects with draft_round property

4. **Draft Analysis**
   - `getRoundCountForSelectedTeam({ teamPlayers })` processes player data
   - Filters players by draft_round (rounds 1-2 only)
   - Aggregates count per round into RoundCounts object

5. **Results Display**
   - DraftRoundCount component receives round counts as props
   - Displays team name and draft distribution
   - Updates UI reactively as selections change

### API Integration

The `balldontlieApi.ts` module provides three key functions:

```typescript
// Fetch all NBA teams
getNBATeams(): Promise<NBATeam[]>

// Fetch players for a specific team
getNBAPlayers({ teamId }): Promise<NBAPlayer[]>

// Calculate draft round distribution
getRoundCountForSelectedTeam({ teamPlayers }): RoundCounts
```

All API calls include error handling that gracefully degrades to empty arrays on failure.

---

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Run type checking
tsc -b

# Lint code
npm run lint

# Run all tests
npm run test

# Build for production
npm run build

# Preview production build locally
npm run preview

# Validate build (type check + build + dry-run deploy)
npm run check
```

### Code Quality

The project enforces code quality through:
- **TypeScript strict mode** - Compile-time type safety
- **ESLint** - Linting with React hooks rules
- **React Refresh** - Fast refresh during development

### Adding New Features

1. Create component in `src/components/` (presentation)
2. Add business logic to `src/functions/` (data processing)
3. Update App.tsx for state orchestration
4. Write tests in `test/app/`
5. Run `npm run check` to validate

---

## Testing

### Test Framework

- **Jest 29.7** with jsdom environment
- **React Testing Library 16.3** for component testing
- **ts-jest** for TypeScript transformation

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run with coverage
npm run test -- --coverage
```

### Test Coverage

Current test suite includes:
- Teams load and populate dropdown
- Error handling on initial API failure
- Full user flow (team selection → draft round display)
- Error handling on player lookup failure

### Test Organization

```
test/
├── app/
│   └── App.test.tsx        # Integration tests for main component
├── mocks/
│   └── fileMock.js         # Mock handlers for static assets
└── jest.setup.ts           # Global test setup
```

### Mocking Strategy

- API functions (`balldontlieApi.ts`) are mocked using Jest manual mocks
- Static assets (CSS, images) are stubbed with fileMock.js
- React Testing Library provides userEvent simulation

---

## Deployment

The application deploys to **Cloudflare Workers**, a serverless edge platform that runs code globally.

### Build and Deploy

```bash
# Build the application
npm run build

# Deploy to Cloudflare Workers
npm run deploy

# Or combine both steps
npm run build && npm run deploy
```

### Deployment Configuration

Deployment settings are in `wrangler.json`:

```json
{
  "name": "nba-draft-tracker",
  "main": "./src/worker/index.ts",
  "compatibility_date": "2025-04-01",
  "compatibility_flags": ["nodejs_compat"],
  "observability": { "enabled": true },
  "upload_source_maps": true,
  "assets": {
    "not_found_handling": "single-page-application"
  }
}
```

**Key Settings:**
- **SPA mode** - Routes 404s to index.html for client-side routing
- **Node.js compatibility** - Enables Node.js APIs in Workers runtime
- **Observability** - Telemetry and logging enabled
- **Source maps** - Uploaded for better error debugging

### CI/CD

The project includes a `check` script for validation:

```bash
npm run check  # TypeScript check + build + dry-run deploy
```

This can be integrated into CI pipelines to validate PRs before merge.

---

## Configuration

### TypeScript Configuration

The project uses composite TypeScript configurations:

- **`tsconfig.json`** - Root configuration with project references
- **`tsconfig.app.json`** - Frontend app (ES2020, DOM libs)
- **`tsconfig.worker.json`** - Cloudflare Worker (ES2022, Worker types)
- **`tsconfig.node.json`** - Build tools (ES2023)

Strict mode is enabled across all configurations.

### Environment Variables

Currently the Ball Don't Lie API key is hardcoded in `src/functions/balldontlieApi.ts:4`.

**Future improvement:** Migrate to environment variable:
```typescript
const API_KEY = process.env.BALLDONTLIE_API_KEY;
```

Then configure in Cloudflare Workers dashboard or wrangler.toml:
```toml
[vars]
BALLDONTLIE_API_KEY = "your-api-key"
```

### Vite Configuration

`vite.config.ts` includes:
- React plugin for JSX transformation
- Cloudflare plugin for Workers integration
- Build optimizations for production

---

## Roadmap

Based on TODO comments and potential enhancements:

### Short Term
- [ ] **Environment variable for API key** - Remove hardcoded key from source
- [ ] **Team filtering** - Option to filter inactive teams from dropdown
- [ ] **Client-side caching** - Cache team data in localStorage to reduce API calls
- [ ] **Loading states** - Add loading indicator during player lookups

### Medium Term
- [ ] **Observability integration** - Log errors to Splunk or similar platform
- [ ] **Extended draft rounds** - Support rounds 3-7 or all rounds
- [ ] **Draft year filtering** - Filter players by specific draft years
- [ ] **Player details** - Show individual player names and draft positions
- [ ] **Pagination** - Handle large datasets more efficiently

### Long Term
- [ ] **Historical trends** - Chart draft patterns over multiple years
- [ ] **Team comparisons** - Compare draft strategies across teams
- [ ] **Draft value analysis** - Calculate draft capital and value metrics
- [ ] **Mobile app** - React Native or PWA for mobile experience
- [ ] **API endpoint** - Expose draft analytics as public API

---

## Known Limitations

### API Rate Limiting
The Ball Don't Lie API has rate limits that may affect heavy usage. Error handling displays a generic message when rate limits are hit.

**Mitigation strategies:**
- Implement client-side caching for team data
- Add request throttling/debouncing
- Consider API key rotation or paid tier

### Data Freshness
Player data is fetched on-demand but not automatically refreshed. Users must reload to get updated rosters.

**Potential solutions:**
- Periodic background refresh
- Cache invalidation strategies
- WebSocket or Server-Sent Events for real-time updates

### Error Granularity
All API errors currently show the same generic error page. Different error types (rate limit, network, 404) are not distinguished.

**Improvements:**
- Differentiate error types with specific messages
- Retry logic for transient failures
- Graceful degradation with stale data

### Browser Compatibility
The application uses modern JavaScript (ES2020+) and may not support older browsers.

**Minimum supported versions:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Follow existing patterns** - Match code style and architecture
3. **Write tests** - All new features should include test coverage
4. **Run validation** - `npm run check` must pass
5. **Conventional commits** - Use conventional commit format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for test additions
   - `refactor:` for code improvements

### Development Workflow

```bash
# Create feature branch
git checkout -b feat/your-feature-name

# Make changes and test
npm run test
npm run lint
npm run check

# Commit with conventional format
git commit -m "feat: add draft year filtering"

# Push and create PR
git push origin feat/your-feature-name
```

---

## License

This project is open source and available under the MIT License.

---

## Acknowledgments

- **Ball Don't Lie API** - NBA data provider
- **Cloudflare Workers** - Edge compute platform
- **React Team** - UI framework
- **Vite Team** - Build tooling

---

## Questions or Issues?

Please [open an issue](https://github.com/jasonbland/nba-draft-tracker/issues) on GitHub for bugs, feature requests, or questions.
