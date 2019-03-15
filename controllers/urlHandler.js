const dns = require("dns");
const URL = require("../models/URL");

// Search for '://', store protocol and hostname+path
const protocolRegExp = /^https?:\/\/(.*)/i;

// Search for patterns like xxxx.xxxx.xxxx etc.
const hostnameRegExp = /^([a-z0-9\-_]+\.)+[a-z0-9\-_]+/i;

exports.addURL = (req, res) => {
	let url = req.body.url;

	// remove trailing "/"
	if (url.match(/\/$/i)) url = url.slice(0, -1);

	const protocolMatch = url.match(protocolRegExp);
  let hostAndQuery;

	if (!protocolMatch) {
    hostAndQuery = url;
    url = "https://" + url;
  }
  else {
    hostAndQuery = protocolMatch[1];
  }

	// const hostAndQuery = protocolMatch[1];
	const hostnameMatch = hostAndQuery.match(hostnameRegExp);

	if (hostnameMatch) {
		dns.lookup(hostnameMatch[0], err => {
			if (err) {
				// no DNS match, invalid Hostname, the URL won't be stored
				res.json({ error: "invalid Hostname" });
			} else {
				// check DB to see if URL is already stored
				URL.findOne({ url }, function(err, savedURL) {
					if (err) return;
					if (savedURL) {
						// URL is already in the DB, return the matched one
						res.json({
              original_url: savedURL.url,
              shurl_id: savedURL.index
            });
					} else {
            // create new URL entry
						const newURL = new URL({ url });
						// urlSchema pre hook will get or create counter, providing the URL index
						newURL.save(function(err, savedURL) {
							if (err) return;
							res.json({
								original_url: savedURL.url,
								shurl_id: savedURL.index
							});
						});
					}
				});
			}
		});
	} else {
		res.json({ error: "invalid URL" });
	}
};

exports.getURL = (req, res) => {
	const shurl = req.params.shurl;
	if (!parseInt(shurl, 10)) {
		// The short URL identifier is not a number
		res.json({ error: "Wrong Format" });
		return;
	}
	URL.findOne({ index: shurl }, function(err, data) {
		if (err) return;
		if (data) {
			// redirect to the stored page
			res.redirect(data.url);
		} else {
			res.json({ error: "No short url found for given input" });
		}
	});
};
