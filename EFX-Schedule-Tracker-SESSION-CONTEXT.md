# EFX Creations Schedule Tracker - AI System Handoff

> Status: frontend complete for database-free mock development
> Last verified: 2026-09-24
> Workspace: `d:\EFX-Schedule-Tracker`
> Session: `5585bddd-012c-47d7-b760-d074c770ae3e`
> Primary command directory: `d:\EFX-Schedule-Tracker\client`

## 0. How To Read This File

This is a machine-oriented engineering handoff. Treat the following sections as the source of truth for the current frontend:

1. `Current Status` states what exists now.
2. `Architecture Rules` states boundaries that must not be violated.
3. `File Responsibility Map` explains what each important file owns.
4. `Call Chains` explains how features execute.
5. `Contracts And Data` explains API shapes and relationships.
6. `Validation And Known Limits` separates verified facts from future work.

When changing the code, inspect the actual file before editing. Preserve existing functionality and use the smallest change that fixes the requested behavior.

## 1. Current Status

The application is a React/Vite JavaScript frontend for scheduling photography and videography projects for EFX Creations.

The database and Express backend do not exist yet. The application must currently run entirely with mock data. No SQL connection, database driver, Express server, JWT implementation, or bcrypt implementation belongs in the frontend.

Current mode:

```text
VITE_USE_MOCK_API=true

React UI
  -> React components
  -> service layer
  -> mockApi
  -> mockDatabase
  -> in-memory mock records
```

Future mode:

```text
VITE_USE_MOCK_API=false

React UI
  -> React components
  -> service layer
  -> Axios api instance
  -> Express REST API
  -> MSSQL
```

Switching modes must not require UI component changes.

## 2. Technology And Commands

Technology:

- React 19
- Vite
- JavaScript, not TypeScript
- Ant Design
- `@ant-design/icons`
- `@ant-design/plots`
- React Router DOM
- Axios
- dayjs

Run the application:

```powershell
cd client
npm install
npm run dev
```

Build the application:

```powershell
cd client
npm run build
```

The project has no root `package.json`; npm commands must run from `client` or use `npm --prefix client`.

## 3. Architecture Rules

### 3.1 Dependency direction

```text
pages/components
  -> contexts/hooks/config
  -> services
  -> mockApi OR Axios
  -> future Express API
  -> future MSSQL
```

Allowed:

- Components call service functions.
- Services select mock mode or REST mode using `apiConfig`.
- `mockApi` reads and mutates `mockDatabase`.
- `api.js` owns the Axios instance.
- Contexts own cross-cutting state.
- Config files own shared application constants.

Forbidden:

- Components importing files from `src/mocks/`.
- Components calling Axios directly.
- Components calling `localStorage` directly.
- React code containing SQL queries.
- Frontend code storing passwords or backend secrets.
- UI code deciding whether mock mode or REST mode is active.
- Adding database code to make the mock application appear more complete.

### 3.2 State ownership

| State                       | Owner                               | Persistence                                                                    |
| --------------------------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| Authenticated user/session  | `AuthContext` and `authService`     | mock session uses `sessionStorage`; future backend owns secure cookies/session |
| Theme                       | `PreferenceContext`                 | `localStorage` through `preferenceService`                                     |
| Sidebar collapsed           | `PreferenceContext`                 | `localStorage` through `preferenceService`                                     |
| Compact mode                | `PreferenceContext`                 | `localStorage` through `preferenceService`                                     |
| Dashboard projects/entities | `Dashboard.jsx` after service calls | mock memory only until backend exists                                          |
| Form field values           | Ant Design `Form` inside form modal | temporary component state                                                      |
| API mode and URL            | `apiConfig.js`                      | Vite environment variables                                                     |

## 4. Application Entry And Routes

### `client/src/main.jsx`

Bootstraps React and renders `App` into the Vite root element. It imports global CSS.

### `client/src/App.jsx`

Owns only application composition:

