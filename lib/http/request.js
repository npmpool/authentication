/**
 * Module dependencies.
 */
var http = require('http')
    , req = http.IncomingMessage.prototype;


/**
 * Intiate a login session for `user`.
 *
 * Options:
 *   - `session`  Save login state in session, defaults to _true_
 *
 * Examples:
 *
 *     req.logIn(user, { session: false });
 *
 *     req.logIn(user, function(err) {
 *       if (err) { throw err; }
 *       // session saved
 *     });
 *
 * @param {User} user
 * @param {Object} options
 * @param {Function} done
 * @api public
 */
req.login =
    req.logIn = function (user, options, done) {
            if (typeof options == 'function') {
                done = options;
                options = {};
            }
            options = options || {};

            var property = 'user';
            if (this._passport && this._passport.instance) {
                property = this._passport.instance._userProperty || 'user';
            }
            var session = (options.session === undefined) ? true : options.session;

            this[property] = user;
            if (session) {
                if (!this._passport) {
                    throw new Error('passport.initialize() middleware not in use');
                }
                if (typeof done != 'function') {
                    throw new Error('req#login requires a callback function');
                }
                this._passport.session.user = user._id;
                this._passport.session.type = user.type;
                done();
            } else {
                done && done();
            }
        };

/**
 * Terminate an existing login session.
 *
 * @api public
 */
req.logout =
    req.logOut = function () {
        var property = 'user';
        if (this._passport && this._passport.instance) {
            property = this._passport.instance._userProperty || 'user';
        }

        this[property] = null;
        if (this._passport && this._passport.session) {
            delete this._passport.session.user;
            delete this._passport.session.type;
        }
    };

/**
 * Test if request is authenticated.
 *
 * @return {Boolean}
 * @api public
 */
req.isAuthenticated = function (usertype) {
    var property = 'user';
    if (this._passport && this._passport.instance) {
        property = this._passport.instance._userProperty || 'user';
    }
    if (this._passport && this._passport.session) {
        var type= this._passport.session.type;
        if(usertype != type)
            return false;
        return (this._passport.session.user) ? true : false;
    }
    return false;
};

/**
 * Test if request is unauthenticated.
 *
 * @return {Boolean}
 * @api public
 */
req.isUnauthenticated = function () {
    return !this.isAuthenticated();
};
