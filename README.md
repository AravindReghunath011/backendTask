# Product Inventory API

## Task 1: Build a RESTful API

### Objective
Create a simple CRUD (Create, Read, Update, Delete) API for managing a product inventory.

### Requirements
- Set up a Node.js project using Express.
- Create endpoints for:
  - Creating a new product.
  - Retrieving all products.
  - Retrieving a single product by ID.
  - Updating a product by ID.
  - Deleting a product by ID.
- Use a JSON file or an in-memory array to store the data.
- Implement error handling and input validation.

### API Endpoints

1. **Get All Products**
   - **URL:** `http://3.110.197.226/api/v1/task1/product/all`
   - **Method:** `GET`
   - **Description:** Retrieves a list of all products.

2. **Get Specific Product**
   - **URL:** `http://3.110.197.226/api/v1/task1/product?id=1`
   - **Method:** `GET`
   - **Description:** Retrieves a specific product by ID.

3. **Create a New Product**
   - **URL:** `http://3.110.197.226/api/v1/task1/product/create`
   - **Method:** `POST`
   - **Description:** Creates a new product.
   - **Example Request Body:**
     ```json
     {
       "name": "Product Name",
       "unit": 29,
       "description": "Product Description"
     }
     ```

4. **Update a Product**
   - **URL:** `http://3.110.197.226/api/v1/task1/product/update?id=1`
   - **Method:** `PUT`
   - **Description:** Updates an existing product by ID.

5. **Delete a Product**
   - **URL:** `http://3.110.197.226/api/v1/task1/product/delete?id=1`
   - **Method:** `DELETE`
   - **Description:** Deletes a product by ID.

---

## Task 2: Authentication and Authorization

### Objective
Implement user authentication using JWT (JSON Web Tokens).

### Requirements
- Create endpoints for user registration and login.
- On successful login, generate and return a JWT.
- Protect certain routes (e.g., `/profile`, `/settings`) to be accessible only to authenticated users.
- Validate the JWT on protected routes.

### API Endpoints

1. **User Registration**
   - **URL:** `http://3.110.197.226/api/v1/task2/user/register`
   - **Method:** `POST`
   - **Description:** Registers a new user.
   - **Request Body:**
     ```json
     {
       "name": "User Name",
       "email": "user@example.com",
       "password": "securepassword"
     }
     ```

2. **User Login**
   - **URL:** `http://3.110.197.226/api/v1/task2/user/login`
   - **Method:** `POST`
   - **Description:** Logs in an existing user and returns a JWT.
   - **Request Body:**
     ```json
     {
       "email": "user@example.com",
       "password": "securepassword"
     }
     ```

3. **Get User Profile**
   - **URL:** `http://3.110.197.226/api/v1/task2/user/profile`
   - **Method:** `GET`
   - **Description:** Retrieves the profile of the authenticated user.
   - **Headers:**
     ```
     Authorization: Bearer <access_token>
     ```

---

## Task 3: Data Fetching and Caching

### Objective
Fetch data from an external API and implement caching to optimize performance.

### Requirements
- Set up a route that fetches weather data from a public API.
- Cache the response for a specific duration (e.g., 10 minutes).
- Serve the cached response if available and valid; otherwise, fetch new data.

### API Endpoint

1. **Get Weather Data**
   - **URL:** `http://3.110.197.226/api/v1/task3/weather`
   - **Method:** `POST`
   - **Description:** Fetches weather data for a specified city.
   - **Request Body:**
     ```json
     {
       "city": "City Name"
     }
     ```
   - **Response:** Returns weather data for the specified city, caching the result for 10 minutes.

---

## Task 4: Database Integration

### Objective
Integrate a MongoDB database to store and retrieve data.

### Requirements
- Set up a Node.js project with a connection to a MongoDB database using Mongoose.
- Create a schema and model for a sample entity (e.g., products).
- Implement CRUD operations using the database.

### API Endpoints

1. **Get All Products**
   - **URL:** `http://3.110.197.226/api/v1/task4/product/all`
   - **Method:** `GET`

2. **Get Specific Product**
   - **URL:** `http://3.110.197.226/api/v1/task4/product?id=1`
   - **Method:** `GET`

3. **Update a Product**
   - **URL:** `http://3.110.197.226/api/v1/task4/product/update?id=1`
   - **Method:** `PUT`

4. **Delete a Product**
   - **URL:** `http://3.110.197.226/api/v1/task4/product/delete?id=1`
   - **Method:** `DELETE`

---

## Task 5: Real-time Features

### Objective
Implement real-time notifications using WebSockets.

### Requirements
- Set up a WebSocket server using Socket.IO.
- Create an endpoint for clients to connect to the WebSocket server.
- Implement a feature where connected clients receive real-time notifications when a specific event occurs (e.g., a new message is posted).

### Status
*Task incomplete.*

---

## Task 6: Error Handling and Logging

### Objective
Implement comprehensive error handling and logging.

### Requirements
- Set up global error handling middleware in an Express app.
- Implement different error classes for different types of errors (e.g., validation errors, database errors).
- Integrate a logging library (e.g., Winston) to log errors and other relevant information.

### Implementation
- Global error handling has been set up using Winston for logging.

---

