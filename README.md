# Classic Checkers Pro

A polished browser-based checkers game built with React, Vite, and a WebSocket multiplayer server. Play locally against a friend or the computer, or create an online room and invite a friend to play in real time.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB) ![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF) ![WebSocket](https://img.shields.io/badge/WebSocket-Real%20Time-010101)

## Overview

Classic Checkers Pro is a complete checkers implementation with:

- local pass-and-play mode
- computer opponent mode
- room-based online multiplayer using WebSockets
- rules validation for forced captures and king movement
- visual turn tracking, score feedback, and reset/replay controls
- customizable board themes and player settings

## Features

- Three game modes
  - vs Computer
  - Pass and Play
  - Invite Friends (online multiplayer)

- Standard checkers rules
  - 8x8 board with dark-square-only movement
  - regular pieces move diagonally forward
  - kings can move in both directions
  - captures are validated and mandatory when available
  - multiple jumps are supported in a single turn
  - promotion to king occurs on reaching the back rank
  - winner detection includes no remaining pieces and no legal moves

- UI and gameplay polish
  - clean card-based home screen
  - selected-piece and valid-move highlighting
  - real-time turn indicators and score tracking
  - winner overlay and menu reset flow
  - settings panel with board theme and color controls
  - room code generation and join flow for online play

- Multiplayer support
  - Node.js WebSocket server for creating and joining rooms
  - automatic room state syncing between players
  - disconnect handling and opponent leave detection

## Tech Stack

- React 19
- Vite 7
- WebSocket server using ws
- Lucide React icons
- Custom game engine in `src/lib/checkersCore.js`

## Prerequisites

- Node.js 18 or newer
- npm

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the Vite app:

```bash
npm run dev
```

3. Open the app in your browser:

```text
http://localhost:5173
```

4. For online multiplayer, start the WebSocket server in a second terminal:

```bash
npm run server
```

The multiplayer server listens on port `8080` by default. If needed, you can override it with:

```bash
WS_PORT=8080 npm run server
```

If your frontend is not using the default local server URL, set:

```bash
VITE_WS_URL=ws://localhost:8080
```

## Game Rules

1. Each player starts with 12 pieces on the dark squares of the first three rows.
2. Blue pieces move upward toward the top of the board; Red pieces move downward toward the bottom.
3. Regular pieces move one diagonal square forward into an empty square.
4. Captures happen by jumping over an opponent's piece into an empty square beyond it.
5. If a capture is available, it must be taken.
6. When a piece reaches the far side of the board, it becomes a king.
7. Kings can move and capture in any diagonal direction.
8. The game ends when one player has no pieces left or cannot make a valid move.

## Controls

- Click a piece to select it.
- Click a highlighted destination square to move.
- Use the Rules button to review the rules.
- Use the Settings button to tweak themes and colors.
- Use Reset to restart the current game.
- Use Back to Menu to return to the mode selection screen.

## Project Structure

```text
classic-checkers-pro/
├── public/
├── server/
│   ├── checkersServer.test.js
│   └── websocket-server.js
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── BoardGrid.jsx
│   │   ├── CpuThinkingBadge.jsx
│   │   ├── GameHeader.jsx
│   │   ├── InviteFriendsScreen.jsx
│   │   ├── Rules.jsx
│   │   ├── ScoreBoard.jsx
│   │   ├── Settings.jsx
│   │   ├── StartScreen.jsx
│   │   └── WinnerOverlay.jsx
│   ├── lib/
│   │   └── checkersCore.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── vite.config.js
└── package-lock.json
```

## Validation and Testing

The game logic includes server-side checkers tests for board setup, movement validation, multi-jump logic, and winner detection.

Run the targeted checks with:

```bash
node --test server/checkersServer.test.js
```

Build the frontend with:

```bash
npm run build
```

## Notes

- The app's rule engine is centralized in `src/lib/checkersCore.js` to keep move validation, jump detection, king promotion, and winner logic consistent across local and online play.
- Multiplayer room flows are handled by the WebSocket server in `server/websocket-server.js` and are designed for same-browser or same-network play between two users.
- There is no formal license file in the repository yet, so usage rights should be confirmed before redistribution or commercial deployment.

## Acknowledgments

Built with React and Vite for a modern, lightweight browser game experience.
