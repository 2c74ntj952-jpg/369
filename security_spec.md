# Security Spec for Firestore Security Rules

## Data Invariants
1. A plant record belongs to the user who created it (`userId == request.auth.uid`).
2. A task belongs to the user who created it (`userId == request.auth.uid`).
3. User profile stats are tied directly to the user's Auth UID (`docId == request.auth.uid`).
4. Read and list access is constrained strictly to the authenticated owner.

## Dirty Dozen Security Test Payloads
1. Unauthorized User Profile Creation for another UID
2. Modify another user's plant record
3. Unauthenticated Plant Write
4. Invalid plant ID injection (oversized junk payload)
5. Plant stage spoofing without authentication
6. Non-owner task deletion
7. Self-assigning elevated rights in user document
8. Overwriting plant owner ID (`userId`) on update
9. Exceeding field max lengths on plant notes
10. Blanket list query attempt on plants without `where('userId', '==', uid)`
11. Spoofing `createdAt` timestamp with client-controlled past time
12. Unauthenticated task list query

## Rule Validation Matrix
All security rules in `firestore.rules` strictly validate authentication (`request.auth != null`), owner authorization (`resource.data.userId == request.auth.uid`), document ID shapes, and schema field limits.
