import nc from 'next-connect'

import notes from '../../../src/data/data';

const handler = nc()

.get((req, res)=>{
    res.json({ data: notes})
})

.post((req, res)=>{
    const note = { ...req.body, id: Date.now()};
    if(!note){
        return res.status(400).json({message: 'note cannot be empty'})
    }
    notes.push(note)
    console.log(notes)

    res.json({ data: note})
})

export default handler;