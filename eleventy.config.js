import {IdAttributePlugin} from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(IdAttributePlugin, {
    selector: "h2,h3,h4,h5,h6"
  });

  eleventyConfig.addPassthroughCopy({
    "src/css/simple.min.css": "simple.min.css",
    "src/css/custom.css": "custom.css",
    "src/img": "img",
    "src/downloads": "downloads"
  });
}

export const config = {
  dir: {
    input: "src/content",
    includes: "../_includes",
    output: "dist"
  }
};
