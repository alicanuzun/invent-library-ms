# Library Management System

This project is a simple library management system built with Express.js and TypeScript. It includes functionality for managing users, books, and borrow records, with caching implemented using Redis for efficient book viewing.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Redis Setup](#redis-setup)
- [Endpoints](#endpoints)
- [Running the Project](#running-the-project)

## Prerequisites

- Node.js (v14.x or later)
- PostgreSQL
- Redis

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/alicanuzun/invent-library-ms.git
    cd invent-library-ms
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

## Database Setup

1. Ensure PostgreSQL is installed and running on your system.

2. Create the necessary tables:

    ```sql
    CREATE TABLE users (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name text NOT NULL,
        created_dt timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE books (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name text NOT NULL,
        is_available boolean NOT NULL DEFAULT true,
        created_dt timestamp with time zone DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE borrows (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id),
        book_id integer NOT NULL REFERENCES books(id),
        borrow_date timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
        return_date timestamp with time zone,
        score integer
    );
    ```

3. Update the database connection settings in `./config/config.json` to match your PostgreSQL setup.

## Redis Setup

1. Ensure Redis is installed and running on your system. Follow the instructions below to install Redis.

### On macOS

Install Redis using Homebrew:

    ```sh
    brew install redis
    ```

### On Ubuntu

Install Redis using the package manager:

    ```sh
    sudo apt update
    sudo apt install redis-server
    ```

### On Windows

You can use the Windows Subsystem for Linux (WSL) to install Redis on Windows, or download the Redis setup from [Microsoft archive](https://github.com/microsoftarchive/redis/releases).

For WSL, you can follow the Ubuntu installation steps within your WSL terminal.

2. Start the Redis server:

### On macOS

    ```sh
    brew services start redis
    ```

### On Ubuntu

    ```sh
    sudo systemctl start redis
    sudo systemctl enable redis
    ```

### On Windows

If you used WSL, you can start Redis from the WSL terminal:

    ```sh
    redis-server
    ```

If you used the Redis setup for Windows, run Redis from the installed application.

3. Verify the Redis server:

    ```sh
    redis-cli
    ```

You should see a prompt like this:

    ```
    127.0.0.1:6379>
    ```

Type `ping` and press Enter. You should get a `PONG` response, indicating that the Redis server is running.

4. Install the Redis client for Node.js:

    ```sh
    npm install redis
    ```


## Running the Project

1. Start the Redis server on your local machine:

    ```sh
    redis-server
    ```

2. Start the PostgreSQL server on your local machine.

3. Start the Express.js server:

    ```sh
    npm start
    ```

The server should now be running on `http://localhost:3000`.

## Notes

- The project uses `express-validator` for request validation.
- Sequelize ORM is used for database interactions.
- The project uses TypeScript for type safety.



