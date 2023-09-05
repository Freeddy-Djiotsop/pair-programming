const mongoose = require("mongoose");
const db = "mongodb://127.0.0.1:27017/ppa";

mongoose
  .connect(db)
  .then(() => console.log("DB ist Connect"))
  .catch((err) => console.error(err));

// Schema für Benutzer
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

// Schema für Projekte
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, require: true },
  lastModified: { type: Date, require: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
});

// Schema für Dateien
const fileSchema = new mongoose.Schema({
  path: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, require: true },
  lastModified: { type: Date, require: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
});

// Modelle aus den Schemas erstellen
const User = mongoose.model("User", userSchema);
const Project = mongoose.model("Project", projectSchema);
const File = mongoose.model("File", fileSchema);

module.exports = { User, Project, File };
