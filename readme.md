# CityCare
**A City Complaint & Service Request Management Platform**

---

## Project Overview

CityCare is a backend API for a city complaint and service request management platform. Citizens can submit complaints about problems in their city, while city authorities can review complaints, assign department staff, update service statuses, and manage resolutions through the API.

---

## Roles & Permissions

| Role | Description | Key Permissions |
|---|---|---|
| **Citizen** | A citizen who submits complaints | Create complaints, view own complaints and statuses, update eligible complaints, make payments, and manage profile |
| **City Admin** | An authorized city authority | Review complaints, approve or reject requests, assign department staff, and update complaint statuses |
| **Department Staff** | Department staff or technicians | View assigned complaints and update their progress and completion status |
| **Admin** | Platform administrator | Manage users, block/unblock accounts, manage categories, and oversee all complaints |

---

## Features

### Public Features
- No public features.

### Citizen Features
- Register and log in as a citizen.
- Submit service requests or complaints about city problems.
- Pay through bKash after a service request is approved.
- View complaint history and current statuses.
- Update complaints when permitted.
- Manage profile information.

### City Admin Features
- Register and log in.
- Obtain City Admin access after approval by the platform Admin.
- Review complaints and approve or reject requests.
- Assign department staff to approved complaints.
- Update complaint statuses.

### Department Staff Features
- View assigned service requests.
- Update assigned complaint progress.
- Mark assignments as completed after resolving the issue.

### Admin Features
- View all users.
- Block or unblock users.
- View all complaints.
- Manage complaint categories.
- Manage user roles and permissions.

---

## API Endpoints

### 1. Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a new citizen or user |
| POST | `/api/v1/auth/login` | Log in and receive authentication tokens |
| GET | `/api/v1/auth/me` | Get the current authenticated user's profile |

### 2. Citizen — Complaint Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/complaint` | Create a new complaint |
| GET | `/api/v1/complaint/me` | Get the authenticated citizen's complaints |
| PATCH | `/api/v1/complaint/update/:id` | Update an eligible complaint |

### 3. City Admin — Complaint Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/complaint` | View all complaints |
| PATCH | `/api/v1/complaint/status/:id` | Approve, reject, or update complaint status |
| PATCH | `/api/v1/complaint/assign-staff/:id` | Assign department staff to a complaint |

### 4. Department Staff — Assignments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/complaint/staff` | View complaints assigned to the logged-in staff member |
| PATCH | `/api/v1/complaint/staff/status/:id` | Update the status of an assigned complaint |

### 5. Payments — bKash

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/payment/create` | Create a bKash payment |
| GET | `/api/v1/payment/success` | Handle the payment success callback |
| GET | `/api/v1/payment/failure` | Handle the payment failure callback |
| GET | `/api/v1/payment/cancel` | Handle the payment cancellation callback |

*Note: The callback methods and paths should match the actual bKash integration and backend implementation.*

### 6. Admin — User Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/auth/all-user` | Get all users |
| PATCH | `/api/v1/auth/block/:id` | Block or unblock a user |
| PATCH | `/api/v1/auth/role/:id` | Update a user's role |

### 7. Admin — Category Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/category` | Create a complaint category |
| GET | `/api/v1/category` | Get all categories |
| PATCH | `/api/v1/category/:id` | Update a category |
| DELETE | `/api/v1/category/:id` | Delete a category |

---

## Complaint Status Workflow

```text
PENDING
   |
   +----> REJECTED
   |
   +----> APPROVED
              |
              v
      WAITING_FOR_STAFF
              |
              v
          ASSIGNED
              |
              v
         IN_PROGRESS
              |
              v
           RESOLVED
```

**Payment rule:** Citizens can pay through bKash only after a complaint has been approved. The backend must verify the payment result before marking the payment as paid.

---

## Security & Authorization

- Citizens can access and update only their own eligible complaints.
- City Admins can manage complaints within their authorized scope.
- Department Staff can view and update only their assigned complaints.
- Admin-only endpoints require Admin authorization.
- Request bodies must be validated before database updates.
- Complaint status transitions must follow the defined workflow.
- Payment status must be updated only after server-side payment verification.

---

## Notes

- All endpoints use the `/api/v1` prefix.
- Authentication and role-based authorization are required for protected routes.
- Endpoint names and HTTP methods should remain consistent with the implemented Express routers.
