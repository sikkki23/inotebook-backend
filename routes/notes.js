const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

//Route 4 fetch all user notes require authentication /api/notes/fetchallnotes
router.get('/fetchallnotes',fetchuser, async (req, res) => {
  const notes = await Note.find({user: req.user.id});   
  res.json(notes);
})

//Route 5 add note of user require authentication /api/notes/addnotes
router.post('/addnotes',fetchuser,  [
        body('title', 'Enter a title ').isLength({ min : 3}),
        body('description', 'Enter a valid description').isLength({ min : 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    {
      return res.status(400).json({errors:errors.array()});
    }
  try
  {
    console.log("call api add not backend");
  const {title,description,tag } = req.body;
  
  const note = new Note({
    title,description,tag,user:req.user.id
  })
  const saveNote = await note.save(); 
  return res.json(saveNote);
  }catch(error)
  {
    console.error(error.message);
    return res.status(500).json({error : "Some error occured!"})
  }

})

//Route 6 update user notes by userid require authentication /api/notes/updatenote/{id}
router.put('/updatenote/:id',fetchuser, async (req, res) => {
  const {title, description,tag } = req.body;
  const newnote = {};
  if(title){newnote.title = title};
  if(description){newnote.description = description};
  if(tag){newnote.tag = tag};

  let note = await Note.findById(req.params.id);
  if(!note) {return res.status(404).send("Not Found")}

  if(note.user.toString() !== req.user.id) 
    {return res.status(401).send("Not Allowed")}

  note = await Note.findByIdAndUpdate(req.params.id, {$set: newnote}, {new:true});
  return res.json({note});
})


//Route 7 delete user notes by userid require authentication /api/notes/deletenote/{id}
router.delete('/deletenote/:id',fetchuser, async (req, res) => {
  const {title, description,tag } = req.body;
 try
 {

 let note = await Note.findById(req.params.id);
 console.log("req.params.id:",req.params.id);
  if(!note) {return res.status(404).send("Not Found")}

  if(note.user.toString() !== req.user.id) 
    {return res.status(401).send("Not Allowed")}

  note = await Note.findByIdAndDelete(req.params.id);
  return res.json({"Success": "Note has been deleted" , note: note});
    }catch(error)
    {
      console.error(error.message);
      return res.status(500).json({error : "Some error occured!"})
    }
})

module.exports = router