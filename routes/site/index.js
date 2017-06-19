let express = require('express');
let router = express.Router();

// GET the home page
router.get('/', function(req, res){
    let scope = {
        data: {
            title: 'Home',
            message: 'Hello!'
        },
        vue: {
            head: {
                title: 'Home'
            },
            components: ['mainMenu']
        }
    }

    res.render('index', scope);
});

module.exports = router;
