# GPO Unified Nexus - Backend API Endpoints Mapping

This document maps the frontend requirements to the necessary backend REST API endpoints that need to be implemented.

## 1. Authentication & User Management

| Frontend Requirement | API Endpoint | Method | Description |
|---------------------|--------------|--------|-------------|
| User Registration | `/api/auth/register` | POST | Register new user with role (admin, supervisor, buyer, freelancer, supplier) |
| User Login | `/api/auth/login` | POST | Authenticate user and return JWT token |
| User Profile | `/api/users/profile` | GET | Get current user profile |
| Update Profile | `/api/users/profile` | PUT | Update user profile information |
| Get User by ID | `/api/users/:id` | GET | Get specific user details (admin only) |
| List Users | `/api/users` | GET | List all users (admin only, with filters) |

## 2. Group Management

| Frontend Requirement | API Endpoint | Method | Description |
|---------------------|--------------|--------|-------------|
| Create Group | `/api/groups` | POST | Create new group (pending approval) |
| List All Groups | `/api/groups` | GET | Get all public groups (with filters) |
| List My Groups | `/api/groups/my` | GET | Get groups created or joined by current user |
| Get Group Details | `/api/groups/:id` | GET | Get specific group details |
| Update Group | `/api/groups/:id` | PUT | Update group information (creator/admin only) |
| Join Group | `/api/groups/:id/join` | POST | Request to join a group |
| Leave Group | `/api/groups/:id/leave` | POST | Leave a group |
| Invite to Group | `/api/groups/:id/invite` | POST | Invite user to join group |
| Group Members | `/api/groups/:id/members` | GET | Get all members of a group |
| Update Member Role | `/api/groups/:id/members/:userId` | PUT | Update member role in group |

## 3. Supplier Offers

| Frontend Requirement | API Endpoint | Method | Description |
|---------------------|--------------|--------|-------------|
| List Open RQFs | `/api/supplier-offers/open-rqfs` | GET | Get all groups with open RQFs |
| Submit Offer | `/api/supplier-offers` | POST | Submit supplier offer for a group |
| Get Offer Details | `/api/supplier-offers/:id` | GET | Get specific offer details |
| List Group Offers | `/api/groups/:id/supplier-offers` | GET | Get all supplier offers for a group |
| Review Offer | `/api/supplier-offers/:id/review` | PUT | Admin review of supplier offer (approve/reject) |
| My Offers | `/api/supplier-offers/my` | GET | Get all offers submitted by current supplier |

## 4. Freelancer Applications

| Frontend Requirement | API Endpoint | Method | Description |
|---------------------|--------------|--------|-------------|
| List Open Missions | `/api/freelancer-applications/open-missions` | GET | Get all groups seeking freelancers |
| Submit Application | `/api/freelancer-applications` | POST | Submit freelancer application for a group |
| Get Application Details | `/api/freelancer-applications/:id` | GET | Get specific application details |
| List Group Applications | `/api/groups/:id/freelancer-applications` | GET | Get all freelancer applications for a group |
| Review Application | `/api/freelancer-applications/:id/review` | PUT | Admin review of freelancer application |
| My Applications | `/api/freelancer-applications/my` | GET | Get all applications submitted by current freelancer |

## 5. Voting System

| Frontend Requirement | API Endpoint | Method | Description |
|---------------------|--------------|--------|-------------|
| Create Vote | `/api/voting` | POST | Create new voting poll for a group |
| Get Vote Details | `/api/voting/:id` | GET | Get specific voting details |
| List Group Votes | `/api/groups/:id/voting` | GET | Get all votes for a group |
| Submit Vote | `/api/voting/:id/vote` | POST | Submit vote for a specific option |
| Get Vote Results | `/api/voting/:id/results` | GET | Get voting results (if completed or admin) |
| Activate Voting | `/api/groups/:id/activate-voting` | POST | Activate voting feature for a group |

## 6. Arbitration (ORDA)

| Frontend Requirement | API Endpoint | Method | Description |
|---------------------|--------------|--------|-------------|
| Request Arbitration | `/api/arbitration` | POST | Submit arbitration request |
| Get Arbitration Details | `/api/arbitration/:id` | GET | Get specific arbitration case details |
| List Group Arbitrations | `/api/groups/:id/arbitration` | GET | Get all arbitration cases for a group |
| Review Arbitration | `/api/arbitration/:id/review` | PUT | Admin review of arbitration case |
| Resolve Arbitration | `/api/arbitration/:id/resolve` | PUT | Resolve arbitration case |
| Freeze Group | `/api/groups/:id/freeze` | PUT | Freeze group activity during arbitration |
| Unfreeze Group | `/api/groups/:id/unfreeze` | PUT | Unfreeze group after arbitration |

## 7. Admin Dashboard

| Frontend Requirement | API Endpoint | Method | Description |
|---------------------|--------------|--------|-------------|
| Admin Dashboard Stats | `/api/admin/dashboard` | GET | Get admin dashboard statistics |
| Pending Group Approvals | `/api/admin/pending-groups` | GET | Get groups pending approval |
| Approve/Reject Group | `/api/admin/groups/:id/review` | PUT | Approve or reject group creation |
| Pending Supplier Offers | `/api/admin/pending-supplier-offers` | GET | Get supplier offers pending review |
| Pending Freelancer Applications | `/api/admin/pending-freelancer-applications` | GET | Get freelancer applications pending review |
| Pending Arbitration Cases | `/api/admin/pending-arbitration` | GET | Get arbitration cases pending review |

## 8. File Management

| Frontend Requirement | API Endpoint | Method | Description |
|---------------------|--------------|--------|-------------|
| Upload File | `/api/files/upload` | POST | Upload file (multipart/form-data) |
| Get File | `/api/files/:id` | GET | Get file by ID |
| Delete File | `/api/files/:id` | DELETE | Delete file by ID |

## 9. Notifications

| Frontend Requirement | API Endpoint | Method | Description |
|---------------------|--------------|--------|-------------|
| Get User Notifications | `/api/notifications` | GET | Get notifications for current user |
| Mark Notification Read | `/api/notifications/:id/read` | PUT | Mark notification as read |
| Mark All Read | `/api/notifications/read-all` | PUT | Mark all notifications as read |

## 10. Search & Filters

| Frontend Requirement | API Endpoint | Method | Description |
|---------------------|--------------|--------|-------------|
| Search Groups | `/api/search/groups` | GET | Search groups with filters |
| Search Users | `/api/search/users` | GET | Search users with filters (admin only) |
| Get Sectors | `/api/lookup/sectors` | GET | Get list of available sectors |
| Get Countries | `/api/lookup/countries` | GET | Get list of available countries |
