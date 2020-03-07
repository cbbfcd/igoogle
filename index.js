#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const ini = require("ini");
const open = require("open");
const program = require("commander");
const { red, yellow, green, cyan } = require("kleur");

const PKG = require("./package.json");
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
  .command('search <question> [others...]')
  .alias('s')
  .description('search question by google')
  .action(onSearch);

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
    if (err) exit(err);
    print(['', '    add bookmark ' + name + ' success', '']);
  });
}

function onDel(name) {
  const bookmarks = getBookMarksFromFile(IGOOGLERC);
  if (!bookmarks.hasOwnProperty(name)) return;

  delete bookmarks[name];
  setCustomBookMark(bookmarks, function(err) {
    if (err) exit(err);
    print(['', '    del bookmark ' + name + ' success', '']);
  });
}

function onRename(originalName, newName) {
  if (!newName || !originalName || originalName === newName) return;
  const bookmarks = getBookMarksFromFile(IGOOGLERC);
  if (!bookmarks.hasOwnProperty(originalName)) {
    printErr(originalName + 'can not be found');
    return;
  };
  if (bookmarks.hasOwnProperty(newName)) {
    printErr(newName + 'already exists');
    return;
  };

  const original = bookmarks[originalName];
  delete bookmarks[originalName];

  bookmarks[newName] = original;

  setCustomBookMark(bookmarks, function(err) {
    if (err) exit(err);
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

function onSearch(question, others) {
  if (!question) return;
  others.unshift(question);
  let args = ['https://www.google.com/search?q=' + others.join('')];
  open.apply(null, args);
}

function line(str, len) {
  var line = new Array(Math.max(1, len - str.length)).join("-");
  return " " + line + " ";
}

function setCustomBookMark(cfg, cb) {
  fs.writeFile(IGOOGLERC, ini.stringify(cfg), cb);
}

function getBookMarksFromFile(filepath) {
  return fs.existsSync(filepath)
    ? ini.parse(fs.readFileSync(filepath, "utf-8"))
    : {};
}

function print(infos) {
  console.log(
    yellow()
      .bold()
      .underline("[igoogle]:")
  );

  infos.forEach(info => {
    console.log(green(info));
  });
}

function printErr (err) {
  console.error(red('[igoogle] an error occured:') + err);
}

function exit (err) {
  printErr(err);
  process.exit(1);
}
