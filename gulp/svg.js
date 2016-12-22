'use strict';

const fs       = require('fs');
const path     = require('path');
const https    = require('https');
const Readable = require('stream').Readable;

const cheerio = require('cheerio');
const gulp    = require('gulp-task-doc');
const File    = require('vinyl');

const svgicons2svgfont = require('gulp-svgicons2svgfont');
const svg2ttf          = require('gulp-svg2ttf');

const PAGE_URL = 'https://payeverworldwide.github.io/';
const SVG_TEMPLATE = `
  <?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="{width}"
    height="{height}"
  >
    {symbol}
    <use xlink:href="#{id}" />
  </svg>
`;

let glyphs = [];
let glyphDimensions = {};

/**
 * Download svg icons from payever ui-kit and transform to icon font
 */
gulp.task('svg', ['svg:convert'], () => {
  const glyphDictionary = {};
  glyphs.forEach((glyph) => {
    const dimensions = glyphDimensions[glyph.name] || {};
    glyphDictionary[glyph.name] = {
      unicode: glyph.unicode[0],
      color: glyph.color,
      width: parseInt(dimensions.width),
      height: parseInt(dimensions.height),
    }
  });

  const json = JSON.stringify(glyphDictionary, null, '  ');
  const filePath = path.join(
    __dirname, '..', 'src', 'common', 'ui', 'Icon', 'map.json'
  );
  fs.writeFileSync(filePath, json);
});

// @internal
gulp.task('svg:convert', () => {
  return makeSvgStream()
    .pipe(svgicons2svgfont({
      fontName: 'payeverIcons',
      normalize: true
    }))
    .on('glyphs', g => glyphs = g)
    .pipe(svg2ttf())
    .pipe(gulp.dest('android/app/src/main/assets/fonts'))
    .pipe(gulp.dest('ios/PayeverMobile/Assets/Fonts'));
});

/**
 * Read svg from payever ui-kit and return Readable Stream
 * @return {Promise<Readable>}
 */
function makeSvgStream() {
  const stream = new Readable({ objectMode: true });
  const symbolsPromise = getPage(PAGE_URL)
    .then(extractSymbols)
    .then(wrapSvg);

  let processing = false;

  stream._read = function() {
    if (processing) {
      return;
    }

    symbolsPromise.then((symbols) => {
      symbols.forEach((symbol) => {
        stream.push(new File({
          cwd:      __dirname,
          base:     __dirname,
          path:     path.join(__dirname, symbol.id + '.svg'),
          contents: new Buffer(symbol.html)
        }));
      });
      stream.push(null);
    }).catch((e) => {
      process.nextTick(() => stream.emit('error', e));
    });

    processing = true;
  };

  return stream;
}

function getPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res
        .on('data', d => data += d)
        .on('end', () => resolve(data));
    })
      .on('error', reject)
      .end();
  });
}

function extractSymbols(html) {
  return new Promise((resolve) => {
    const $ = cheerio.load(html);
    glyphDimensions = {};

    const $symbols = $('svg[data-id^=icons] symbol')
      .map((i, element) => {
        const $symbol = $(element);
        const [,,width, height] = $symbol.attr('viewbox').split(' ');
        const id = $symbol.attr('id');
        glyphDimensions[id] = { width, height };
        return {
          width,
          height,
          id: id,
          html: $.html($symbol)
        };
      });

    resolve($symbols.get());
  });
}

function wrapSvg(symbols) {
  return new Promise((resolve) => {
    symbols.forEach((symbol) => {
      symbol.html = SVG_TEMPLATE
        .replace('{width}', symbol.width)
        .replace('{height}', symbol.height)
        .replace('{symbol}', symbol.html)
        .replace('{id}', symbol.id);
    });
    resolve(symbols);
  });
}