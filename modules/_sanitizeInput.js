const replaceAll = require('string.prototype.replaceall');
const fs = require('fs');
const path = "./input.txt";
const input = fs.readFileSync(path);
let output = "";

console.log(input);

if (input.includes("\r\n")) {
    output = replaceAll(input, "\r\n", "\\n");
} else {
    output = replaceAll(input, "\n", "\\n");
}

output = replaceAll(output, "`", "``");

console.log(output);
fs.writeFileSync(path, output);