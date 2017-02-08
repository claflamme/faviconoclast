'use strict';

const url = require('url');
const superagent = require('superagent');
const htmlparser = require('htmlparser2');

const validRelValues = [
  'apple-touch-icon',
  'apple-touch-icon-precomposed',
  'icon',
  'shortcut icon',
  'favicon'
];

function extractLinkNodes(text) {

  let linkNodes = [];

  const parser = new htmlparser.Parser({
    onopentag: (name, attributes) => {
      if (name !== 'link') {
        return;
      }
      const rel = attributes.rel.toLowerCase();
      // Only include <link> elements with icon-related "rel" values.
      if (validRelValues.includes(rel)) {
        linkNodes.push(Object.assign(attributes, { rel }));
      }
    }
  });

  parser.write(text);
  parser.end();

  // Sort <link> nodes so that "rel" values are in the same order as the
  // list of desired rel types.
  linkNodes.sort((a, b) => {
    let aRel = validRelValues.indexOf(a.rel);
    let bRel = validRelValues.indexOf(b.rel);
    return aRel - bRel;
  });

  return linkNodes.map( link => link.href );

}

function parseResults(pageUrl, cb, err, res) {

  if (err) {
    return cb(err);
  }

  const baseUrl = `${ res.request.protocol }//${ res.request.host }`;
  let linkNodes = extractLinkNodes(res.text);

  if (linkNodes.length > 0) {
    return cb(null, url.resolve(baseUrl, linkNodes[0]));
  }

  cb(null, url.resolve(baseUrl, 'favicon.ico'));

}

function getHostname(pageUrl) {

  if (!pageUrl.match(/^[a-zA-Z]+:\/\//)) {
    pageUrl = 'http://' + pageUrl;
  }

  const urlParts = url.parse(pageUrl);

  return `${ urlParts.protocol }//${ urlParts.hostname }`;

}

module.exports = (pageUrl, cb) => {

  const homepageUrl = getHostname(pageUrl);

  superagent.get(homepageUrl).end(parseResults.bind(null, pageUrl, cb));

};
