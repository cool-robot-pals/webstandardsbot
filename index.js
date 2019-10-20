require('dotenv').config();

const fetch = require('node-fetch');
const convert = require('xml-js');
const randomItem = require('random-item');
const getTitleAtUrl = require('get-title-at-url');
const Twitter = require('twitter');

const client = new Twitter({
	consumer_key: process.env.TWITTER_CK,
	consumer_secret: process.env.TWITTER_CS,
	access_token_key: process.env.TWITTER_TK,
	access_token_secret: process.env.TWITTER_TS,
});

const frameworks = require('./frameworks.js');
const { stringys, extras } = require('./tweets.js');

const getPost = async () => {
	const map = await fetch(
		'https://developer.mozilla.org/sitemaps/en-US/sitemap.xml'
	)
		.then(r => r.text())
		.then(t => convert.xml2js(t, { compact: true }))
		.then(j =>
			j.urlset.url.map(u => u.loc._text).filter(u => u.includes('Web/'))
		);

	const item = randomItem(map);
	const title = await new Promise(yay => {
		getTitleAtUrl(item, t => {
			yay(t);
		});
	});

	const sentence = randomItem(stringys)
		.replace('$1', randomItem(frameworks))
		.replace('$2', title);
	const leftExtra = Math.random() < 0.3 ? randomItem(extras) : null;
	const rightExtra = Math.random() < 0.3 ? randomItem(extras) : null;

	const post = [leftExtra, sentence, rightExtra, item].join(' ').trim();

	return post;
};

const tweet = status => {
	console.log(status);
	client.post('statuses/update', { status }, function(error, tweet, response) {
		if (error) throw error;
		console.log('tweeted');
	});
};

getPost().then(tweet);
