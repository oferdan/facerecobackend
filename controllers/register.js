const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;

    if(!email || !name || !password){
        return res.status(400).json('incorrect form submission');
    }
    //pro objekt db
    // database.users.push({
    //     id: '125',
    //     name: name,
    //     email: email,
    //     entries: 0,
    //     joined: new Date()
    // })

    // async bcrypt
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    // });


    // sync bcrypt
    const hash = bcrypt.hashSync(password);

    //transkace, protoze musim insert do obou tabulek zaroven
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*') //vrati vsechny radky z DB
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        //res.json(database.users[database.users.length - 1]); //vrati posledni zaznam z pole objektu pro objekt DB
                        res.json(user[0]); //user=response //fix smazat
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => {
            return res.status(400).json('unable to register');
        }) //pokud bych vracel err, vypise vsechny udaje 
}

module.exports = {
    handleRegister: handleRegister
}