- reads the selected preference theme
- applies `themeConfig` through Ant Design `ConfigProvider`
- applies semantic theme CSS variables
- mounts `BrowserRouter`
- mounts `AuthProvider`
- declares public/protected routes

It must not contain dashboard implementation or service calls.

### `client/src/components/ProtectedRoute.jsx`

Reads `useAuth()`. While auth is loading it renders a spinner. If no user exists, it redirects `/dashboard` to `/login`; otherwise it renders the nested route through `Outlet`.

### `client/src/components/PublicRoute.jsx`

Reads `useAuth()`. While auth is loading it renders a spinner. If a user exists, it redirects `/login` and `/register` to `/dashboard`; otherwise it renders the nested route.

### Routes

```text
/login       public
/register    public
/dashboard   protected
/*           redirects to /dashboard, then protection redirects unauthenticated users to /login
```

## 5. File Responsibility Map

### 5.1 Configuration

| File                           | Owns                                                                       | Used by                                          |
| ------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------ |
| `src/config/appConfig.js`      | application name, system name, version, environment                        | settings, report document, future metadata       |
| `src/config/apiConfig.js`      | `baseURL`, `useMockApi`, Axios timeout                                     | `api.js`, every service, settings API-mode label |
| `src/config/brandingConfig.js` | full logo, logo mark, product naming                                       | sidebar, reports, future branded screens         |
| `src/config/systemConfig.js`   | pagination, date format, project types, project statuses, payment statuses | project form, table, report filters              |
| `src/config/themeConfig.js`    | dark/light Ant Design tokens, component tokens, semantic CSS variables     | `App.jsx`, global theme styling                  |

`apiConfig.useMockApi` is true unless `VITE_USE_MOCK_API` is exactly the string `"false"`. With no `.env` file, the app therefore defaults to mock mode.

### 5.2 Contexts and hooks

| File                                | Responsibility                                            | Important relationship                                                         |
| ----------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `src/context/AuthContext.jsx`       | user, auth loading, login, logout, register, current user | calls `authService`; consumed by route guards, login, header, settings         |
| `src/context/PreferenceContext.jsx` | theme, sidebar state, compact mode                        | calls `preferenceService`; consumed by `App`, `AppLayout`, `Sidebar`, settings |
| `src/hooks/useAuth.js`              | re-export/useAuth convenience hook                        | UI reads auth without importing context implementation                         |
| `src/hooks/usePreferences.js`       | re-export/usePreferences convenience hook                 | UI reads preferences without importing storage implementation                  |

Auth and UI preferences are intentionally separate. Logout clears the mock auth session but does not clear theme/layout preferences.

### 5.3 Layout components

| File                                       | Responsibility                                           | Inputs/outputs                                                                                         |
| ------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/components/layout/AppLayout.jsx`      | top-level protected dashboard shell                      | owns mobile drawer and settings drawer visibility; reads preferences; renders `Sider`, header, content |
| `src/components/layout/Sidebar.jsx`        | desktop navigation and mobile drawer menu                | calls parent callbacks for entity creation, reports, settings, logout; uses branding config            |
| `src/components/layout/Header.jsx`         | search, menu trigger, profile/dropdown, notifications UI | sends search text to dashboard; calls auth logout                                                      |
| `src/components/layout/SettingsDrawer.jsx` | functional settings UI                                   | calls `usePreferences`, displays auth/config state, calls logout                                       |

Required desktop structure:

```jsx
<Layout hasSider>
  <Layout.Sider />
  <Layout>
    <Header />
    <Content />
  </Layout>
</Layout>
```

Mobile uses the header menu trigger and Ant Design `Drawer`; it does not create a separate page layout.

### 5.4 Pages

| File                      | Responsibility                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/pages/Login.jsx`     | Ant Design login form, validation, mock/API auth call through `useAuth`, redirect to dashboard         |
| `src/pages/Register.jsx`  | registration form, password strength, confirmation validation, registration through `useAuth`          |
| `src/pages/Dashboard.jsx` | coordinates dashboard data, filters, modal visibility, service calls, user feedback; not a data source |

