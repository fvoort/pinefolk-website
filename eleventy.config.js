export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"src/fonts": "fonts"});
}

export const config = {
  dir: {
    input: "src/content",
    includes: "../_includes",
    output: "dist"
  }
};
