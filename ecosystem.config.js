// ============================================================
//  SmartCar AI Platform — PM2 Ecosystem Config
//  Ishga tushirish: pm2 start ecosystem.config.js
//  To'xtatish:     pm2 stop all
//  Holat ko'rish:  pm2 status
//  Log ko'rish:    pm2 logs
// ============================================================

module.exports = {
  apps: [
    // ── 1. BACKEND (FastAPI / Uvicorn) ─────────────────────
    {
      name: "smartcar-backend",
      script: "venv\\Scripts\\python.exe",
      args: "-m uvicorn main:app --host 0.0.0.0 --port 8000 --reload",
      cwd: "./backend",
      interpreter: "none",
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: "5s",
      env: {
        NODE_ENV: "production",
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "../logs/backend-error.log",
      out_file: "../logs/backend-out.log",
    },

    // ── 2. FRONTEND (Next.js) ───────────────────────────────
    {
      name: "smartcar-frontend",
      script: "cmd.exe",
      args: "/c npm run dev",
      cwd: "./frontend",
      interpreter: "none",
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: "5s",
      env: {
        NODE_ENV: "development",
        NEXT_PUBLIC_API_URL: "http://localhost:8000",
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "../logs/frontend-error.log",
      out_file: "../logs/frontend-out.log",
    },
  ],
};
