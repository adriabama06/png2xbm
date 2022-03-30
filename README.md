# Install:

## Linux:
```bash
sudo apt install imagemagick
sudo apt install nodejs

git clone https://github.com/adriabama06/png2xbm.git

cd png2xbm

node png2xbm.js --help
```

## Windows
- Install [ImageMagick](https://download.imagemagick.org/ImageMagick/download/binaries/ImageMagick-7.1.0-29-Q16-x64-static.exe)

- Install [NodeJS](https://nodejs.org/dist/v16.14.2/node-v16.14.2-x64.msi)
```bash
git clone https://github.com/adriabama06/png2xbm.git

cd png2xbm

node png2xbm.js --help
```

## Example usage:
```bash
node png2xbm.js --input example/ --output out/ --header myheader.h -x 128 -y 53
```

## Example --help menu:
```
Usage: node png2xbm.js --input FOLDER --output FOLDER
    Arguments:
        (Optional) --help, -help, --h, -h : Show this menu
        
        (Optional) --header, -header : Output of the header file for C/C++ animation
        (Optional if --header is not used) --x, -x : Images x resolution
        (Optional if --header is not used) --y, -y : Images y resolution

        --input, -input, --i, -i : Input folder where have the .png images
        --output, -output, --o, -o : Output folder where the .xbm file will be saved
```
