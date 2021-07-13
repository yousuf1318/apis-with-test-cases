const express = require('express')
const Ticket = require('../../models/Ticket')
const User = require('../../models/User')
const validation = require('../../middleware/validation/validation')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const userValidation = validation.userValidation
const openTicket = validation.openTicket

const router = express.Router()

//create a ticket
router.post('/ticket',async (req, res) => {
    console.log(typeof(req.body.is_booked))
    const payloadShcema = Joi.object({
        bus_Id: Joi.string().required(),
        seat_number: Joi.number().required(),
        userId: Joi.string().required() 
    })
    let payloadData = payloadShcema.validate(req.body)
    if (payloadData.error) {
        res.status(400).json({
            message: "Invalid payload",
            error: payloadData.error.message,
            status: 400
        })
    } else {
        payloadData = payloadData.value
    }
    try {
        const condition = {
            payloadData: payloadData
        
        
        }
   
        const isBooked = await Ticket.find({seat_number:req.body.seat_number})
        console.log(isBooked);
        if (isBooked.length > 0 ) {
            return res.status(409).json({
                message: "This seat is already booked! Please select other seat",
                status: 409
            })
        } else {
            const payload = {
                seat_number:req.body.seat_number,
                is_booked:true,
                userId:req.body.userId
               
            }

            const result = await Ticket.create(payload)
            console.log('result', result)

            res.status(201).json({
                message: "Ticket Booked successfully!",
                code: 201
            })
        }

    } catch (error) {
        console.error('Server Error', error);
        return res.status(500).json({
            message: "Internal server error!",
            status: 500
        })
    }

})

//update a ticket, update open/closed and user_details
// router.put('/ticket/:ticket_id', (req, res) => {
//     //check indempotency for ticket booking status
//     const { ticket_id } = req.params
//     const payload = req.body
//     let passenger = null

//     if ('passenger' in payload) {
//         passenger = req.body.passenger
//     }

//     if (payload.is_booked == true) {
//         Ticket.findById(ticket_id, function (err, ticket) {
//             if (err) res.status(404).json({ message: err })
//             if (ticket) {
//                 const user_id = ticket.passenger
//                 User.remove({ _id: user_id }, function (err) {
//                     if (err) {
//                         res.status(404).json({ message: err })
//                     }
//                     else {
//                         ticket.is_booked = payload.is_booked
//                         ticket.save()
//                             .then(data => res.status(200).json(data))
//                             .catch(err => res.status(404).json(err))
//                     }
//                 });
//             }
//         })
//     }

//     if (payload.is_booked == false && passenger != null) {
//         Ticket.findById(ticket_id, function (err, ticket) {
//             if (err) res.status(404).json({ message: err })
//             if (ticket) {
//                 const user = new User(passenger)
//                 user.save()
//                     .then(data => {
//                         ticket.passenger = data._id
//                         ticket.is_booked = payload.is_booked
//                         ticket.save()
//                             .then(data => res.status(200).json(data))
//                             .catch(err => res.status(404).json(err))
//                     })
//                     .catch(err => res.status(404).json({ message: err }))
//             }
//         })
//     }
// })

// edit details of a user 
// router.put('/user/:ticket_id', (req, res) => {
//     const { ticket_id } = req.params
//     const payload = req.body

//     Ticket.findById(ticket_id, function (err, ticket) {
//         if (err) res.status(404).json({ message: err })
//         if (ticket) {
//             const user_id = ticket.passenger
//             User.findById(user_id)
//                 .then(user => {
//                     if ('name' in payload) user.name = payload.name
//                     if ('sex' in payload) user.sex = payload.sex
//                     if ('email' in payload) user.email = payload.email
//                     if ('phone' in payload) user.phone = payload.phone
//                     if ('age' in payload) user.age = payload.age
//                     user.save()
//                         .then(data => res.status(202).json(data))
//                         .catch(err => res.status(404).json({ message: err }))
//                 })
//                 .catch(err => res.status(404).json({ message: err }))
//         }
//     })
// })

// get the status of a ticket based on ticket_id
router.get('/ticket/:ticket_id', (req, res) => {
    const { ticket_id } = req.params
    Ticket.findById(ticket_id, function (err, ticket) {
        if (err) res.status(404).json({ message: err })
        if (ticket) res.status(200).json({ status: ticket.is_booked })
    })
})

// get list of all open tickets
router.get('/tickets/open', (req, res) => {
    Ticket.find({ is_booked: false }, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
})

// get list of all closed tickets
router.get('/tickets/closed', (req, res) => {
    Ticket.find({ is_booked: true }, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
})

// View person details of a ticket
// router.get('/ticket/details/:ticket_id', (req, res) => {
//     const  ticket_id  = req.params.ticket_id
//     Ticket.findById(ticket_id, function (err, ticket) {
//         if (err) res.status(404).json({ message: err })
//         if (ticket) {
//             User.findById(ticket.passenger, function (err, user) {
//                 if (err) res.status(404).json({ message: err })
//                 if (user) res.status(200).json(user)
//             })
//         }
//     })
// })

// router.post('/tickets/reset', (req, res) => {

//     if (!("username" in req.body) && !("password" in req.body)) {
//         res.status(400).json({ message: "username and password is needed in request body" })
//     }

//     const { username, password } = req.body

//     if (!(bcrypt.compareSync(password, process.env.PASSWORD_HASH))) {

//     }
//     if (!(username === process.env.USER)) {
//         res.status(400).json({ message: "username is incorrect" })
//     }

//     Ticket.find({}, (err, data) => {
//         if (err) res.status(404).json({ message: err })
//         if (data) {
//             data.forEach(openTicket)
//             res.status(200).json({ message: "success" })
//         }
//     })

// })

module.exports = router