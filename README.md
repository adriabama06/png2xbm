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
