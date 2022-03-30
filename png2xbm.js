#!/usr/local/node/bin/node

const resolution_x = 128;
const resolution_y = 53;

const replace_placehodler = `#define %filename%_width ${resolution_x}
#define %filename%_height ${resolution_y}
static char %filename%_bits[] = `;

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

if(!process.argv[2] || process.argv[2].startsWith('-') && process.argv[2].toLowerCase().replace(/-/g, '').replace('elp', '') == "h") {
    console.log("./png2xbm.js [INPUT] [OUTPUT]");
    console.log("No use spaces at input and output");
    return 0;
}
if(!process.argv[3]) {
    console.log("./png2xbm.js --help");
    return 0;
}

const input_dir = process.argv[2];
const output_dir = process.argv[3];

/**
 * @type {string[]}
 */
var input = [];
try {
    var t = fs.readdirSync(input_dir);
    input = t;
} catch {
    console.log("Invalid input folder");
    return;
}

input = input.filter(file => file.endsWith(".png"));
var output = [];
async function doWork() {
    for(var i = 0; i < input.length; i++) {

        const input_file_name = input[i];

        const input_file = path.join(input_dir, input_file_name);
        
        const output_file_name = input_file_name.replace(".png", ".xbm");

        output.push(output_file_name);

        const output_file = path.join(output_dir, output_file_name);


        process.stdout.write(`${input_file_name} => ${output_file_name}`);


        var time = 0;
        var counter = setInterval(() => {
            time += 1;
        }, 1);


        await new Promise((resolve, reject) => {
            var ch = child_process.exec(`convert ${input_file} ${output_file}`);
            ch.on('exit', () => {
                clearInterval(counter);
                resolve();
            });
        });
        console.log(` - ${time / 1000 / 60 >= 1 ? (time / 1000 / 60) + 'm : ' : ''}${time / 1000}s : ${time}ms`);
    }


    var outtext = `const static char animation[${input.length}][${resolution_x * resolution_y}] = {\n\n`;

    for(var i = 0; i < input.length; i++) {

        const output_file_name = output[i];

        const output_file_data = fs.readFileSync(path.join(output_dir, output_file_name));
    
        var temp_placeholder = replace_placehodler.replace(/%filename%/g, output_file_name.replace('.xbm', ''));

        var framedata = output_file_data.toString().replace(temp_placeholder, '').replace(';', ',');

        outtext += `// frame: ${i}\n${framedata}\n`;
    }
    outtext += "};";
    fs.writeFileSync(path.join(output_dir, "_outtext.h"), outtext);
}

doWork()
.then(() => {
    process.exit(0);
});