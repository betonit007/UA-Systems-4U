const User = require('../models/user')
const { generateToken } = require('../utils/generateToken')

const authUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (user && (await user.matchPassword(password))) {

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            })

        } else {
            res.status(401).json({ msg: "Invalid email or password " })
        }

    } catch (error) {
      res.status(401).json({ msg: "Error logging in ", error})
    }
}

const registerUser = async (req, res) => {
    const { email, password, name } = req.body

    try {
        const userExists = await User.findOne({ email })

        if (userExists) {

            return res.status(400).json({ msg: "User already exists" })
        }

        const user = await User.create({
            name,
            email,
            password
        })


        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)


        })
    } catch (error) {
        res.status(400).json({ msg: "Invalid user data" })

    }
}

const getUserProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id)

        if (user) res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })

    } catch (error) {
        res.status(404).json({ msg: "Error with getting profile", error })
    }


}

const updateUserProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id)

        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            if (req.body.password) {
                user.password = req.body.password //user model alreay incrypts password (mongoose)
            }
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })

    } catch (error) {
        res.status(404).json({ msg: "Error with getting profile", error })
    }


}

const getUsers = async (req, res) => {

    try {
        const users = await User.find({})
        res.json(users)


    } catch (error) {
        res.status(404).json({ msg: "Error with getting users", error })
    }


}

const deleteUser = async (req, res) => {
    console.log('deleteUser called')

    try {
        const user = await User.findById(req.params.id)
        await user.remove()

        res.json({ message: 'User Removed From Database' })


    } catch (error) {
        res.status(404).json({ msg: "Error deleting User", error })
    }


}

const getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id).select('-password')

        if (user) {
            res.json(user)
        }

    } catch (error) {
        res.status(404).json({ msg: "User not found", error })
    }

}

const updateUser = async (req, res) => {
    console.log('correct controller', req.params.id)
    try {

        const user = await User.findById(req.params.id).select('-password')

        if (user) {
           user.name = req.body.name || user.name
           user.email = req.body.email || user.email
           user.isAdmin = req.body.isAdmin

           const updatedUser = await user.save()

           res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
           })

        }

    } catch (error) {
        res.status(404).json({ msg: "Error updating user", error })
    }

}

module.exports = { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser }