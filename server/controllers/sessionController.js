const Session = require('../models/sessionModel'); // not yet defined

const sessionController = {

    
  async isLoggedIn(req, res, next) {
    try {
      console.log(req.cookies);
      const session = await Session.findOne({cookieId: req.cookies.ssid}); //change to SQL
      
      if(!session){
        return res.status(400);
      }

      return next();
    } catch (err) {
      console.error('Error varifying session: ', err);
        return res.status(500).json({
          log: 'error occurred in sessionController.isLoggedIn',
          error: err,
        });
    }
  },


  async startSession(req, res, next) {
    const { _id } = res.locals.user;
    console.log (res.locals.user);

    try {
      console.log('Session being started for user: ', _id);
      const session = Session.create({cookieId: _id}); //change to SQL
      return next();

    } catch (err) {
      console.error('Error starting session: ', err);
      return res.status(500).json({
        log: 'error occurred in sessionController.startSession',
        error: err,
      });
    };
  },

  async endSession (req, res, next) {
    try {
      await Session.deleteOne({ CookieID: req.cookies.ssid}); //change to SQL
      res.clearCookie('ssid');
      console.log('Session ended');
      return next();

    } catch(err) {
      console.error('Error ending session: ', err);
        return res.status(500).json({
          log: 'error occurred in sessionController.endSession',
          error: err,
        });
    };
  },


  async getAllSessions (req, res, next){
    try {
      const sessions = await Session.find({}); //change to SQL

      if (!sessions) {
        return res.status(404).json({ log: 'Sessions not found' });
      }

      res.locals.sessions = sessions;
      return next();
    } catch (err) {
        console.error('Error fetching sessions: ', err);
        return res.status(500).json({
          log: 'error occurred in sessionController.getAllSessions',
          error: err,
        });
    }
  },
};

module.exports = sessionController;