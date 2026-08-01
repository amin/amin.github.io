import path from "node:path";
import htmlmin from "html-minifier-terser";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import esbuild from "esbuild";
import * as sass from "sass";

export default async function (eleventyConfig) {
  // Static files that must land at the site root untouched. Without this they
  // never reach the output directory at all — nothing else copies them.
  eleventyConfig.addPassthroughCopy({
    "src/favicon.svg": "favicon.svg",
    "src/apple-touch-icon.png": "apple-touch-icon.png",
    "src/og.png": "og.png",
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg", "png"],
    inputDir: "src",
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    },
  });
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addTemplateFormats("js");
  eleventyConfig.addTransform("htmlmin", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });
  eleventyConfig.addExtension("js", {
    outputFileExtension: "js",
    useLayouts: false,
    compileOptions: {
      permalink(_, inputPath) {
        let parsed = path.parse(inputPath);
        if (parsed.name.startsWith("_")) return false;
        if (!inputPath.includes("src/assets")) return false;
        return `assets/js/${parsed.name}.js`;
      },
    },
    compile: async function (_, inputPath) {
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) return;

      return async () => {
        let result = await esbuild.build({
          entryPoints: [inputPath],
          bundle: true,
          minify: true,
          write: false,
        });
        return result.outputFiles[0].text;
      };
    },
  });

  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    useLayouts: false,

    compile: async function (inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return;
      }

      let result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || ".", this.config.dir.includes],
        style: "compressed",
      });

      this.addDependencies(inputPath, result.loadedUrls);

      return async (data) => {
        return result.css;
      };
    },
  });
  return {
    dir: {
      input: "src",
      output: "public",
      layouts: "_layouts",
      includes: "_includes",
    },
  };
}
