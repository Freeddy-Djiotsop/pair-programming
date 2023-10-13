const { onModel } = require("./codeBasic");
const { Project, File, Folder, CodeBasic } = require("./mongodb");

const getFile = async (req, res) => {
  const { id, email } = req.query;
  try {
    if (id) {
      const file = await File.findById(id);

      if (!file) throw `File mit id: ${id} nicht gefunden`;

      const tmp = {
        id: file._id.toString(),
        path: "",
        type: "file",
        name: file.getName(),
        extension: file.extension,
        content: file.content,
      };
      return res.json({
        file: tmp,
        message: `File ${id} gefunden`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { message: error } });
  }
};

const createFile = async (req, res) => {
  const { email, parentId, name, model, extension } = req.body;
  let parent;
  try {
    if (model === onModel[0]) parent = await Project.findById(parentId);
    else if (model === onModel[1]) parent = await Folder.findById(parentId);
    else throw `unknown onModel: ${model}`;

    console.log(parentId, model);
    if (!parent) {
      throw "File create, unkown error";
    }
    const codeBasic = await CodeBasic.findOne({
      extension,
    });

    const file = new File({
      name,
      extension,
      content: codeBasic.content,
      createdAt: new Date(),
      lastModified: new Date(),
      projectOrFolder: parent._id,
      onModel: model,
    });

    parent.files.push(file._id);

    parent
      .save()
      .then(() => {
        return file.save();
      })
      .then((f) => {
        return res.json({
          name: f.name,
          id: f.id,
          message: `${f.name} erfolgreich gespeichert`,
        });
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { message: error } });
  }
};

module.exports = { getFile, createFile };
