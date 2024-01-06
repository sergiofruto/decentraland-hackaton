const fs = require("fs");
const path = require("path");
const sass = require("sass");
const nunjucks = require("nunjucks");
const minify = require("html-minifier").minify;

const srcDir = "./src";
const distDir = "./dist";

// Set up Nunjucks
nunjucks.configure({ autoescape: true });

// Function to compile Nunjucks templates
function compileNunjucks(src, data) {
  const template = nunjucks.compile(fs.readFileSync(src, "utf-8"));
  return template.render(data);
}

// Function to minify HTML
function minifyHtml(html) {
  return minify(html, {
    collapseWhitespace: true,
    removeComments: true,
  });
}

// Function to compile SCSS and save to file
function compileSass(src) {
  const result = sass.renderSync({ file: src });
  const css = result.css.toString();
  fs.writeFileSync(path.join(distDir, "styles.min.css"), css);
  return css;
}

// Function to build HTML from Nunjucks and SCSS
function buildHTML() {
  const pages = ["index.nunj"]; // Add your page names here
  const data = {}; // Add your data if needed

  pages.forEach((page) => {
    const nunjPath = path.join(srcDir, "templates", page);
    const sassPath = path.join(srcDir, "sass", "styles.scss");

    const html = compileNunjucks(nunjPath, data);
    const css = compileSass(sassPath);
    const minifiedHtml = minifyHtml(html);

    const distPath = path.join(distDir, page.replace(".nunj", ".html"));
    fs.writeFileSync(distPath, minifiedHtml);

    console.log(`Built: ${distPath}`);
  });
}

// Create distDir if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Build HTML
buildHTML();
