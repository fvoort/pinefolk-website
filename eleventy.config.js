export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/fonts": "fonts",
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
