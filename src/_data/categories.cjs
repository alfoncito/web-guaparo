const fsp = require("fs/promises");

module.exports = async () => {
  let shopsInfoFile = "src/api/all-shops-info.json",
    uniqueCategories = new Set(),
    json = await fsp.readFile(shopsInfoFile, { encoding: "utf-8" }),
    shops = JSON.parse(json),
    result;

  shops.forEach((s) => uniqueCategories.add(s.category));
  result = Array.from(uniqueCategories);
  result = result.sort((ca, cb) => (ca < cb ? -1 : 1));
  return result;
};
