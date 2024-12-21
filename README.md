# Project Overview
This project demonstrates user management with caching and a focus on reliability using Docker Compose.

## Key Features
- **Services**: A Node.js API, MongoDB database, and Redis for caching.
- **Caching**: Implements caching for user-related data.
- **API Documentation**: Swagger is integrated to provide interactive API documentation.
- **Tests**: Comprehensive tests for the `UserService`.


## Environment Variables
The project uses environment variables for configuration. You can create a .env file in the root directory of the project and define the following variables:
```bash
PORT=3000                 # Port for the Node.js API
MONGODB_URI=mongodb://mongo:27017/userhub  # MongoDB connection URI
REDIS_URL=redis://redis:6379   # Redis connection URL
CACHE_EXPIRATION=3 # Time in seconds for cache expiration
REDIS_PORT=6379 # Redis connection Port
```
## Setup Guide

### Prerequisites
- Docker & Docker Compose installed.

### Steps to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/Herzawy/USERHUB.git
   cd USERHUB
   ```

### Start the services:
```bash
docker-compose up --build
```

### Access the API:

1. The API will be available at http://localhost:3000.
2. View Swagger documentation:
Visit http://localhost:3000/api-docs to explore the interactive API documentation.

### Testing
Enter the service container:
```bash
docker-compose exec app sh
```

### Run tests:
```bash
npm test
```

### Design Assumptions
1. Caching: Data is cached in Redis for performance; cache entries are invalidated or updated whenever user data is modified.
2. Decoupling: The cacheQueue ensures separation of caching logic and service operations.
3. API Documentation: Swagger simplifies API exploration and debugging.
4. Error Handling: Handles both system-level and logical errors for a robust API.
