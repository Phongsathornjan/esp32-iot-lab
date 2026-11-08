# NEXUS — ESP32 Interactive 3D IoT Lab

A frontend-only virtual electronics laboratory built with React, TypeScript, Vite, Tailwind CSS, React Three Fiber, Drei, Framer Motion, Zustand, Recharts, and Lucide.

## Run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Validate

```bash
npm test
npm run build
```

## Browser tests

On Windows PowerShell, install the project-local Chromium runtime once, then run the desktop and mobile workflows:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH=".playwright-browsers"; npx playwright install chromium
npm run test:e2e
```

The browser suite checks circuit modes, LED/relay synchronization, Wi-Fi lockout and reconnection, traffic sequencing, data-flow scenarios, lessons, quiz completion, mobile controls, screenshots, and console/page errors.

## Features

- Procedural interactive 3D ESP32 circuit with camera presets and component inspection
- Physical wiring, connection schematic, and live GPIO mapping views
- Live tabbed control deck beside the 3D bench for LED, dashboard, relay, and Wi-Fi controls
- Synchronized LED, relay, traffic-light, and GPIO controls with immediate 3D feedback
- Natural 1 Hz SHT31 simulation with target controls, charts, and history
- ESP32 WPA2 access-point and smartphone connection simulation
- Executable sensor/control data-flow scenarios
- Eight interactive lessons with local progress persistence
- Six-question quiz with explanations and final score
- Responsive layout, reduced-motion support, and WebGL fallback

All state and readings are local. No backend, account, physical hardware, or internet connection is required for simulation behavior. Google Fonts is optional; system fonts are used if it is unavailable.
