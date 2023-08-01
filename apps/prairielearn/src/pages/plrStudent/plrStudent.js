const ERR = require('async-stacktrace');
// Routing Stuff
var express = require('express');
var router = express.Router();
// Query Stuff
var sqldb = require('@prairielearn/postgres');
var sql = sqldb.loadSqlEquiv(__filename);
// SSE Stuff
var sseClients = require('../../sseClients');
// Models
const { getLiveResults } = require('../partials/plr/plrScoreboardModel');
const { getSeasonalResults } = require('../partials/plr/plrScoreboardModel');
const { getAllTimeResults } = require('../partials/plr/plrScoreboardModel');
// -------
// ROUTING
// -------
router.get('/live_updates', (req, res) => {
  // This is the new SSE-specific route
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const clientRes = sseClients.addClient(res);

  req.on('close', () => {
    sseClients.removeClient(clientRes);
  });

  res.flushHeaders();
});

router.get('/', async function (req, res, next) {
  try {
    res.locals.course_instance_id = res.locals.course_instance.id;
    var course_id = res.locals.course.id;
    var user_id = res.locals.authn_user.user_id;
    res.locals.seasonalResults = await getSeasonalResults(res.locals.course_instance_id);
    res.locals.allTimeResults = await getAllTimeResults(course_id);
    res.locals.liveResults = await getLiveResults();

    // Get the user's display name
    res.locals.displayName = await getUserDisplayName(user_id);
    res.locals.userId = user_id; // Also pass the user_id to res.locals

    // NAV PAGE STUFF (from server.js)
    // res.locals.navPage = 'plrStudent'; 
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals);
  } catch (err) {
    console.log(err);
  }
});

router.get('/pl/course_instance/2/plrStudent/:userId/update_display_name', function (req, res, next) {
  const userId = req.params.userId;
  const newDisplayName = req.query.new_display_name;
  console.log('newDisplayName: ', newDisplayName);
  console.log('userId: ', userId);
  var params = {
    user_id: userId,
    new_display_name: newDisplayName,
  };
  sqldb.queryOneRow(sql.update_display_name, params, function (err, result) {
    if (ERR(err, next)) return;
    res.redirect(req.originalUrl);
  });
});



// ---------
// FUNCTIONS
// ---------
// Function to get USER DISPLAY NAME
function getUserDisplayName(user_id) {
  return new Promise((resolve, reject) => {
    sqldb.queryOneRow(sql.get_user_display_name, [user_id], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows[0].display_name);
      }
    });
  });
}
// Function to change/update USER DISPLAY NAME
function updateDisplayName(userId, newDisplayName) {
  return new Promise((resolve, reject) => {
    sqldb.query(sql.update_display_name, [userId, newDisplayName], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// TODO: Function to get ACHIEVEMENTS

module.exports = router;
