var express = require('express');
var router    = express.Router();
var upload    = require('./upload');
var mongoose  = require('mongoose');
var Photo     = mongoose.model('Photos');
var pathy = require('path');
//var manual_upload = require('./manual_upload')

var elementsToBeQueried = [];

async function passLabelsToQuery(labesToBePassed){
  elementsToBeQueried = await labesToBePassed;
  //return elementsToBeQueried;
}


/* GET home page. */
//also with the functionality of querying the database for images with simmilar labels
router.get('/', async function(req, res, next) {
    //elementsToBeQueried;
    if (Array.isArray(elementsToBeQueried) && elementsToBeQueried.length){
      console.log("Image to be queried!")
      console.log(elementsToBeQueried);
      //var str = elementsToBeQueried[1]);
      console.log(elementsToBeQueried[0]);
      console.log(elementsToBeQueried[1]);
      console.log(elementsToBeQueried[2]);
      console.log(elementsToBeQueried[3]);
      //console.log(elementsToBeQueried[4]);
      //console.log(elementsToBeQueried[5]);
      //tags: 
      Photo.find({labels: { $all: [elementsToBeQueried[0], elementsToBeQueried[1], elementsToBeQueried[2]] } }, ['path','caption'], {sort:{ _id: -1} }, function(err, photos) {
        res.render('index', { title: 'Files found based on given image', msg:req.query.msg, photolist : photos });      
      });
    }else{
      console.log("No image to be queried!")
      Photo.find({}, ['path','caption'], {sort:{ _id: -1} }, function(err, photos) {
        res.render('index', { title: 'Application Project', msg:req.query.msg, photolist : photos });      
      });
    }
    //do something    
  //}                
  //console.log(labels)
});


//function inspired by google vision API
//configure your google vision account for access to their API
async function detectLabels(fileName) {
    
  // [START vision_label_detection]
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // const fileName = 'Local image file, e.g. /path/to/image.png';
  // Performs label detection on the local file
 
  const [result] = await client.labelDetection(fileName);
  const labels = result.labelAnnotations;
  //console.log('Labels:');
  //labels//.forEach(label => console.log(label.description));
  
  return labels;
  // [END vision_label_detection]  
  //console.log('\n\n');

}

//function that creates and returns an array of given labels
async function goThroughElems(dtc){
    var elements = [];
    var i;
    for(i = 0; i < dtc.length; i++){
      elements.push(dtc[i].description);
    }
    return elements;
}
/*
a function that lists all the directories for the given path
const fs = require('fs')
async function ls(path) {
  const dir = await fs.promises.opendir(path)
  for await (const dirent of dir) {
    console.log(dirent.name)
  }
}
ls('.').catch(console.error)
*/
/*
//method for later update->not finished/working -> for bulk image annotation and data-base storing 
router.post('/manual_upload', function(req, res) {
        
//select directory
//the req will have to be treated as directory
//for each file from directory
  manual_upload(req, res, async(error) => {
      if(error){
        res.redirect('/?msg=3')
      }else{
        var i;
        for(i = 0; i < req.files.length; i++){
          if(req.files[i] == undefined){
            res.redirect('/?msg=2')
          }else{
            file_Name = req.files[i].path
            var fullPath = "files/"+req.files[i].filename;
 
            console.log("\n\n\n")
            console.log(fullPath)
            console.log("\n\n\n")
 
            const dtc = await detectLabels(file_Name)
            //const labls = dtc.labelAnnotations;
            
            //console.log("LALALALAL")
            console.log(dtc[0].description)
            console.log(dtc[1].description)
            console.log(dtc[2].description)
            //console.log(dtc.length)
            elems = await parcurgere(dtc);
            console.log(elems)
            elementsToBeQueried = elems;
            //elementsToBeQueried = await passLabelsToQuery(elems)
            //elementsToBeQueried = elems;
            var document = {
              path:     fullPath, 
              labels: elems,
              caption:   req.body.caption
            };
  
          var photo = new Photo(document); 
          photo.save(function(error){
            if(error){ 
              throw error;
            } 
            res.redirect('/?msg=1');
         });
          
        }
          
        }
      }
  });
});

*/

router.post('/upload', function(req, res) {
  //console.log(req)
  upload(req, res, async (error) => {
      if(error){
        res.redirect('/?msg=3');
     }else{
       if(req.file == undefined){
         
         res.redirect('/?msg=2');

       }else{
            
           /**
            * Create new record in mongoDB
            */
           file_Name = req.file.path
           var fullPath = "files/"+req.file.filename;

           const dtc = await detectLabels(file_Name)

           console.log(dtc[0].description)
           console.log(dtc[1].description)
           console.log(dtc[2].description)

           elems = await goThroughElems(dtc);
           console.log(elems)
           elementsToBeQueried = elems;

           var document = {
             path:     fullPath, 
             labels: elems,
             caption:   req.body.caption
           };
 
         var photo = new Photo(document); 
         photo.save(function(error){
           if(error){ 
             throw error;
           } 
           res.redirect('/?msg=1');
        });
     }
   }
 });  


});


router.post('/manual_upload', function(req, res) {

  upload(req, res, async (error) => {
      if(error){
        res.redirect('/?msg=3');
     }else{
       if(req.file == undefined){
         
         res.redirect('/?msg=2');

       }else{
            
           /**
            * Create new record in mongoDB
            */
           file_Name = req.file.path
           var fullPath = "files/"+req.file.filename;

           //console.log("\n\n\n")
           //console.log(fullPath)
           //console.log("\n\n\n")           
           //console.log("LALALALAL")
           //console.log(dtc[0].description)
           //console.log(dtc[1].description)
           //console.log(dtc[2].description)
           //console.log(dtc.length)
           elems = await parcurgere(dtc);
           //console.log(elems)
           elementsToBeQueried = elems;
           //elementsToBeQueried = await passLabelsToQuery(elems)
           //elementsToBeQueried = elems;
           var document = {
             path:     fullPath, 
             labels: elems,
             caption:   req.body.caption
           };
 
         var photo = new Photo(document); 
         photo.save(function(error){
           if(error){ 
             throw error;
           } 
           res.redirect('/?msg=1');
        });
     }
   }
 });  
});

module.exports = router;
