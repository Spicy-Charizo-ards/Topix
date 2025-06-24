const  User  = require ('../models/userModel'); //not yet defined
const bcrypt = require('bcryptjs'); //required for varifyUser function to hash the password

const userController = {

    async createUser(req, res, next) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ log: 'Username and Password are required' });
            }

            const admin = false;//remove this later. set admin as default false in model
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create ({username, hashedPassword, admin}); // change to a SQL call
            console.log(`User ${user.username} added`);
            res.locals.user = user;
            return next();

        } catch (err){
            console.log('Error saving user', err);
            res.status(400).json({
                err: err,
                log: 'Failed to save user to database'
            });
        };
    },
    
    async verifyUser(req, res, next) {
        try {
            const {username, password} = req.body;

            const user = await User.findOne({username: username}); //change to SQL
            if (!user) {
                return res.status(401).json({ log: 'User not found' });
            };
            const isMatch = await user.comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ log: 'Invalid credentials' });
            };

            console.log('User verified sucessfully');
            res.locals.user = user;
            return next();
            
        } catch (err) {
            console.error('Error verifying user:', err);
            return res.status(500).json({
                err,
                log: 'Internal server error during user verification',
            });
        };
    },
    
    
    async updateUser(req, res) {
        try {
            const { searchUsername } = req.params;
            const { username, password, admin } = req.body;

            const user = await User.findOne({ username: searchUsername}) //change to SQL

            if (!user) {
                return res.status(404).json({ log: 'User not Found' });
            };
            if (username) user.username = username;
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            };
              
            if (typeof admin !== 'undefined') user.admin = admin;

            const updatedUser = await user.save();
            console.log ('User has been updated');
            return res.status(200).json(updatedUser);
   
        } catch (err) {
            console.log('Error updating user:', err);
            return res.status(400).json({ 
                err: err, 
                log: 'No user found to update' 
            });
        };

    },



    async getUser(req, res) {
        try {
          const { username } = req.params;
    
          const user = await User.findOne({ username }); //change to SQL
          if (!user) {
            return res.status(404).json({ log: 'No Users found' });
          }
    
          console.log(`User ${user.username} found`);
          return res.status(200).json(user);
        } catch (err) {
          console.error('Error finding user:', err);
          return res.status(500).json({
            err,
            log: 'Failed to fetch user from the database',
          });
        }
    },



    async deleteUser(req, res, next) {
        try {
            const { username } = req.query;

            const result = await User.deleteOne({ username }); //change to SQL
            if (result.deletedCount === 0) {
                console.log('No user found');
                return res.status(404).json({ log: 'User not found. Failed to delete.' });
            }

            console.log(`User ${username} deleted`);
            return next();
        } catch (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({
            err,
            log: 'Failed to delete user from the database',
            });
        }
    },

    async getAllUsers(req, res, next) {
        try {
            const users = await User.find({}); //change to SQL

            if (!users) {
                return res.status(404).json({ log: 'Users not found' });
              }
            res.locals.users = users;
            return next();
        } catch (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({
            log: 'error occurred in userController.getAllUsers',
            error: err,
            });
        }
    },

};

module.exports = userController;