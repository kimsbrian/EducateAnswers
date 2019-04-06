const express = require('express');
const router = express.Router();

//Answer Model
const Answer = require('../../models/Answer');

// @route    GET api/answers/:id
// @desc     Get Answer by URL
// @access   Public
router.get('/:id', (req, res) => {
    Answer.find({ url: req.params.id })
        .then(answers => {
            console.log('HOHO')
            if (!answers.length || answers[0].answer =='None') {      
                const run = require('../../scripts/puppet');
                console.log('HEHE')
                const nani = run(String(req.params.id))
                    .then(({question,answer,url}) => {
                        console.log('HEHE')
                        console.log(question)
                        return res.json({
                            question:question,
                            answer:answer,
                            url:url
                        })
                    }).catch((error) => {
                        console.log('NOOOOO')
                        return res.json('error')
                        return res.status(404).send();
                    });

                     
            }else{
                res.send(answers[0])
            }
        })
});


// @route    GET api/answers
// @desc     Get All Items
// @access   Public
router.get('/', (req, res) => {
    Answer.find()
        .then(answers => res.json(answers))
});

// @route    POST api/items
// @desc     Create A Item
// @access   Public
router.post('/', (req, res) => {
    const conditions = {
        url: req.body.url,
        answer: 'None'
    };

    const newAnswer = new Answer({
        question: req.body.question,
        answer: req.body.answer,
        url: req.body.url
    });

    Answer.findOneAndUpdate(conditions, req.body, { upsert: true, new: true, useFindAndModify: false },
        (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        });
});

// @route    DELETE api/items/:id
// @desc     Create An Item
// @access   Public
router.delete('/:id', (req, res) => {
    Answer.findById(req.params.id)
        .then(answer => answer.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
});



module.exports = router;