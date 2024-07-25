const EleventyHtmlBasePlugin = require("@11ty/eleventy").EleventyHtmlBasePlugin;
const sass = require("sass");
const path = require("path");
const fsp = require("fs/promises");

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  let input = "src";

  eleventyConfig.addPassthroughCopy(`${input}/img`);
  eleventyConfig.addPassthroughCopy(`${input}/css`);
  eleventyConfig.addPassthroughCopy(`${input}/js`);
  eleventyConfig.addPassthroughCopy({
    "node_modules/bootstrap/dist/js/bootstrap.esm.min.js": "js/bootstrap.js",
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/bootstrap-icons/font/bootstrap-icons.min.css": `css/bootstrap-icons.css`,
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/bootstrap-icons/font/fonts": `css/fonts`,
  });

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compileOptions: {
      permalink(content, inputPath) {
        let fileName = path.basename(inputPath, ".scss");

        return `css/${fileName}.css`;
      },
    },
    compile(inputContent) {
      let result = sass.compileString(inputContent, {
        loadPaths: ["node_modules"],
      });

      return () => result.css;
    },
  });

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.on("eleventy.after", shopsInfoJsonSlice);

  eleventyConfig.setServerOptions({
    showVersion: true,
    port: 4321,
    onRequest: {},
  });

  return {
    dir: {
      input,
      output: "dist",
    },
  };
};

const shopsInfoJsonSlice = async ({ dir }) => {
  let input = `${dir.input}/api/all-shops-info.json`,
    output = `${dir.output}/api/all-shops-info.json`,
    json = await fsp.readFile(input, { encoding: "utf-8" }),
    shops = JSON.parse(json),
    allShopsDataShort = [];

  await fsp.mkdir(`${dir.output}/api`, { recursive: true });

  for (let shop of shops) {
    let shortShopData;

    shop.apiPath = `/api/${slug(shop.name)}.json`;
    shortShopData = cutShop(shop);
    allShopsDataShort.push(shortShopData);
    await fsp.writeFile(`${dir.output}${shop.apiPath}`, JSON.stringify(shop), {
      encoding: "utf-8",
    });
  }

  await fsp.writeFile(output, JSON.stringify(allShopsDataShort), {
    encoding: "utf-8",
  });
};

const slug = (text) => {
  return text.trim().toLowerCase().replace(/ /g, "-");
};

const cutShop = (shop) => {
  return {
    name: shop.name,
    logo: shop.logo,
    apiPath: shop.apiPath,
    category: shop.category,
  };
};
