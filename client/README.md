# Poll Kholo Frontend
## Overview
The frontend of Poll Kholo is built on Next.js and uses Shadcn components to achieve the futuristic and elegant UI design. It consists of three pages, the home page, the create poll page, and the voting page. 

## Features
The frontend of Poll kholo consists of the following features:
- Futuristic UI
- Persistent storage of data using local storage on the create poll page
- Add/Delete options when creating polls
- Toasts used, to show proper error/success messages


## Components
The following Shadcn components have been used in the project:
- Background: https://reactbits.dev/backgrounds/light-rays
- Home page animations:
	- https://reactbits.dev/text-animations/split-text
	- https://reactbits.dev/text-animations/rotating-text
- Navigation bar: https://reactbits.dev/text-animations/shiny-text 
## Usage
Clone the repository and navigate to the client directory using:
`cd client`

Run `npm install && npm run dev` and you'll see the frontend live on `http://localhost:3000`
 ## Environment variables
 Create a `.env.local` and add the `NEXT_PUBLIC_API_URL` to connect to the server.
