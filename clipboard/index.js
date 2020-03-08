// now just for mac.
const { spawn } = require('child_process');
const path = require('path');
const { printErr } = require('../utils');

const APPLE_SCRIPT_PATH = './mac.applescript';
const RESOLVE_APPLE_SCRIPT_PATH = path.join(__dirname, APPLE_SCRIPT_PATH);

function readClipBoardAndTriggerCallBack(imgPath, cb) {
  if (!imgPath) return;
  let ascript = spawn('osascript', [RESOLVE_APPLE_SCRIPT_PATH, imgPath]);

  ascript.on('error', function (e) {
    printErr(e, 'read image from clipboard');
    process.exit(1);
  });

  ascript.on('exit', function (code, signal) {
    // console.log('exit',code,signal);
  });

  ascript.stdout.on('data', function (data) {
    cb(imgPath, data);
  });
}

module.exports = {
  readClipBoardAndTriggerCallBack
};
