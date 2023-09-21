# Backend API Documentation

This is the documentation for the backend API of the application. This API provides endpoints for user management, authentication, and scheduling.

## Table of Contents

- [Introduction](#introduction)
- [Setup](#setup)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## Introduction

This backend API is built using Node.js and Express. It handles user registration, authentication, scheduling, and more. The API is structured using different classes for routes, controllers, services, repositories, and middleware.

## Setup

1. Clone the repository:

git clone https://github.com/Ro6son/barber-shop-schedule-backend.git
cd your-repo


2. Install dependencies:

npm install

3. Configure environment variables:
Create a `.env` file and add necessary environment variables.

- DATABASE_URL="file:./dev.db"
- AWS_ACCESS_KEY_ID = " "
- AWS_SECRET_ACCESS_KEY = " "
- AWS_REGION = 'us-east-1'
- ACCESS_KEY_TOKEN = " "

4. Start the server:

npm start


## Usage

The API provides various endpoints for user registration, authentication, scheduling, and more. You can make requests to these endpoints using tools like `curl`, Postman, or your frontend application.
1. Fetch all users by sending a GET request to `/users`.
2. Register a new user by sending a POST request to `/users`.
3. Authenticate a user and generate tokens by sending a POST request to `/users/auth`.
4. Refresh the access token using the refresh token by sending a POST request to `/users/refresh`.
5. Update user information by sending a PUT request to `/users`.
6. Delete a user by ID by sending a DELETE request to `/users/:id`.

## Endpoints

- `POST /users`: Register a new user.
- `POST /users/auth`: Authenticate user and generate tokens.
- `POST /users/refresh`: Refresh access token using refresh token.
- `PUT /users`: Update user information.
- `GET /users`: Fetch all users.
- `DELETE /users/:id`: Delete a user by ID.

## Middleware

- `AuthMiddleware`: Middleware for token-based authentication. Checks the validity of access tokens.

## Error Handling

The API handles errors using standardized error messages. If an error occurs, the API returns an appropriate HTTP status code along with an error message.

## Contributing

Contributions to improve the API are welcome! Please fork the repository, make your changes, and create a pull request. Ensure your code follows the established coding conventions and includes necessary tests.

---

Feel free to customize this `README.md` according to your project's structure and additional information. This template should give you a starting point to create a comprehensive README for your backend API.

