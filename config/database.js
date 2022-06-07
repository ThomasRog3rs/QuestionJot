//When the application is live it should use the production database (currently on a free personal account, we should look into setting up a buisness account for when we start to scale the application)
if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb+srv://preplex-admin:<password>@preplex-prod.vl0q4cv.mongodb.net/?retryWrites=true&w=majority'}
}else{
  module.exports = {mongoURI: 'mongodb://localhost/preplex-poc-dev'}
}

