const { codeSourceBasic, fileExtensions } = require("./helper/codeBasic");
const { CodeBasic } = require("./helper/mongodb");

for (const extension of fileExtensions) {
  const tmp = new CodeBasic({
    extension,
    content: codeSourceBasic[extension],
  });

  tmp
    .save()
    .then(() => {
      console.log(`${extension} Grundlage gespeichert.`);
    })
    .catch((error) => {
      if (!(error.code === 11000 || error.code === 11001)) {
        console.error(
          `Fehler beim Speichern der ${extension} Grundlage:\n`,
          error
        );
      }
    });
}
