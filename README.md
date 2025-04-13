# To Do App

An intuitive todo app with Eisenhower Matrix support for better task management, built with Electron and React.

## Features

- Frameless window design
- Eisenhower Matrix task organization
- Persistent storage of to-dos
- Cross-platform support (Windows, macOS, Linux)
- Custom window controls (minimize, maximize, close)

## Tech Stack

- Electron
- React
- TypeScript
- Vite
- SASS

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```git clone https://github.com/yourusername/todo-app.git
cd todo-app
```
2. Install dependencies
```npm install```

3. Start development server
```npm run dev```

### Building

To create a production build:
```npm run build```

The packaged application will be available in the `release` folder:
- Windows: `release/1.0.0/To Do-Windows-1.0.0-Setup.exe`
- macOS: `release/1.0.0/To Do-Mac-1.0.0-Installer.dmg`
- Linux: `release/1.0.0/To Do-Linux-1.0.0.AppImage`

## Releases

Stable releases are available on the [GitHub Releases page](https://github.com/katsofroniou/todo-app/releases). Each release includes:
- Windows installer (.exe)
- macOS disk image (.dmg)
- Linux AppImage

## Project Structure

todo-app/
├── electron/           # Electron main process code
├── src/               # React application source
├── public/            # Static assets

## License

[Apache License 2.0](LICENSE)

## Author
Katerina Sofroniou