`Dashboard.jsx` owns the loaded arrays for projects, clients, packages, and services. It must declare all four state pairs because the project form and report filters consume all four.

### 5.5 Dashboard components

| File                                       | Responsibility                                                   | Must not own                         |
| ------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------ |
| `components/dashboard/StatCards.jsx`       | derive and display aggregate counts                              | API calls or mock imports            |
| `components/dashboard/Charts.jsx`          | derive chart datasets from passed projects                       | API calls or storage                 |
| `components/projects/ProjectTable.jsx`     | display/filter/paginate project rows and invoke action callbacks | mutations, API calls, mock imports   |
| `components/projects/ProjectFormModal.jsx` | create/edit project form and field conversion                    | persistence; calls `onSubmit` only   |
| `components/entities/EntityModal.jsx`      | client/package/service form UI                                   | persistence; calls `onSubmit` only   |
| `components/reports/ReportModals.jsx`      | report filter UI and printable report document                   | direct mock imports; report querying |
| `components/common/States.jsx`             | loading, empty, error presentation                               | data retrieval                       |
| `components/common/PageHeader.jsx`         | dashboard heading and new-project action                         | data retrieval                       |

### 5.6 Services

| File                         | Mock path                                        | REST path                                                          |
| ---------------------------- | ------------------------------------------------ | ------------------------------------------------------------------ |
| `services/api.js`            | not used for mock requests                       | configured Axios instance with credentials, timeout, and 401 event |
| `services/authService.js`    | `mockDatabase.users`, `sessionStorage`           | `/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout`        |
| `services/projectService.js` | `mockApi` resource `projects`                    | `/projects` CRUD                                                   |
| `services/clientService.js`  | delegates to `entityService` resource `clients`  | `/clients` CRUD through adapter                                    |
| `services/packageService.js` | delegates to `entityService` resource `packages` | `/packages` CRUD through adapter                                   |
| `services/serviceService.js` | delegates to `entityService` resource `services` | `/services` CRUD through adapter                                   |
| `services/entityService.js`  | selects `mockApi` resource operations            | generic Axios resource operations                                  |
| `services/reportService.js`  | lists projects through `mockApi`, then filters   | `/reports/projects` with filter parameters                         |

Dedicated service methods are the preferred public contract:

```text
projectService.getProjects()
projectService.getProject(id)
projectService.createProject(data)
projectService.updateProject(id, data)
projectService.deleteProject(id)

clientService.getClients()
clientService.getClient(id)
clientService.createClient(data)
clientService.updateClient(id, data)
clientService.deleteClient(id)

packageService.getPackages()
packageService.getPackage(id)
packageService.createPackage(data)
packageService.updatePackage(id, data)
packageService.deletePackage(id)

serviceService.getServices()
serviceService.getService(id)
serviceService.createService(data)
serviceService.updateService(id, data)
serviceService.deleteService(id)

reportService.getProjectReport(filters)
```

Legacy aliases such as `list`, `create`, `update`, and `remove` remain in some services for compatibility with current components.

## 6. Mock System

### Mock files

```text
client/src/mocks/
  data/users.js
  data/projects.js
  data/clients.js
  data/packages.js
  data/services.js
  mockDatabase.js
  mockApi.js
```

`mockDatabase.js` creates the in-memory store by cloning the data modules. `mockApi.js` is the temporary backend boundary and supports:

```text
list(resource)
get(resource, id)
create(resource, data)
update(resource, id, data)
remove(resource, id)
```

Mock mutations persist only for the current browser runtime. Refreshing the page restores the seed mock data. This is expected and is not a database bug.

### Mock auth

Development account:

```text
Email: admin@efxcreations.test
Username: admin
Password: Admin123!
```

This is development-only mock authentication. It is not production security. Passwords are not persisted. The future server must implement bcrypt, validation, authorization, session/token expiration, secure cookies, refresh rotation, throttling, CORS, security headers, and audit logging.

