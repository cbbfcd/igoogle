const { red, yellow, green, cyan } = require("kleur");

const helper = {
  print(infos) {
    console.log(
      yellow()
        .bold()
        .underline("[igoogle]:")
    );

    infos.forEach(info => {
      console.log(green(info));
    });
  },
  printErr(err, when) {
    when = when || "";
    console.error(
      red()
        .bold()
        .bgYellow("[igoogle] an error occured when ") +
        cyan()
          .bold()
          .bgYellow(when) +
        " ,error msg: " +
        err
    );
  },
  line(str, len) {
    var line = new Array(Math.max(1, len - str.length)).join("-");
    return " " + line + " ";
  }
};

module.exports = helper;
