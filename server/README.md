# Poll Kholo Backend
## Overview
The backend of Poll Kholo is built using Express.js. It communicates with the MongoDB database via mongoose and has a robust rate limiting and fairness mechanism. It uses helmet for secure HTTP headers, and Socket.io for real-time updates.

## Features
The frontend of Poll kholo consists of the following features:
- Strong input validation
- Implements IP-based rate limiting 
- Uses Redis Adapter to forward events across multiple server instances, maintaining consistency
- Voting is handled using MongoDB transactions, which eliminates data inconsistency


## References
https://redis.io/glossary/rate-limiting/
https://redis.io/tutorials/howtos/ratelimiting/
https://oneuptime.com/blog/post/2026-02-02-redis-websockets-pubsub/view

## Usage
Clone the repository and navigate to the client directory using:
`cd server`

Run `npm install && npm run dev` and you'll see the server live on `http://localhost:5000` 

You can test the endpoints using tools like Postman or connect with the client locally.
 ## Environment variables
 Create a `.env` and add the following variables to it:
 PORT=5000
 MONGO_URI=< your mongodb connection string >
 CLIENT_URL=< client endpoint >
 REDIS_URL=< your redis connection endpoint >
 
