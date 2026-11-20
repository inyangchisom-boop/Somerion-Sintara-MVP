# Somerion Sintara

**Connected Business. Simple Operations.**

Somerion Sintara is being developed under Somerion as a global business-operations integration platform.

## Current implementation status

This repository currently contains a responsive web interface and Firebase email/password authentication.

Implemented in the current code:
- Firebase email/password sign-in
- Firebase account registration
- Firebase password-reset email request
- Firebase sign-out
- Authenticated dashboard access through Firebase Auth state
- A per-user Firestore profile write using the authenticated user's UID

## Not implemented yet

The following are not currently working product features and must not be presented as active:
- Shopify, QuickBooks, Facebook, Instagram, or other third-party OAuth/API connections
- Business data synchronization
- Integration health monitoring
- Automated error detection or alerts
- Activity event collection
- AI diagnosis or automated repair
- Currency conversion or multi-currency transaction handling

The interface intentionally identifies these capabilities as unavailable until they are implemented and tested.

## Technology

- HTML, CSS, and JavaScript
- Firebase Authentication
- Cloud Firestore
- GitHub Pages for static web hosting

## Important deployment and security notes

- Firestore security rules must allow each authenticated user to read/write only their own `users/{uid}` profile document. The rules configured in the Firebase Console have not been verified from this repository.
- Firebase web configuration is client-side configuration, not a private service-account credential. Never put service-account keys, OAuth client secrets, or other private credentials in this public repository.
- Third-party integrations require a trusted backend for OAuth callbacks, secret storage, token refresh, access control, and API requests. A browser-only GitHub Pages site is not sufficient for those operations.

## Development stage

Early authenticated web foundation. This is not yet a production-ready integration platform.
