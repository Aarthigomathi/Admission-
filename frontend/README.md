# Frontend shortcut for VS Code

The frontend source is maintained in `../admission-portal/client`. This folder is a small npm entry point so you can use the shorter `frontend` path from the repository root.

From the repository root in the VS Code terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

`npm.cmd install` installs the client dependencies in `admission-portal/client`. Vite prints the local URL (usually `http://localhost:5173`). To create a production build, run `npm.cmd run build` from this folder.

In Windows PowerShell, use `npm.cmd` if `npm` is blocked by the script execution policy. The Vite dev server proxies `/api`, `/uploads`, and `/socket.io` to `http://localhost:5000` by default. If your backend runs on another port, set `VITE_API_TARGET` in the process environment before starting Vite, for example `$env:VITE_API_TARGET = 'http://localhost:8080'`.