## 7. Feature Call Chains

### Initial dashboard load

```text
Dashboard useEffect
  -> projectService.list()
     -> projectService.getProjects()
        -> mockApi.list("projects") when mock mode is active
  -> clientService.getClients()
     -> entityService.list("clients")
        -> mockApi.list("clients")
  -> packageService.getPackages()
     -> entityService.list("packages")
        -> mockApi.list("packages")
  -> serviceService.getServices()
     -> entityService.list("services")
        -> mockApi.list("services")
  -> Dashboard stores four arrays
  -> StatCards, Charts, ProjectTable, forms render from props
```

If the load fails, `Dashboard` renders `ErrorState`. A missing state declaration in this load path previously caused the generic error; `packages` state is now declared and populated.

### Project create/update

```text
ProjectFormModal
  -> validates Ant Design Form
  -> converts dayjs values to API strings
  -> Dashboard.saveProject(values)
  -> projectService.createProject/updateProject
  -> mockApi.create/update OR Axios
  -> Dashboard updates local project list
  -> success message
```

The modal receives `confirmLoading={saving}` to prevent duplicate submissions.

### Project delete

```text
ProjectTable action
  -> Dashboard.deleteProject(project)
  -> projectService.deleteProject(id)
  -> mockApi.remove OR Axios DELETE
  -> Dashboard removes row
  -> success/error message
```

### Entity create

```text
EntityModal
  -> Dashboard.addEntity(values)
  -> clientService/packageService/serviceService create method
  -> entityService
  -> mockApi OR Axios
  -> Dashboard prepends returned entity to the matching select list
```

### Report generation

```text
ReportFilterModal
  -> Dashboard converts dayjs date range to YYYY-MM-DD
  -> reportService.getProjectReport(filters)
  -> mockApi.list("projects") and service-side filtering OR Axios GET /reports/projects
  -> Dashboard stores { projects, period, preparedBy, title }
  -> ReportPreviewModal renders a white report document
  -> browser window.print()
```

Supported report filters:

- report type
- date range
- status
- payment status
- client ID
- package ID
- project type at service level

The report preview intentionally stays white and printer-friendly even when the application theme is dark. Print CSS hides dashboard chrome and targets the report document for A4 output.

## 8. Theme, Branding, And Preferences

### Theme

`src/config/themeConfig.js` defines dark and light Ant Design token sets, component tokens, and CSS variable values. `App.jsx` passes the selected mode to `ConfigProvider` and synchronizes semantic variables in an effect.

Do not add component-level hardcoded palette values unless they are document/print colors or a chart library requires explicit series colors. Prefer the theme token or `--app-*` variable.

### Branding

`brandingConfig.js` imports:

- `assets/branding/efx-logo.svg` for expanded navigation/report branding
- `assets/branding/efx-logo-mark.svg` for collapsed navigation

Do not duplicate logo paths or product names in components.

### Preferences

`PreferenceContext` loads defaults through `preferenceService`, writes changed values through `preferenceService`, and applies `data-theme` / compact attributes to the document. Settings changes should update the visible UI immediately and survive refresh.

## 9. Data Model And Relationships

Projects use IDs for relationships and denormalized display names for the current UI:

```text
Project.clientId  -> Client.id
Project.packageId -> Package.id
Project.serviceId -> Service.id
```

Project shape:

```text
id
clientId, clientName
packageId, packageName
serviceId, serviceName
projectType
eventDate
startTime, endTime
location
status
paymentStatus
notes
createdAt, updatedAt
```

The future MSSQL schema should use foreign keys for the three ID relationships. Display names in the frontend are convenience fields and must not replace relationship IDs.

## 10. Backend Preparation

Backend placeholder: `server/README.md`.

Future structure:

```text
server/src/
  config/
  controllers/
  middleware/
  routes/
  services/
  validators/
  server.js
```

Future request flow:

