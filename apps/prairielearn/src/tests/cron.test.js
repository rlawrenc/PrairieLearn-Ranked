const _ = require('lodash');
const cron = require('../cron');
const assert = require('chai').assert;

const { config } = require('../lib/config');
const sqldb = require('@prairielearn/postgres');
const sql = sqldb.loadSqlEquiv(__filename);

const helperServer = require('./helperServer');

describe('Cron', function () {
  this.timeout(60000);

  before('set up testing server', function (callback) {
    // set config.cronDailyMS so that daily cron jobs will execute soon
    const now = new Date();
    const midnight = new Date(now).setHours(0, 0, 0, 0);
    const sinceMidnightMS = now - midnight;
    const dayMS = 24 * 60 * 60 * 1000;
    const timeToNextMS = 15 * 1000;
    const cronDailyMS = (timeToNextMS + sinceMidnightMS) % dayMS;
    config.cronDailySec = cronDailyMS / 1000;

    // set all other cron jobs to execute soon
    config.cronOverrideAllIntervalsSec = 3;

    helperServer.before().call(this, callback);
  });
  after('shut down testing server', helperServer.after);

  describe('1. cron jobs', () => {
    it('should wait for 20 seconds', (callback) => {
      setTimeout(callback, 20000);
    });

    it('should all have started', async () => {
      const result = await sqldb.queryAsync(sql.select_cron_jobs, []);
      const runJobs = _.map(result.rows, (row) => row.name);
      const cronJobs = _.map(cron.jobs, (row) => row.name);
      assert.lengthOf(_.difference(runJobs, cronJobs), 0);
      assert.lengthOf(_.difference(cronJobs, runJobs), 0);
    });

    it('should all have successfully completed', async () => {
      const result = await sqldb.queryAsync(sql.select_unsuccessful_cron_jobs, []);
      assert.lengthOf(result.rows, 0);
    });
  });
});
