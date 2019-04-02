const handleSignIn = (req, res, db, bcrypt) => {
    // if (req.body.email === database.users[0].email &&
    //     req.body.password === database.users[0].password) {
    //     //res.json('success'); //zmena?
    //     res.json(database.users[0]);
    // } else {
    //     res.status(400).json('error logging in');
    // }
    // //res.json('signing');


    const { email, password } = req.body;

    if(!email || !password){
        res.status(400).json('incorrect form submission');
    }

    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            //console.log(data);
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if(isValid){
               return db.select('*').from('users')
                .where('email', '=', email)
                .then(users => {
                    console.log(users);
                    res.json(users[0])
                })
                .catch(err => res.status(400).json('unable to get user'))
            }
            res.status(400).json('wrong credentials')
        })
        .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
    handleSignIn: handleSignIn
}