let express = require('express')
let app = express()
const port = 8080;

app.set('view engine', 'ejs')

app.use('/assets', express.static('public'))

// home route
app.get('/', (request, response) => {
  response.render('pages/index', {title : 'Home'})
})

// api endpoint
app.get('/api/v1/documents', (request, response) => {
  response.setHeader('Content-Type', 'application/json');

  let documents = [
    {name: "jojo.kiwi", document_id : 1},
    {name: "zaza.kiwi", document_id : 2}
  ]

  response.send(JSON.stringify(documents))
})

app.listen(port, function () {
  console.log('Kiwi server listening on port ' + port + '!')
})
