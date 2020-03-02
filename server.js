const express = require('express');
const mongoose = require('mongoose');
const shortURL = require('./models/shortURL');

const app = express();

mongoose.connect('mongodb://localhost/urlShortner',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});


app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));


app.get('/',async(req,res)=>{
    const shortURLs = await shortURL.find()
    res.render('index',{shortURLs:shortURLs});
})


app.post('/shortURL',async(req,res)=>{
   await shortURL.create({full:req.body.fullURL})
   res.redirect('/');
})

app.get('/:shortURL',async(req,res)=>{
   const ShortURL = await shortURL.findOne({short:req.params.shortURL}) 
    if(shortURL == null) return res.send(404)

    ShortURL.clicks++;
    ShortURL.save();

    res.redirect(ShortURL.full);
})

app.listen(process.env.PORT || 5000);