```text
Route -> Controller -> Service -> MSSQL
```

Future auth flow:

```text
Auth route -> Auth controller -> Auth service -> bcrypt/session logic -> MSSQL
```

Database placeholders:

- `database/schema.sql`
- `database/seed.sql`

No frontend secret, JWT secret, database credential, or password belongs in a Vite environment variable.

When the backend is added, configure its port with `process.env.PORT || 5000` and its allowed frontend origins with a configured `CLIENT_URL`. Do not use wildcard CORS with authenticated requests.

## 11. Important Files At A Glance

```text
client/
  .env.example                         mock/API switch and API URL example
  package.json                          scripts and dependencies
  src/
    main.jsx                            React bootstrap
    App.jsx                             provider composition and routes
    index.css                           global theme, layout, responsive, print CSS
    App.css                             intentionally minimal; starter CSS removed
    config/                             application-owned constants and theme
    context/AuthContext.jsx             authentication state
    context/PreferenceContext.jsx       UI preference state
    hooks/                              context access helpers
    pages/Dashboard.jsx                 dashboard orchestration
    pages/Login.jsx                     login screen
    pages/Register.jsx                  registration screen
    components/layout/                  Sider, header, settings, app shell
    components/dashboard/               stats and charts
    components/projects/                project table and form
    components/entities/                client/package/service creation form
    components/reports/                 report filters and printable document
    components/common/                  page header and async states
    services/                           mock/API data access boundary
    mocks/                              temporary in-memory backend
    preferences/                        preference persistence implementation
    assets/branding/                    logo assets
server/README.md                        future Express plan
 database/schema.sql                    future MSSQL schema notes
 database/seed.sql                      future seed notes
```

## 12. Current Validation Evidence

Verified:

- `npm install` completed successfully.
- `npm run build` completed successfully after the latest dashboard fix.
- Editor diagnostics report no errors in the dashboard, service, mock, and configuration paths.
- The app uses mock mode by default when no `.env` override exists.
- Vite successfully resolves the mock imports during production build.
- Ant Design Drawer and Alert deprecation warnings were removed from application source.
- The missing `packages` state that caused `Unable to load workspace data.` was restored.

Build warning:

- Vite reports a large vendor bundle caused by Ant Design and chart dependencies. This is a warning, not a build failure.

Not yet automated:

- Browser-level login/logout test
- Browser-level theme persistence test
- Browser-level CRUD test
- Browser print-preview verification across multiple pages/viewports

A direct plain-Node import of `mockApi.js` is not a valid test for this Vite project because Vite source imports intentionally omit `.js` extensions. Use Vite build/runtime or browser tests for module resolution.

## 13. Known External Console Messages

Messages mentioning `contentscript.js`, `ObjectMultiplex`, `app-init-liveness`, `background-liveness`, or a closed asynchronous message channel originate from an injected browser extension/content script. They are not imports or runtime modules in this repository. Disable the responsible extension if those messages need to disappear.

## 14. Safe Next Steps

1. Keep mock mode enabled while the database/backend is unavailable.
2. Add browser tests around the current mock flows.
3. Add the Express API behind the existing service contracts.
4. Add MSSQL only on the server side after REST contracts are finalized.
5. Switch `VITE_USE_MOCK_API=false` only after the REST endpoints and authentication cookie/session behavior are available.
6. Do not rewrite UI components when replacing mock service implementations with Axios calls.

## 15. Instructions For The Next AI

- Read this file and the actual target source file before editing.
- Assume the database does not exist and preserve mock mode.
- Keep components unaware of whether data is mock or remote.
- Use `config/` for shared system values, `preferences/` for user UI settings, `mocks/` for temporary data/backend behavior, `services/` for data access, and `components/` for presentation.
- Prefer a focused edit followed immediately by a focused build or runtime check.
- Do not create a real database connection in the frontend.
- Do not expose passwords, tokens, or backend secrets.
- Do not remove compatibility aliases without checking current call sites.
