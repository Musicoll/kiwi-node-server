const path = require("path");
const expressVue = require("express-vue");

module.exports.setup = function(app) {
  //ExpressVue Setup
  const vueOptions = {
    rootPath: path.join(__dirname, "./"),
    template: {
      html: {
        start: "<!DOCTYPE html><html>",
        end: "</html>"
      },
      body: {
        start: "<body>",
        end: "</body>"
      },
      template: {
        start: '<div id="app">',
        end: "</div>"
      }
    },
    head: {
      title: "Kiwi",
      scripts: [
        {
          src:
            "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"
        },
        {
          src:
            "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.js"
        }
      ],
      styles: [
        { style: "/assets/styles/app.css" },
        {
          style:
            "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.css"
        }
      ]
    }
  };

  // @ts-ignore
  const expressVueMiddleware = expressVue.init(vueOptions);
  app.use(expressVueMiddleware);
};
