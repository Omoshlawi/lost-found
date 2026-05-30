# CitizenLink — Web Dashboard

Staff admin portal for the CitizenLink civic platform. Manages document cases, exchange workflows, custody operations, claims, matches, users, roles, and system configuration.

## Tech Stack

- **Framework**: React 19 + React Router v7
- **Build**: Vite
- **UI**: Mantine v8
- **Data Fetching**: SWR
- **State**: Zustand
- **Testing**: Vitest + React Testing Library
- **Package Manager**: yarn

The Vite dev server proxies `/api` to `localhost:2000` (the NestJS backend).

## Quick Start

```bash
yarn install
yarn dev
```

App available at `http://localhost:5173`.

## Commands

```bash
yarn dev              # Start dev server
yarn build            # Production build
yarn preview          # Preview production build locally
yarn test             # Run vitest + lint + typecheck
yarn vitest           # Run vitest only
yarn vitest:watch     # Watch mode
yarn eslint           # Lint
yarn prettier:write   # Format all files
yarn prettier:check   # Check formatting
yarn storybook        # Start Storybook
yarn storybook:build  # Build Storybook
```

## Features

**Cases** — Lost/found document case management. Collection flow: Issue Code → Enter Handover Code → confirm. Outbound handover support. Resend/Revoke verification code actions.

**Claims** — Claim verification and review workflow.

**Matches** — Match list and detail views.

**Custody** (`src/features/custody/`) — Physical document custody operations. Operation types: RECEIPT, TRANSFER_OUT, TRANSFER_IN, REQUISITION, HANDOVER, DISPOSAL, RETURN.

**Exchange** — Exchange scheduling, code lifecycle, and courier delivery actions (Print Label, Mark Failed).

**Station Context** (`src/features/station-context/`) — Post-login station selection at `/select-station`. Staff must have an active station before accessing the dashboard.

**Admin** (`src/features/admin/`) — Document types, IAM (roles/permissions), system settings, transition reasons.

**Users** — User list, detail, and role assignment.

**Addresses** — Address CRUD management.

**Status Transitions** — Status workflow management.

**Templates** — Notification/email template management with version history and rollback.

## Project Structure

```
src/
├── features/
│   ├── cases/           # Case management + collection forms
│   ├── claims/          # Claim verification
│   ├── matches/         # Match review
│   ├── custody/         # Physical custody operations
│   ├── exchange/        # Exchange workflows + delivery actions
│   ├── station-context/ # Station selection + guard
│   ├── admin/           # Document types, IAM, settings, transition reasons
│   ├── users/           # User management
│   ├── addresses/       # Address management
│   ├── status-transitions/ # Status workflow management
│   ├── templates/       # Template management
│   ├── dashboard/       # Dashboard home
│   ├── settings/        # User settings
│   └── ui/              # Shared UI components
└── ...
```

## Docker

```bash
# Build and run production container (Nginx serves the Vite bundle)
docker compose up --build -d
```

The Nginx config mirrors the Vite proxy — `/api` and `/socket.io` requests are forwarded to the backend server.

## Design System

**Civic Editorial**: Primary Deep Navy `#003b5a`, Secondary Sky Blue `#006397`, Tertiary Civic Gold `#e8b84b`, Success Civic Green `#1d9e75`. Zero border radius. See `src/features/ui/` for design tokens.
