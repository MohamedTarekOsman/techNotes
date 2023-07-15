const asyncHandler = require("express-async-handler");
const techNotesSchema = require("../models/techNotes.model");
const User =require('../models/user.model')
const getNotes = asyncHandler(async(req, res) => {
    const notes=await techNotesSchema.find().lean()
    if(!notes?.length){
        return res.status(400).send('NO Notes Found');
    }
    const notesWithUser =await Promise.all(notes.map(async(note)=>{
        const user=await User.findById(note.user).lean().exec()
        return {...note,username:user.username}
    }))

    res.status(200).send(notesWithUser)
})

const postNote = asyncHandler(async(req, res) => {
    const {user,title,text} = req.body
    if(!user||!title||!text){
        return res.status(400).send("All Fields are required");
    }
    const duplicate=await techNotesSchema.findOne({title}).collation({locale:'en',strength:2}).lean().exec()
    if(duplicate!==null){
        res.status(409).send("Dublicate note title")
    }
        
    const noteObject={user,title,text}
    
    const newNote= await techNotesSchema.create(noteObject)
    
    if(newNote){
        res.status(200).send("new note created successfully")
    }else{
        res.status(400).send("Invalied note data received")
    }
});

const getNote = asyncHandler(async(req, res) => {
    const {id} = req.body;
    if (!id) {
        return res.status(400).send("Note ID Required");
    }
    const note=techNotesSchema.findById(id).exec()
    if (!note) {
        return res.status(400).send("Note not found");
    }
    res.status(200).send(note)
});


const deleteNote=asyncHandler(async(req,res)=>{
    const {id} = req.body;
    if(!id){
        return res.status(400).send("Note ID Required")
    }
    const note=await techNotesSchema.findById({id}).lean().exec()
    if (!note) {
        return res.status(400).send("Note not found");
    }
    const result=await note.deleteOne()
    res.status(200).send(`Note ${result.title} with ID ${result._id} deleted`)
})

const updateNote=asyncHandler(async(req,res)=>{
    const {id,user,title,text,completed}=req.body

    if(!id||!user||!title||!text|| typeof completed!=='boolean'){
        return res.status(400).send("all fields are required")
    }

    const note=await techNotesSchema.findById({id}).lean().exec()
    if(!note){
        return res.status(400).send("note not found")
    }

    const dublicate=await techNotesSchema.findOne({title}).collation({locale:'en',strength:2}).lean().exec()
    if(dublicate&&dublicate._id.toString() !==id){
        return res.status(409).send("Duplicated note title")
    }

    note.user=user
    note.title=title
    note.text=text
    note.completed=completed

    await note.save()

    res.status(200).send(`${note.title} Updated`)

})

module.exports={
    getNotes,
    getNote,
    postNote,
    deleteNote,
    updateNote
}