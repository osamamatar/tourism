const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const place = require('./models/place')
const methodOverride = require("method-override")
const port =process.env.PORT || 3000 
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/data/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
//connect to mongo db
const url = process.env.MONGODB_URI||'mongodb+srv://dbUser:12345@cluster0.uekuf.mongodb.net/tourism?retryWrites=true&w=majority'
mongoose.connect(url, { useUnifiedTopology:true,useNewUrlParser: true })
  .then(() => console.log(`Connected to DB...`));

const upload = multer({ storage: storage })
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(function (req, res, next) {
  res.locals.isAdmin = false;

  next();
});
app.get('/home', (req, res) => {
  place.find({}, (err, place) => {
    if (err) {
      
      res.redirect('/')
    } else {
     
      res.render('home', { place: place })
    }
  })

})

app.get('/gallery', (req, res) =>{
  place.find({}, (err, place) => {
    if (err) {
      console.log(err)
      res.redirect('/')
    } else {

      res.render('gallery', { place: place })
    }
  })
 
} )

app.get('/preview/:id', (req, res) => {
  place.find({_id:req.params.id}, (err, place) => {
    if (err) {
      console.log(err)
      res.redirect('/admin')
    } else {
      
      res.render('preview', { place: place })
    }
  })

})


app.get('/about', (req, res) => res.render('about'))

app.get('/map', (req, res) =>{
  place.find({}).select("_id").exec(
    (err,data)=>{
     
      res.render('map',{place:data});
    }
  )
   
 
})

app.get('/admin', (req, res) => {
  place.find({}, (err, place) => {
    if (err) {
      console.log(err)
      res.redirect('/')
    } else {

      res.render('admin', { place: place })
    }
  })


})

app.get('/', (req, res) => {
  res.render('landing')
})

app.delete('/place/:id', (req, res) => {

  place.findByIdAndDelete(req.params.id).exec((err,data)=>{
     if(err){
       console.log(err)
       res.redirect('/admin')
     }else{
       res.redirect('/home')
     }
  })
  
});
app.post('/places', upload.single('image'), function (req, res) {
  const len = req.file.path.length
  const pth = req.file.path.slice(7, len)
  let p = {
    name: req.body.name,
    descreption: req.body.descreption,
    builder: req.body.builder,
    location: req.body.location,
    image: pth
  }
  place.create(p, (err, place) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/home')
    }
  })


});
app.get('/place/:id', (req, res) => {
  place.find({_id:req.params.id}, (err, place) => {
    if (err) {
      console.log(err)
      res.redirect('/admin')
    } else {
      
      res.render('edit', { p: place[0] })
    }
  })
});
app.put('/places/:id', upload.single('image'), function (req, res) {
  const len = req.file.path.length
  const pth = req.file.path.slice(7, len)
  let p = {
    name: req.body.name,
    descreption: req.body.descreption,
    builder: req.body.builder,
    location: req.body.location,
    image: pth
  }
  place.findByIdAndUpdate(req.params.id,p, (err, place) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/home')
    }
  })


});

app.listen(port, () => console.log(`Example app listening on port port!`))