# E-Commerce Web App

This project is a Single Page Application (SPA) for managing an e-commerce product catalog. It's built with React.js and uses Zustand for state management.

## Features

- Display a list of products in a card layout
- Infinite scroll pagination
- Add new products
- Edit existing products
- Delete products
- Responsive design

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm/pnpm/yarn (i use pnpm)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/Rafly-Hidayat/E-Commerece.git
   ```

2. Navigate to the project directory:

   ```
   cd E-Commerece
   ```

3. Install the dependencies:
   ```
   pnpm install
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables:

   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```
   Replace the URL with the actual backend API URL if different.

## Running the Application

To run the development:

```
pnpm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To create a production build:

```
pnpm run build
```

This will create a `build` folder with the production-ready files.

## Technologies Used

- React.js
- TypeScript
- Zustand (State Management)
- Axios (API calls)
- Tailwind CSS (Styling)

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.
