const express = require('express');
const app = express()

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connect")
const Event = require('./models/event.models');

app.use(express.json())
initializeDatabase()
//const router = express.Router();

// get all events
async function readAllEvents(){
    try{
      const allEvents = await Event.find()
     return allEvents
    } catch (error){
      throw error
    }
  }
 app.get("/events", async (req, res) => {
  try{
    const events = await readAllEvents()
    if(events.length != 0){
      res.json(events)
    } else{
      res.status(404).json({error: "No Events found"})
    }
  } catch(error){
    res.status(505).json({error: "Failed to fetch the events."})
  }
 })

// get event by id
app.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create new event
app.post('/events', async (req, res) => {
  const event = new Event(req.body);
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// update
async function updateById(eventId, dataToUpdate){
    try{
     const updatedEvent = await Event.findByIdAndUpdate(eventId, dataToUpdate, {new: true})
     return updatedEvent
    } catch(error){
      console.log("There was an error", error)
    }
  }
  app.post("/events/:eventId", async (req, res) => {
    try{
     const updatedEvent = await updateById(req.params.eventId, req.body)
     if(updatedEvent){
      res.status(200).json({message: "Event updated successfully.", updatedEvent: updatedEvent})
     } else{
      res.status(404).json({error: "Event not found."})
     }
    } catch(error){
      res.status(500).json({error: "Failed to update Event"})
    }
  })

// Delete event
async function deleteEventById(eventId){
  try {
     const deletedEvent = await Event.findByIdAndDelete(eventId)
     return deletedEvent
  } catch(error){
    console.log("Error", error)
  }
}
app.delete("/events/:eventId", async (req, res) => {
  try {
    const deletedEvent = await deleteEventById(req.params.eventId)
    res.status(200).json({message: "Event deleted successfully."})
  } catch(error){
    res.status(500).json({error: "Failed to delete event."})
  }
})

const PORT = 3000
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`)
    })
