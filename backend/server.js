require("dotenv").config();

const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const eventTypeRoutes = require("./routes/eventTypeRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/event-types", eventTypeRoutes);
app.use("/availability", availabilityRoutes);
app.use("/bookings", bookingRoutes);
app.use("/meetings", meetingRoutes);
app.use("/settings", settingsRoutes);
app.use("/contact", contactRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ SlotSync API running at http://localhost:${PORT}`);
  console.log(`🔍 Health check → http://localhost:${PORT}/health`);
});
