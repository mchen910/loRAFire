var express = require('express');
var subdomain = require('./middleware/subdomain')

const app = express();
const port = 3000;

var subRouter = express.Router();
var router = express.Router();

// API specific
subRouter.get('/', (req, res) => {
    res.send('API');
})


subRouter.get('/users', (req, res) => {
    res.json([
        { name: "Brian" }
    ]);
});

router.get('/', (req, res) => {
    res.send('Hello world!');
})

app.use(subdomain('api', subRouter));
app.use('/', router)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

