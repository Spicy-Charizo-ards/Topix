import { Request, Response, NextFunction } from 'express';

const generateSessionID = (): string => {
    return [...Array(30)]
        .map(() => Math.random().toString(36)[2])
        .join('');
};

const cookieController = {
    setDatabaseID(req: Request, res: Response, next: NextFunction): void {
      try {
        if (!res.locals.user) {
          throw new Error('User data is missing in res.locals');
        }
  
        res.cookie('app_database_id', res.locals.user, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
  
        console.log('Database ID cookie set successfully');
        return next();
      } catch (err) {
        return next({
          log: `Error in cookieController.setDatabaseID: ${err}`,
          status: 500,
          message: { err: 'Failed to set database ID cookie.' },
        });
      }
    },
  
    /**
     * Sets a cookie called 'ssid' using the existing or newly generated session ID.
     * Max age is 1 minute (1000 * 60 ms).
     */
    setSSID(req: Request, res: Response, next: NextFunction): void {
      try {
        const sessionID: string = (req as any).sessionID || generateSessionID(); //! any needs to be adjusted
  
        res.cookie('ssid', sessionID, {
          httpOnly: true,
          maxAge: 1000 * 60,
          secure: process.env.NODE_ENV === 'production',
        });
  
        console.log('SSID cookie set successfully.');
        return next();
      } catch (err) {
        return next({
          log: `Error in cookieController.setSSID: ${err}`,
          status: 500,
          message: { err: 'Failed to set SSID cookie.' },
        });
      }
    },
  };


module.exports = cookieController;