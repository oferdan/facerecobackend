const Clarifai = require('clarifai'); //npm install

const app = new Clarifai.App({
    apiKey: '01ff889243434b8cbd66e4cb5e00660a'
  });

const handleApiCall = (req, res) => {
    //presun z client side
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}
 

const handleImage = (req, res) => {
    const { id } = req.body;
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++;
    //         return res.json(user.entries);
    //     }
    //     if (!found) {
    //         res.status(400).json('not found');
    //     }
    // })
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            console.log(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}