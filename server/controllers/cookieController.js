const cookieController = {

    setDatabaseID (req, res, next) {
        try {
            if (!res.locals.user) {
                throw new Error ('User data is missing in res.locals');
            }
            //this may no longer work with secure
            res.cookie('app_database_id', res.locals.user, { 
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            });
            console.log('Database ID cookie set successfully');
            return next();
        } catch (err) {
            return next({
                log: 'Error in cookieController.setDatabaseID',
                status: 500,
                message: { err: 'Failed to set database ID cookie.' },
            });
        }

    },

    setSSID (req, res, next) {
        try{
            const sessionID = req.sessionID || generateSessionID();
            //this may no longer work with secure
            res.cookie('ssid', sessionID, {
                httpOnly: true,
                maxAge: 1000 * 60,
                secure: process.env.NODE_ENV === 'production',
            });
            console.log('SSID cookie set successfully.');
            return next();
        } catch (err) {
            return next({
                log: 'Error in cookieController.setSSID',
                status: 500,
                message: { err: 'Failed to set SSID cookie.' },
              });
        }
    },
};

const generateSessionID = () => {
    return [...Array(30)]
      .map(() => Math.random().toString(36)[2])
      .join('');
  };

module.exports = cookieController;