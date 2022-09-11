const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password){ //Adding form validation
    return res.status(400).json('incorrect form submission');
   }
  db.select('email', 'hash').from('login') //Retrieving hash from login table 
    .where('email', '=', email) 
    .then(data => {
      //Comparing stored hash in login SQL table to hash user inputs from req.body.password
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash); 
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0]) //Sending client user data if sign in successful , to be able to display the instant state of user data in app.js
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleSignin: handleSignin
}
