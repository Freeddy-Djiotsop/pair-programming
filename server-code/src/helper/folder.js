const { onModel } = require("./codeBasic");
const { Project, Folder } = require("./mongodb");

const getFolder = async (req, res) => {};

const createFolder = async (req, res) => {
  const { email, parentId, name, model } = req.body;
  let parent;
  try {
    if (model === onModel[0]) parent = await Project.findById(parentId);
    else if (model === onModel[1]) parent = await Folder.findById(parentId);
    else throw `unknown onModel: ${model}`;

    if (!parent) {
      throw "File create, unkown error";
    }

    const folder = new Folder({
      name,
      createdAt: new Date(),
      lastModified: new Date(),
      projectOrParentFolder: parent._id,
      onModel: model,
      subfolders: [],
      files: [],
    });

    if (model === onModel[0]) parent.folders.push(folder._id);
    else parent.subfolders.push(folder._id);

    parent
      .save()
      .then(() => {
        return folder.save();
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

module.exports = { getFolder, createFolder };
