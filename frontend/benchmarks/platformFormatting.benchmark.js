const Benchmark = require('benchmark');
const { formatForTwitter } = require('../utils/platformFormatting.js');

const suite = new Benchmark.Suite();

suite
    .add('formatForTwitter', () => {
        formatForTwitter('This is a test tweet content.');
    })
    .on('cycle', (event) => {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ async: true });
