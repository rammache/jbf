try {
  const app = require("./dist/server.js");
  module.exports = app.default || app;
} catch (error) {
  console.error("❌ Fatal error loading backend server:", error);
  const express = require("express");
  const fallback = express();
  fallback.all("*", (req, res) => {
    res.status(500).json({
      error: "Backend initialization failed",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  });
  module.exports = fallback;
}
