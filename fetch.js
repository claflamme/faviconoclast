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

  let links = [];

  const parser = new htmlparser.Parser({
    onopentag: (name, attributes) => {
      if (name === 'link') {
        links.push(attributes);
      }
    }
  });

  parser.write(text);
  parser.end();

  return links.map((link) => {
    const newAttributes = { rel: link.rel.toLowerCase() };
    return Object.assign(link, newAttributes);
  });

}

function filterLinkNodes(linksArray) {

  return linksArray.filter((link) => {
    return validRelValues.some((rel) => {
      return rel === link.rel;
    });
  });

}

function parseResults(pageUrl, cb, err, res) {

  if (err) {
    return cb(err);
  }

  let links = filterLinkNodes(extractLinkNodes(res.text));

  links.sort((a, b) => {
    let aRel = validRelValues.indexOf(a.rel);
    let bRel = validRelValues.indexOf(b.rel);
    return aRel - bRel;
  });

  const baseUrl = `${ res.request.protocol }//${ res.request.host }`;
  const href = links[0] ? url.resolve(baseUrl, links[0].href) : '';

  cb(null, url.resolve(baseUrl, href));

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
