# Chat application

Full-stack web application which allows users to communicate in real time.

## Features

- **User Registration/Login:** Users must register and login before they can start using the app.
- **User Authentication:** User authentication using session cookies.
- **Security:** Passwords are hashed.
- **User Interaction:** Users can send and accept friend requests to add other users to their friend list
- **Real-Time Messaging:** Using Socket.io, users can engage in real-time conversations.

## Tech Stack

- **Frontend:** The frontend is built using [React](https://reactjs.org/)
- **Backend:** The server-side logic is implemented with [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) is utilized as the database to manage and store user data, including friend lists, and message histories.

## API Best Practices and Lessons Learned

Below are some lessons learned from this project. I will also include some general reflections on the project. This is for my own benefit so I can take these lessons with me to future projects.

## API Best Practices

After completing this project and reflecting on the API design, below are some API best practices I should have followed when creating the API for this project:

### Endpoint Naming - Keep It Noun-based

Instead of using verbs in endpoints like [https://example.com/getPosts](https://example.com/getPosts) or [https://example.com/createPost](https://example.com/createPost), it's better to adopt a noun-based approach, such as [https://example.com/posts](https://example.com/posts).

### Consistency in Response Format

Use a predefined response format, such as [this example](https://gist.github.com/igorjs/407ffc3126f6ef2a6fe8f918a0673b59), offers API consumer predictability and makes interaction with the API more straightforward.

### Effective Use of HTTP Status Codes

Communicating using the appropriate HTTP status codes is crucial. Fortunately, the list of [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) is manageable, so selecting the right code for each scenario isn't a challenge.

### Leveraging Query Parameters

Utilizing query parameters in requests is a powerful way to enable sorting, filtering, and pagination of results. This flexibility greatly enhances the user experience.

### Generating Frontend Types with Swagger

Swagger has proven to be an invaluable tool for generating frontend types based on the API. Beyond types, it also serves as a useful tool for API documentation.

## General Reflections

Reflecting back on this project, below are some insights that can/should be applied to future projects:

- **Effective Planning**: Allocating more time for planning before diving into development would have paid off. This includes decisions on frontend design, database relationships, API endpoints, and the technology stack.

- **Prioritizing Frontend Design**: Giving ample thought to frontend design can significantly save time. I had to refactor the frontend due to intitially opting to not use a frontend library for example.

- **Thoughtful Database Design**: Careful consideration of database relationships can save a lot of trouble down the line. Investing time in designing the database schema can lead to more efficient data management.

- **Comprehensive API Endpoint List**: Creating a comprehensive list of API endpoints upfront can bring clarity to the project's scope and simplify development efforts.

- **Database Approach Consideration**: While embedding data within documents can simplify queries, it also introduces complexities when it comes to updating data in multiple places.

- **Use \_id**: Opting to work with unique IDs rather than other fields such as usernames in MongoDB would have made querying simpler and saved time. I read something about GDPR and IDs, but I'm not sure if that's relevant here.

- **Function Parameters Strategy**: I was quite unsure about wheter to use object destructuring or individual parameters in JavaScript functions. Combining both strategies is also a viable option, using object destructuring for optional parameters.

- **Comparing REST API, gRPC, tRPC, and GraphQL**: Each communication protocol has its strengths and drawbacks. While REST offers simplicity, it can result in overfetching/underfetching. gRPC, tRPC, and GraphQL offer alternative approaches with their own advantages.

- **CSS Modules for Styling**: Implementing CSS modules, such as `Home.module.css`, ensures styling is encapsulated and avoids clashes between class names in different components.

- **Data fetching**: Exploring technologies like SWR and React Query can simplify data fetching and caching.
