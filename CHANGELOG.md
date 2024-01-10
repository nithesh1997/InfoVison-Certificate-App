## v0.1.8

- **New** Custom SAN Can be approached with Separate DNS and IP fields
- **New** Introduced `CONTRIBUTING.md` and `README.md`
- Fix: Base Route Modification from `.env` for Other Teams
- Refactor: Customer Name is Changed to Username
- Refactor: Fully Qualified Domain Name Changed to User FQDN
- Feature: User FQDN will be prefilled once the username is entered and it can be modified
- Dev: Introduced `extensions.json` to recommend the extensions we use in VSCode
- Dev: Dynamic Forms Commits are commented on and will be released in the next version## v0.1.7
- Fix: Logout after session timeout throws in app error

## v0.1.7

- Fix: Logout after session timeout throws in app error

## v0.1.6

- Fix: Content Overflow trigger scroll
- `/invisigate-list` MSW Handler Fix
- Refactor styled-components to $Props
- Added `Controller` for Login page input fields
- Added **Issued At** i.e, `iat` and **Expire At** i.e, `exp`
- removed `roles` and checking only `role`
- replaced `jwt-decode` package with built in functions
- File Upload Pages support both DnD and Browse
- Logout API Added
- Update: Axios Interceptors for `403` Errors
- package.json update
  - homepage change
  - license field added

## v0.1.5

- **New** Loading Animation
- **New** Error Pages
- JWT Based Mock Payload for login API
- Disabled Unhandled request warning for MSW
- Typo in `FileFormatError.jsx`
- added addtional properties for `userStore`
- Fix: Where user able submit on file upload error (3 Pages)
- Added Utility function `decodeJWT` to decode tokens
- Working on new mechanism to load `userState` only from token
- Cleanup

## v0.1.4

- fix: Invisigate or Controller not sending `customSAN` in Request Payload

## v0.1.3

- fix: vulnerability on exposed login response payload
- style improvements
- fix: web address redirects to home instead of login on boot

## v0.1.2

- Form Submit Error Behaviour Fix
- React Hook Form in IEM, Active Directory DIA, InvisiGate/Controller
- Centralized Regular Expressions
- Response Payload Success and Error patches
- Response Notifier Style fixes

## v0.1.1

- TLDR; Code Organization
- React Hook Form
- Yup for Validation
- Partial MSW Supports for responses
- Session Timer
- `publish` script added to yarn to support app versioning

## v0.0.0

- Bundler - ViteJS
- Style - Material UI
- Style Engine - Styled Components
- State Management - Redux
- API - Axios
- Routing - React Router
- Formating - Prettier
