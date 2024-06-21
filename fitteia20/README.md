# Next.js Fitteia 2.0

Welcome to the Next.js Fitteia 2.0 project! This README will guide you through the steps to run the project locally on your machine.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

## Installation

1. **Clone the Repository:**

   Clone the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/mboliveira2003/nextjs_fitteia2.0.git
   ```

2. **Navigate to the Project Directory:**

   Change to the project directory:

   ```bash
   cd nextjs_fitteia2.0
   cd fitteia20
   ```

3. **Install Dependencies:**

   Install the required dependencies using npm:

   ```bash
   npm install
   ```

   Alternatively, if you prefer using [Yarn](https://yarnpkg.com/), you can install dependencies with:

   ```bash
   yarn install
   ```

## Running the Project

1. **Start the Development Server:**

   Start the local development server by running:

   ```bash
   npm run dev
   ```

   or if using Yarn:

   ```bash
   yarn dev
   ```

2. **Access the Application:**

   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

A quick overview of the project structure:

```
fitteia20/
├── components/       # Reusable components
├── pages/            # Pages of the application
│   └── api/          # API routes
├── public/           # Static files
├── styles/           # Global and component-specific styles
├── .gitignore        # Files to ignore in version control
├── package.json      # Project metadata and scripts
├── README.md         # Project documentation
└── next.config.js    # Next.js configuration
```

## Available Scripts

In the project directory, you can run the following scripts:

- `npm run dev` - Runs the app in development mode.
- `npm run build` - Builds the app for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Lints the project for potential issues.

## Contributing

We welcome contributions to this project! To contribute:

1. Fork the repository.
2. Create a new branch with your feature or bug fix.
3. Commit your changes and push the branch to your fork.
4. Open a Pull Request to the main repository.

Please ensure that your code follows the project's style guidelines and includes relevant tests.
