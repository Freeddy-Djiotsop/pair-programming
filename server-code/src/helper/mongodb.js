const mongoose = require("mongoose");
const { fileExtensions, onModel } = require("./codeBasic");
const db = "mongodb://127.0.0.1:27017/ppa";

mongoose
  .connect(db)
  .then(() => console.log("Server ist verbunden mit Datenbank"))
  .catch((error) => {
    console.log("Server ist NICHT verbunden mit Datenbank");
    console.error(error);
    throw error;
  });

// Schema für Benutzer
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

// Schema für Projekte
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, require: true },
  lastModified: { type: Date, require: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
});

// Schema für Ordner
const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, require: true },
  lastModified: { type: Date, require: true },
  projectOrParentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "onModel",
  },
  onModel: { type: String, required: true, enum: onModel },
  subfolders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
});

// Schema für Dateien
const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  extension: { type: String, required: true, enum: fileExtensions },
  content: { type: String, required: true },
  path: { type: String },
  createdAt: { type: Date, require: true },
  lastModified: { type: Date, require: true },
  projectOrFolder: { type: mongoose.Schema.Types.ObjectId, refPath: "onModel" },
  onModel: { type: String, required: true, enum: onModel },
});

fileSchema.methods.getName = function () {
  return `${this.name}.${this.extension}`;
};

const codeBasicSchema = new mongoose.Schema({
  extension: {
    type: String,
    required: true,
    enum: fileExtensions,
    unique: true,
  },
  content: { type: String, required: true },
});

// Modelle aus den Schemas erstellen
const User = mongoose.model("User", userSchema);
const Project = mongoose.model("Project", projectSchema);
const Folder = mongoose.model("Folder", folderSchema);
const File = mongoose.model("File", fileSchema);
const CodeBasic = mongoose.model("CodeBasic", codeBasicSchema);

module.exports = { User, Project, Folder, File, CodeBasic };
