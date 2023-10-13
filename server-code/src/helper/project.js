const { User, Project, File, Folder, CodeBasic } = require("./mongodb");

const createProject = async (req, res) => {
  const fileName = "main";
  const { email, name, description, extension } = req.body;
  try {
    const owner = await User.findOne({ email }).populate("projects").exec();
    if (!owner) {
      return res.status(500).json({ error: { message: error } });
    }
    const project = new Project({
      name,
      description,
      createdAt: new Date(),
      lastModified: new Date(),
      owner: owner._id,
      folders: [],
      files: [],
    });

    const codeBasic = await CodeBasic.findOne({
      extension,
    });

    const file = new File({
      name: fileName,
      extension,
      content: codeBasic.content,
      createdAt: new Date(),
      lastModified: new Date(),
      projectOrFolder: project._id,
      onModel: "Project",
    });

    owner.projects.push(project._id);
    project.files.push(file._id);

    owner
      .save()
      .then(() => {
        return file.save();
      })
      .then(() => {
        return project.save();
      })
      .then((p) => {
        return res.json({
          name: p.name,
          id: p.id,
          message: `${p.name} erfolgreich gespeichert`,
        });
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { message: error } });
  }
};

const collectFilesAndFolders = async (id, path = "") => {
  const folder = await Folder.findById(id)
    .populate("files")
    .populate("subfolders")
    .exec();

  const currentPath = `${path}/${folder.name}`;

  const files = folder.files.map((file) => {
    return {
      id: file._id.toString(),
      path: currentPath,
      name: file.getName(),
      extension: file.extension,
      content: file.content,
      type: "file",
    };
  });

  const result = {
    id: folder._id.toString(),
    name: folder.getName(),
    path: currentPath,
    type: "subfolder",
    files,
  };

  const subResults = [];

  // Jetzt können Sie die Unterordner durchlaufen
  for (const subfolderId of folder.subfolders) {
    const subResult = await collectFilesAndFolders(subfolderId, currentPath);
    subResults.push(subResult);
  }

  result.subfolders = subResults;

  return result;
};

const getProjects = async (req, res) => {
  const { id, email } = req.query;
  try {
    if (id) {
      const project = await Project.findById(id)
        .populate("folders")
        .populate("files")
        .exec();
      const folders = [];
      console.log(project.folders.length);
      for (const folder of project.folders) {
        // const tmp = await collectFilesAndFolders(folder._id.toString());
        const tmpFolder = await Folder.findById(folder._id.toString())
          .populate("files")
          .populate("subfolders")
          .exec();
        const subfolders = [];
        const files = tmpFolder.files.map((file) => {
          return {
            id: file._id.toString(),
            path: "",
            type: "file",
            name: file.getName(),
            extension: file.extension,
          };
        });
        const tmp = {
          id: folder._id.toString(),
          name: folder.name,
          path: "currentPath",
          type: "subfolder",
          subfolders,
          files,
        };
        folders.push(tmp);
      }
      const files = [];
      for (const [index, file] of project.files.entries()) {
        const tmp = {
          id: file._id.toString(),
          path: "",
          type: "file",
          name: file.getName(),
          extension: file.extension,
        };
        if (index === 0) tmp.content = file.content;

        files.push(tmp);
      }

      return res.json({
        project: { name: project.name },
        files,
        folders,
        message: `Projekt ${id} gefunden`,
      });
    }
    if (email) {
      const owner = await User.findOne({ email }).populate("projects").exec();

      if (!owner) {
        throw `User ${email} not found`;
      }

      if (owner.projects.length === 0) {
        return res.json({
          projects: [],
          message: `${owner.projects.length} Projekt gefunden`,
        });
      }
      const projects = owner.projects.map((value) => {
        return { id: value._id.toString(), name: value.name };
      });
      return res.json({
        projects,
        message: `${projects.length} Projekt gefunden`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { message: error } });
  }
};

module.exports = { getProjects, createProject };
