/* eslint-disable strict, import/no-extraneous-dependencies, radix */
/* eslint-disable no-underscore-dangle */

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

const CUSTOM_DIR = path.join(__dirname, 'custom');
const CUSTOM_FILES = fs.readdirSync(CUSTOM_DIR).map(f => f.replace('.svg', ''));

let glyphs = [];
let glyphDimensions = {};

/**
 * Download svg icons from payever ui-kit and transform to icon font
 */
gulp.task('svg', ['svg:convert'], () => {
  const glyphDictionary = {};
  glyphs.forEach((glyph) => {
    const dimensions = glyphDimensions[glyph.name] || {};
    const glyphMeta = {
      component: 'vector',
      source: { unicode: glyph.unicode[0] },
      style: {
        fontSize: parseInt(dimensions.width),
        fontFamily: 'payeverIcons',
      },
    };

    if (glyph.color && glyph.color !== 'black') {
      glyphMeta.style.color = glyph.color;
    }

    glyphDictionary[glyph.name] = glyphMeta;
  });

  const json = JSON.stringify(glyphDictionary, null, '  ');
  const filePath = path.join(
    __dirname, '..', '..', 'src', 'common', 'ui', 'Icon', 'vector.json'
  );
  fs.writeFileSync(filePath, json);
});

// @internal
gulp.task('svg:convert', () => {
  return makeSvgStream()
    .pipe(svgicons2svgfont({
      fontName: 'payeverIcons',
      normalize: true,
    }))
    .on('glyphs', g => glyphs = g)
    .pipe(svg2ttf())
    .pipe(gulp.dest('android/app/src/main/assets/fonts'))
    .pipe(gulp.dest('ios/PayeverMobile/StaticResources/Fonts'));
});

/**
 * Read svg from payever ui-kit and return Readable Stream
 * @return {Promise<Readable>}
 */
function makeSvgStream() {
  const stream = new Readable({ objectMode: true });
  const symbolsPromise = getPage(PAGE_URL)
    .then(extractSymbols)
    .then(wrapSvg)
    .then(addCustomIcons);

  let processing = false;

  stream._read = function read() {
    if (processing) {
      return;
    }

    symbolsPromise.then((symbols) => {
      symbols.forEach((symbol) => {
        stream.push(new File({
          cwd:      __dirname,
          base:     __dirname,
          path:     path.join(__dirname, symbol.id + '.svg'),
          contents: new Buffer(symbol.html),
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
        const [, , width, height] = $symbol.attr('viewbox').split(' ');
        const id = $symbol.attr('id');
        glyphDimensions[id] = { width, height };
        return {
          id,
          width,
          height,
          html: $.html($symbol),
        };
      });

    const symbols = $symbols.get()
      .filter(g => CUSTOM_FILES.indexOf(g.id) === -1);

    resolve(symbols);
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

function addCustomIcons(symbols) {
  return new Promise((resolve, reject) => {
    try {
      CUSTOM_FILES.forEach((id) => {
        const html = fs.readFileSync(path.join(
          CUSTOM_DIR, id + '.svg'),
          'utf8'
        );
        const [, width] = html.match(/width="(\d+)"/m);
        const [, height] = html.match(/height="(\d+)"/m);
        glyphDimensions[id] = { width, height };
        symbols.push({ id, html, width, height });
      });
      resolve(symbols);
    } catch (e) {
      reject(e);
    }
  });
}