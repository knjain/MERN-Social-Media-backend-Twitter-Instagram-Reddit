const express = require("express");
const app = express();
const errorHandler = require("./middlewares/error.middleware");
const bodyParser = require("body-parser");

// Middleware for parsing request body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/auth.route");
const postRoutes = require("./routes/post.route");
const commentRoutes = require("./routes/comment.routes");
const userRoutes = require("./routes/user.routes");
const bannerRoutes = require("./routes/banner.route");
const bannerAwardsRoutes = require("./routes/bannerAwards.routes");
const reelRoutes = require("./routes/reels.routes");
const reelsCommentRoutes = require("./routes/reelsComment.routes");
const vision2047Routes = require("./routes/vision2047.routes");

// Endpoints
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/v1/bannerAwards", bannerAwardsRoutes);
app.use("/api/v1/reels", reelRoutes);
app.use("/api/v1/reelsComment", reelsCommentRoutes);
app.use("/api/v1/vision2047", vision2047Routes);

// Making public folder accessible
app.use("/public", express.static("public"));

// Error handling middleware

app.use(errorHandler);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error: ".concat(err) });
});

module.exports = app;
