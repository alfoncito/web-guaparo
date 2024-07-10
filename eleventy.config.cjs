const EleventyHtmlBasePlugin = require("@11ty/eleventy").EleventyHtmlBasePlugin;
const sass = require("sass");
const path = require("path");

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  let input = "src";

  eleventyConfig.addPassthroughCopy(`${input}/img`);
  eleventyConfig.addPassthroughCopy(`${input}/css`);
  eleventyConfig.addPassthroughCopy(`${input}/js`);
  eleventyConfig.addPassthroughCopy({
    "node_modules/bootstrap/dist/js/bootstrap.min.js": "js/bootstrap.js",
  });

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
