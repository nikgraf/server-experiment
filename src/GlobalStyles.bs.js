'use strict';

var Css = require("bs-css/src/Css.js");

function setup(param) {
  Css.$$global("html", /* :: */[
        Css.fontFamily("'Arvo', serif"),
        /* :: */[
          Css.fontSize(Css.px(28)),
          /* :: */[
            Css.lineHeight(Css.em(1.15)),
            /* [] */0
          ]
        ]
      ]);
  return Css.$$global("ul", /* :: */[
              Css.padding(Css.px(0)),
              /* :: */[
                Css.listStyleType(Css.none),
                /* [] */0
              ]
            ]);
}

exports.setup = setup;
/* Css Not a pure module */
