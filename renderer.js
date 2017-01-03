require('aurelia-pal-nodejs').initialize();

const Loader = new require('aurelia-loader-nodejs').WebpackLoader;
const PLATFORM = require('aurelia-pal').PLATFORM;
const DOM = require('aurelia-pal').DOM;
const jsdom = require('jsdom');
const bootstrap = require('aurelia-bootstrapper').bootstrap;

let doc = jsdom.jsdom(`
<!doctype html>
<html>
<head>
  <title>Aurelia Server-Render Test</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body aurelia-app="main">
</body>
</html>
`);

let entry = DOM.createElement("div");

const configure = async (aurelia) => {
  aurelia.use
    .standardConfiguration()
    //.developmentLogging(); //throws error: Cannot read property 'apply' of undefined
  await aurelia.start().then(a => a.setRoot('app', entry));
};

module.exports = async () => {
  // start aurelia
  try {
    await bootstrap(configure);
  } catch (err) {
    console.log(err);
  }

  // attach aurelia's output to the output body
  for (var child of entry.children) {
    doc.body.appendChild(doc.adoptNode(child));
  }

  let script = doc.createElement("script");
  script.setAttribute("src", "scripts/vendor-bundle.js");  
  script.setAttribute("data-main", "aurelia-bootstrapper");
  doc.body.appendChild(script);

  // serialise and return document
  return jsdom.serializeDocument(doc);
};