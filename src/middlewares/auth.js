const adminAuth = (req, res, next) =>{
  const isAdminAuthorized = "xyz"
  if(!isAdminAuthorized){
    res.status(401).send("Unauthorized accessed denied");
  }
  else{
    next();
  }
}

const userAuth = (req, res, next) =>{
  const token = "xyz"
  const isAdminAuthorized = token === "xyz"
  if(!isAdminAuthorized){
    res.status(401).send("Unauthorized accessed denied")
  }
  else{
    next()
  }
}

module.exports = {adminAuth, userAuth}