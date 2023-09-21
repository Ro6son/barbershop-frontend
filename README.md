# Barbershop Frontend


## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This is the frontend repository of the Barbershop application. Barbershop is a scheduling system for barber shops, designed to facilitate the scheduling of haircuts for customers and manage available time slots for barbers.

## Key Features

- User authentication for platform access.
- Scheduling of available time slots.
- Viewing of upcoming scheduled appointments.
- Date selection for viewing specific time slots.
- Management of available time slots for barbers.

## Technologies Used

- React: A JavaScript library for building the user interface.
- React Router: Routing management in the application.
- React Hook Form: Form management.
- Yup: Library for data validation.
- Axios: HTTP client for making API requests.
- DayPicker: Component for date selection.
- CSS Modules: Encapsulated CSS styles in modules.
- Other project-specific dependencies.

## API Endpoints

- `GET /users`: Fetch all users.
- `POST /users`: Register a new user.
- `POST /users/auth`: Authenticate the user and generate tokens.
- `POST /users/refresh`: Refresh the access token using the refresh token.
- `PUT /users`: Update user information.
- `DELETE /users/:id`: Delete a user by ID.

## Usage

1. Fetch all users: Send a GET request to `/users`.
2. Register a new user: Send a POST request to `/users`.
3. Authenticate the user and generate tokens: Send a POST request to `/users/auth`.
4. Refresh the access token using the refresh token: Send a POST request to `/users/refresh`.
5. Update user information: Send a PUT request to `/users`.
6. Delete a user by ID: Send a DELETE request to `/users/:id`.

## Error Handling

- The API handles errors using standardized error messages. If an error occurs, the API returns an appropriate HTTP status code along with an error message.

## Contributing

Contributions to improve the frontend are welcome! Please fork the repository, make your changes, and create a pull request. Ensure that your code follows the established coding conventions and includes necessary tests.

## License

This project is licensed under the [MIT License](LICENSE).

## Login

![image](https://github.com/Ro6son/barbershop-frontend/assets/91978309/ec624d0f-ecce-4771-83ba-ba2830159797)

## Register

![image](https://github.com/Ro6son/barbershop-frontend/assets/91978309/a30b273d-a150-486b-9ec8-cae080b73deb)


