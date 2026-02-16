# Poll Kholo

## Overview

Poll Kholo is an advanced real-time polling platform that enables users to create real-time polls, and share them using shareable links, and vote anonymously. It uses the user's IP and device fingerprint to identify users individually and prevent voting abuse. It is integrated with rate limiting for both poll creation and voting to prevent rapid abuse.

## Images

![Home Page](client/public/polling1.png)
![Poll creation UI](client/public/polling2.png)
![Poll creation UI 2](client/public/polling3.png)
![Poll voting UI](client/public/polling4.png)
![Poll results UI](client/public/polling5.png)

## SYSTEM ARCHITECTURE

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js+Express
- **Real-time updates**: WebSockets
- **Database**: MongoDB Atlas
- **Rate limiting**: Redis
-

## `client` (Frontend)

Endpoints:

- `/create`
- `/poll/[id]`

It consists of the Poll creation and Vote handling UI, real-time result display (no refresh hassle needed), manages socket connection, device fingerprint generation, and shareable link generation.
A more detailed overview of the Frontend UI is in the root of the `client` directory.(along with documentation links and template links if you're interested)

## `server` (Backend)

Endpoints

- `POST /api/polls`
- `GET /api/polls/:id`
- `POST /api/polls/:id/vote`

It handles poll creation, voting, implements fairness mechanisms, rate limiting, atomic updates to database, real-time event broadcasting, and distributed socket scaling.
A more detailed overview of the Backend logic is in the root of the `server` directory. (it also includes documentation links and articles I've referred to for implementation)

## Database

The platform uses MongoDB as the database service. It mainly implements the following:

- Storing polls persistently
- Storing vote records persistently
- Atomic increment of votes
- Unique indexing for fairness enforcement

## Redis Cloud

It mainly provides distributed rate limiting, socket.io Redis Adapter (pub/sub) and supports horizontal scaling.

## Poll Creation Flow

The poll creation occurs as follows:

1. User submits question and options on the poll creation page.
2. Frontend sends `POST /api/polls`
3. Backend performs the following jobs:
   1. Validation of input (no duplication of options and minimum two options)
   2. Trim and sanitize input
   3. Generates unique `pollId` for the poll, and `optionId` for each individual option.
   4. Stores the poll in MongoDB
4. User is redirected to the voting page which displays the shareable link as well.

The poll is now persisted permanently.

## Voting Flow

The voting process occurs as follows:

1. Once the user is redirected to the voting page, they are allowed to vote only once, and once they've voted, they can only see the voting results.
2. They can share the poll link provided to them
3. The link is opened by a user
4. Frontend sends `GET /api/polls/:pollId` to fetch the poll.
5. User selects an option
6. Then Frontend sends `POST /api/polls/:pollId/vote` with the `optionId` and unique device fingerprint.
7. The Backend handles the voting logic in a MongoDB transaction (why it is used will be discussed later in the doc under implementation details). The following processes occur:
   1. Validating poll and option existence.
   2. Hashing the IP address
   3. Creating the vote record
   4. Atomically incrementing vote count
   5. Commiting the transaction

If any of the steps fail, the transaction is aborted and we rollback. This guarantees data integrity.

## What happens when the voting transaction is committed?

The following line in the code basically handles what happens after the vote is committed:

`io.to(pollId).emit("resultsUpdated", updatedPoll);`

So, all the users connected to that poll room receive the `resultsUpdated` event and frontend is updated immediately without needing to refresh the page.

# Implementation Details

## Distributed Architecture

Socket.io is implemented using the Redis Adapter.

**Why?**
Socket.io rooms work in memory by default. So, suppose you have multiple servers, that would mean that each server is storing is own list of connected users, joined rooms and socket ids. So the real-time events are broadcast to the user of that particular server instance. Redis solves this issue by forwarding emitted events across all the server instances.

## Anti-Abuse Mechanism

We use a three layer protection system. It is briefly described as follows:

**Layer 1 - IP-based uniqueness of votes**
We extract the IP address, hash it with SHA-256, and store it in the database. This prevents refresh abuse and voting repeatedly from the same network.

**Layer 2 - Device-based Fingerprints**
Every device that is used to vote generates a UUID, which is stored with the vote in the database. This prevents voting from incognito and voting multiple times from the same device.

**Distributed Rate Limiting using Redis**
We implement voting and poll creation rate limiting using `rate-limiter-flexible`

Vote limiting:

- 5 vote attempts per minute per IP per poll
- The key format is given as `vote:{pollId}:{hashedIp}`

Poll creation limiting:

- 3 polls per 10 minutes per IP

Since Redis is centralized, limits are consistent across all backend instances.

## Persistence Strategy

**Frontend Poll Creation UI**
We use local storage to store the poll details entered by the user, so that even if the page is refreshed, the user doesn't lose the entered data.

**Backend**
All data is stored in MongoDB.
The collections are as follows:

1. Poll Collection:
   - pollId
   - question
   - options[]
   - vote counts
   - createdAt
2. Vote Collection: - pollId - ipHash - fingerprint - votedAt
   The poll links are not session based, or stored in memory, hence they work indefinitely.

## Concurrency and Atomicity

Voting mechanism is implemented using MongoDB transactions, which use the `$inc` atomic operator.

This ensures that there's no race condition, no double increments, no partial voting, or data corruption of any other kind, even under simultaneous voting.

## Scalability Concerns

**Horizontal Scaling Ready**
It uses the Redis Adapter, Redis-based rate limiting, and MongoDB Atlas cluster.

Hence, it implements load balancing, which means multiple backend instances can run simultaneously without any consistency issues.

## Security Concerns

- Used Helmet for secure HTTP headers
- Used body size limits to prevent abuse
- Privacy concerns addressed by hashing IP before storage
- Strict validation of input
- Configured CORS for specific frontend origin
- Enabled `trust proxy` for correct IP detection behind load balancers

## User Experience

- A simple dark-themed futuristic UI with elegant animations for a pleasant experience
- Shareable Link copy button
- Instant feedback on vote
- Smooth poll creation and voting
- Real-time updates
- Persistent storage of poll data amid creation of poll

## Limitations

**Because voting is anonymous**:

- Users can use VPNs to change IP
- Users can clear local storage to change fingerprint
- Users can use multiple devices

True enforcement would require user authentication, but that was avoided intentionally to keep voting smooth.

**IP Fairness may have false positives**
If multiple users are connected to the same network, their public IP address is the same, and because only one vote is allowed per IP, this may block legitimate voters.

However, we have prioritized abuse-prevention over inclusivity.

This can be solved by giving small threshold overrides, combining behavioral detection, and using weighted trust models on a larger scale.

**Rate limiting is IP based**
This may cause shared networks to hit limits faster, and VPNs may bypass limits.

**Polls live forever**
There is no mechanism of poll expiry. Production-grade systems could implement poll expiry.

## Usage

The repository can be cloned using `git clone`. The `client` and `server` setup is defined in their specific Readme files.

# Summary

The system is a robust implementation of a simple voting platform. It not only provides a pleasant and elegant user experience, but also has a strong backend and abuse prevention mechanism. While it is robust for moderate-scale usage, implementing infrastructure-level security and behavioral detection would make it ready for a large-scale public deployment.
