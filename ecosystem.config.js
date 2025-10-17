module.exports = {
  apps: [
    {
      name: "9001app-backend",
      script: "./backend/dist/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 5001
      }
    },
    {
      name: "9001app-frontend",
      script: "npm",
      args: "start",
      cwd: "./frontend",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};