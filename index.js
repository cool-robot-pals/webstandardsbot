const fetch = require('node-fetch');
const convert = require('xml-js');
const randomItem = require('random-item');
const getTitleAtUrl = require('get-title-at-url');

const frameworks = require('./frameworks.js');

const main = async () => {
	const map = await fetch(
		'https://developer.mozilla.org/sitemaps/en-US/sitemap.xml'
	)
		.then(r => r.text())
		.then(t => convert.xml2js(t, { compact: true }))
		.then(j =>
			j.urlset.url
				.map(u => u.loc._text)
				.filter(u => u.includes('Web/Web_Components') || u.includes('Web/API'))
				.filter(u => !u.includes('()'))
		);

	const item = randomItem(map);
	getTitleAtUrl(item, t => {
		console.log(`We dont need ${randomItem(frameworks)} now that we got ${t}`);
	});
};

main();
