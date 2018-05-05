/**
* @param context {WebtaskContext}
*/

const urlMetadata = require('url-metadata');
const cache = require('memory-cache');
const MONTH = 86400000 * 30;

module.exports = function(context, cb) {
    const url = context.query.url;
    if (!url) {
        return cb(null, {
            error: 401,
            message:
                'Please supply an URL to be scraped in the url query parameter.'
        });
    }

    const cachedResult = cache.get(url);
    if (cachedResult) {
        return cb(null, cachedResult);
    }

    try {
        urlMetadata(url).then(
            function(data) {
                cache.put(url, data, MONTH);
                cb(null, data);
            },
            function(error) {
                cb(null, error);
            }
        );
    } catch (err) {
        const data = {
            error: 500,
            message: `Scraping the open graph data from "${url}" failed.`,
            suggestion:
                'Make sure your URL is correct and the webpage has open graph data, meta tags or twitter card data.'
        };
        cb(null, data);
    }
};
