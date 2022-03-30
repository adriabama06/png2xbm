const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

/**
 * @type {Map<string, string | undefined>}
 */
var argvs = new Map();

if(!process.argv[2]) {
    console.log("node png2xbm.js --help");
    process.exit(1);
}

for(var i = 2; i < process.argv.length; i++) {
    var argv = process.argv[i];

    if(!argv.startsWith("-")) {
        continue;
    }

    argv = argv.replace(/-/g, '').toLowerCase();
    i++;

    var value = process.argv[i];
    if(value && !argv.startsWith("-") || !argv.startsWith("--")) {
        argvs.set(argv, value);
        continue;
    }
    i--;
    argvs.set(argv, undefined);
}

if(argvs.has("help") || argvs.has("h")) {
    console.log(`Usage: node png2xbm.js --input FOLDER --output FOLDER
    Arguments:
        (Optional) --help, -help, --h, -h : Show this menu
        
        (Optional) --header, -header : Output of the header file for C/C++ animation
        (Optional if --header is not used) --x, -x : Images x resolution
        (Optional if --header is not used) --y, -y : Images y resolution

        --input, -input, --i, -i : Input folder where have the .png images
        --output, -output, --o, -o : Output folder where the .xbm file will be saved
        `);
    process.exit(0);
}

if(!argvs.has("input")) {
    if(argvs.has("i")) {
        argvs.set("input", argvs.get("i"));
    }
}

if(!argvs.has("output")) {
    if(argvs.has("o")) {
        argvs.set("output", argvs.get("o"));
    }
}

const input_dir = argvs.get("input");
const output_dir = argvs.get("output");
const output_header = argvs.get("header");

const resolution_x = parseInt(argvs.get("x"));
const resolution_y = parseInt(argvs.get("y"));

if(true) {
    var errorMsg = "";

    if(input_dir == undefined) {
        errorMsg += "\nInvalid: input";
    }

    if(output_dir == undefined) {
        errorMsg += "\nInvalid: output";
    }

    if(output_header) {
        if(resolution_x == undefined) {
            errorMsg += "\nInvalid: if header is enabled -x is required filled";
        }
        if(resolution_y == undefined) {
            errorMsg += "\nInvalid: if header is enabled -y is required filled";
        }

        if(isNaN(resolution_x)) {
            errorMsg += "\nInvalid: -x need to be an intiger like: 1, 2, 3";
        }
        if(isNaN(resolution_y)) {
            errorMsg += "\nInvalid: -y need to be an intiger like: 1, 2, 3";
        }
    }

    if(errorMsg.length >= 1) {
        console.log(errorMsg);
        process.exit(1);
    }
}

const replace_placehodler = `#define %filename%_width ${resolution_x}
#define %filename%_height ${resolution_y}
static char %filename%_bits[] = `;

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

if(!fs.existsSync(output_dir)) {
    fs.mkdirSync(output_dir, { recursive: true });
}

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

    if(!output_header) {
        return;
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
    fs.writeFileSync(output_header, outtext);
}

doWork()
.then(() => {
    process.exit(0);
});