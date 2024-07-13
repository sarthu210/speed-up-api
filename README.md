# README.md

## Overview
This project is a Node.js application that utilizes Express.js for server-side logic, Axios for HTTP requests, and Redis for caching. The application serves data from an external API and implements caching to reduce redundant requests, improving performance and efficiency.

## Prerequisites
Ensure you have the following installed:
- Node.js
- npm (Node Package Manager)
- Redis server

## Installation

1. Clone the repository:
    ```sh
    git clone <repository_url>
    ```

2. Navigate into the project directory:
    ```sh
    cd <project_directory>
    ```

3. Install the required npm packages:
    ```sh
    npm install
    ```

4. Make sure your Redis server is running. You can start it using the command:
    ```sh
    redis-server
    ```

## Usage

1. Start the application:
    ```sh
    node app.js
    ```

2. The application will run on port 3000. Open your browser or use a tool like `curl` or Postman to make a GET request to:
    ```
    http://localhost:3000/get-data
    ```

## Endpoints

### GET /get-data

- **Description:** Fetches data from an external API and caches it using Redis. If the data is already cached, it returns the cached data.
- **Response:**
  - `200 OK`: Returns the data from the external API or cache.
  - `500 Internal Server Error`: If an error occurs while fetching the data or connecting to Redis.

## Code Explanation

- **Dependencies:**
  - `express`: For setting up the server and defining routes.
  - `axios`: For making HTTP requests to external APIs.
  - `redis`: For caching data to improve performance.

- **Setup:**
  ```js
  const port = 3000;
  const app = express();
  ```

- **Redis Client Initialization:**
  ```js
  let newclinet;
  (async () => {
      newclinet = redis.createClient();

      newclinet.on("error", (error) => {
          console.log(error);
      });
      await newclinet.connect();
  })();
  ```

- **GET /get-data Route:**
  ```js
  app.get("/get-data", async (req, res) => {
      try {
          const cacheData = await newclinet.get("getData");

          if (cacheData) {
              return res.status(200).json({ data: JSON.parse(cacheData) });
          }

          const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
          const getData = response.data;
          await newclinet.set("getData", JSON.stringify(getData));

          return res.status(200).json({data: response.data});
      } 
      catch (error) {
          console.error(error); 
          return res.status(500).json({ error: "not responding" });
      }
  });
  ```

- **Server Listening:**
  ```js
  app.listen(port, () => {
      console.log(`app is running on ${port}`);
  });
  ```

## Contributing

Feel free to submit issues or pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
