const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password){ //Adding form validation
   return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password); //hashing password
    db.transaction(trx => {
      //trx is used instead of db
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login') //into login table
      .returning('email')
      .then(loginEmail => { //loginEmail is diff name for email
        return trx('users') //NOW Inserting same info into users
          .returning('*')
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date()
          })
          .then(user => { //Using promise to get user name, email, profile, etc. 
            res.json(user[0]);
          })
      })
      .then(trx.commit) //Sends transaction through
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister: handleRegister
}