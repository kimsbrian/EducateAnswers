const run = require('./puppet');
const nani = run('843552')
.then(({question,answer}) => {
    console.log(question)
    console.log(answer)
});