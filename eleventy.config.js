export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory('src/content');
  eleventyConfig.setOutputDirectory('dist');

  eleventyConfig.addPassthroughCopy({'src/fonts': 'fonts'});
}
