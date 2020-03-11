#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const ini = require("ini");
const open = require("open");
const program = require("commander");
const { print, printErr, line } = require('./utils');
const clipboardy = require('clipboardy');
//const { readClipBoardAndTriggerCallBack } = require('./clipboard');

const PKG = require("./package.json");
//const DUMMY_PNG = './dummy.png';
const IGOOGLERC = path.join(process.env.HOME, ".igooglerc");

program.version(PKG.version);

program
  .command("ls")
  .description("List all the bookmarks")
  .action(onList);

program
  .command("add <bookmark> <url>")
  .description("Add one favorite bookmark")
  .action(onAdd);

program
  .command('del <bookmark>')
  .description('Delete one bookmark')
  .action(onDel);

program
  .command('rename <bookmark> <newName>')
  .alias('rn')
  .description('Set custom bookmark name')
  .action(onRename);

program
  .command('open <bookmark> [browser]')
  .description('Open bookmark in a optional browser')
  .action(onOpen);

program
  .command('search [question...]')
  .alias('s')
  .description('Search question by google')
  .action(onSearch);

program
  .command('ocr')
  .description('OCR via your clipboard image')
  .action(onOcr);

program
  .command("help", { isDefault: true })
  .description("Print this help \n")
  .action(function() {
    program.outputHelp();
  });

program.parse(process.argv);

if (process.argv.length === 2) {
  program.outputHelp();
}

function onList() {
  const infos = [""];
  const bookmarks = getBookMarksFromFile(IGOOGLERC);
  const keys = Object.keys(bookmarks);
  const len = Math.max(...keys.map(key => key.length)) + 3;

  keys.forEach(key => {
    let bookmark = bookmarks[key];
    infos.push(key + line(key, len) + bookmark);
  });

  infos.push("");
  print(infos);
}

function onAdd(name, url) {
  const bookmarks = getBookMarksFromFile(IGOOGLERC);
  if (bookmarks.hasOwnProperty(name) || !url) return;
  if (url[url.length - 1] !== '/') url += '/'; // ensure url end with /

  bookmarks[name] = url;
  setCustomBookMark(bookmarks, function(err) {
    if (err) exit(err, 'exec add');
    print(['', '    add bookmark ' + name + ' success', '']);
  });
}

function onDel(name) {
  const bookmarks = getBookMarksFromFile(IGOOGLERC);
  if (!bookmarks.hasOwnProperty(name)) return;

  delete bookmarks[name];
  setCustomBookMark(bookmarks, function(err) {
    if (err) exit(err, 'exec del');
    print(['', '    del bookmark ' + name + ' success', '']);
  });
}

function onRename(originalName, newName) {
  if (!newName || !originalName || originalName === newName) return;
  const bookmarks = getBookMarksFromFile(IGOOGLERC);
  if (!bookmarks.hasOwnProperty(originalName)) {
    printErr('bookmark ' + originalName + ' can not be found', 'exec rename');
    return;
  };
  if (bookmarks.hasOwnProperty(newName)) {
    printErr('bookmark ' + newName + ' already exists', 'exec rename');
    return;
  };

  const original = bookmarks[originalName];
  delete bookmarks[originalName];

  bookmarks[newName] = original;

  setCustomBookMark(bookmarks, function(err) {
    if (err) exit(err, 'exec rename');
    print(['', '    rename bookmark ' + originalName + ' to ' + newName + ' success', '']);
  });
}

function onOpen(name, browser) {
  const bookmarks = getBookMarksFromFile(IGOOGLERC);
  if (!bookmarks.hasOwnProperty(name)) return;

  const url = bookmarks[name];
  if (url) {
    let args = [url];
    if (browser) args.push(browser);

    open.apply(null, args);
  }
}

function onSearch(question) {
  const cp = clipboardy.readSync();
  if (!cp && !question.length) return;
  let query = '';
  if (cp && !question.length) query = cp;
  if (question.length) query = question.join(' ');
  
  let args = ['https://www.google.com/search?q=' + query];
  open.apply(null, args);
}

function onOcr() {
  // readClipBoardAndTriggerCallBack(DUMMY_PNG, function(img, res) {
  //   if (!Buffer.isBuffer(res) || res.toString().trim() === 'no image') return;
    
  //   // TODO: base64 and ocr
  // });
}

function setCustomBookMark(cfg, cb) {
  fs.writeFile(IGOOGLERC, ini.stringify(cfg), cb);
}

function getBookMarksFromFile(filepath) {
  return fs.existsSync(filepath)
    ? ini.parse(fs.readFileSync(filepath, "utf-8"))
    : {};
}

function exit (err, when, cb) {
  printErr(err, when);
  cb && cb();
  process.exit(1);
}