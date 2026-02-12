# Task Manager App

**[Live Demo](https://task-manager-app-ah.vercel.app)** &nbsp;|&nbsp; **[GitHub](https://github.com/ahenderson316/task-manager-app)**

A full-stack task management application built with **Node.js**, **Express**, and **vanilla JavaScript**.

## Features

- Create, edit, and delete tasks
- Mark tasks as complete / incomplete
- Set priority levels (High, Medium, Low)
- Add due dates with overdue detection
- Filter by status and priority
- Live search across tasks
- Persistent storage via JSON file
- Clean dark-themed UI

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express
- **Storage:** JSON file (easily swappable for a database)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/task-manager-app.git
cd task-manager-app

# Install dependencies
npm install

# Start the server
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Project Structure

```
task-manager-app/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server.js
├── tasks.json        (auto-created on first run)
├── package.json
└── README.md
```

## License

MIT
