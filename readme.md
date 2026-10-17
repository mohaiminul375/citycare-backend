# City Care

**"Find & List Rental Properties with Ease"**

---

## Project Overview

cityCare is a backend API for a City complaint and service request plat form. Where citizen can submit a complain and city Authority an fix and updating data throw the api's

---

## Roles & Permissions

| Role                 | Description                        | Key Permissions                                                      |
| -------------------- | ---------------------------------- | -------------------------------------------------------------------- |
| **Citizen**          | Citizen Submit a problem/complaint | Browse citizen own complaint update see status and payment           |
| **City Admin**       | City authority who solved Problem  | see list of complaint update status and assign staff                 |
| **Department Staff** | Department staff or technician     | see his own assignment update status after complete assignment       |
| **Admin**            | Platform moderators                | Manage all users, oversee all listings & requests, manage categories |

---

## Features

### Public Features

- NO public features

### Citizen Features

- Register and login as Citizen
- Submit service requests or complaint any city problem
- **Make payments via Bkash after service request is approved**
- View service request history (pending, approved, rejected, in_progress etc.)
- Manage profile

### City Admin Features

- Register and login and get role after admin approve
- reviewing complaint update status assigned staff

### Admin Features

- View all users
- Manage user status (ban/unban)
- View all listings of complaint
- Manage property categories

---

## API Endpoints

### Authentication

| Method | Endpoint                | Description                         |
| ------ | ----------------------- | ----------------------------------- | --- |
| POST   | `/api/v1/auth/register` | Register new user (tenant/landlord) | ❤️  |
| POST   | `/api//v1/auth/login`   | Login user, return JWT              | ❤️  |
| GET    | `/api/v1/auth/me`       | Get current authenticated user      | ❤️  |

### Citizen Management

| Method | Endpoint                       | Description                      |
| ------ | ------------------------------ | -------------------------------- | --- | --- | --- |
| POST   | `/api/v1/complaint`            | Create new Complaint             | ❤️  |
| GET    | `/api/v1/complaint/me/:id`     | Get MY(Citizen) complain list    | ❤️  |
| DELETE | `/api/v1/complaint/:id`        | Get MY(Citizen) complain Details | ❤️  |     | ❤️  |
| PATCH  | `/api/v1/complaint/update/:id` | Update a complaint               | ❤️  |

### City Admin

| Method | Endpoint                            | Description                    |
| ------ | ----------------------------------- | ------------------------------ | --- |
| PATCH  | `/api/v1/complaint/assignStaff/:id` | Assign a staff to a assignment | ❤️  |

### Payments (Bkash)

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| POST   | `/api/v1/payment/create` | Create a payment intent/session |
|  |

### Admin

| Method | Endpoint                 | Description                        |
| ------ | ------------------------ | ---------------------------------- | --- |
| GET    | `/api/v1/auth/all-user`  | Get all users                      | ❤️  |
| PATCH  | `/api/v1/auth/block/:id` | Update user status (block/unblock) | ❤️  |
| GET    | `/api/v1/auth/role/:id`  | Update User role                   | ❤️  |
| GET    | `/api/v1/complaint`      | Get all Complaint list             | ❤️  |

---

## Flow Diagrams
