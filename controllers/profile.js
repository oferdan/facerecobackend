const handleProfile = (req, res, db) => {
    const { id } = req.params;
    let found = false;
    db.select('*').from('users').where('id', id)
        .then(user => {
            //console.log(user);
            if (user.lenght) {
                res.json(user[0])
            } else {
                res.status(400).json('not found')
            }
        }).catch(err => res.status(400).json('error getting user'))
    //pro objekt DB
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         return res.json(user);
    //     }
    // })
    // if (!found) {
    //     res.status(404).json('no such user');
    // }
}

module.exports = {
    handleProfile: handleProfile
}