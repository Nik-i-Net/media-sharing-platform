#!/bin/sh

# PNG
magick -size 50x50 -background black -fill white -gravity center label:"PNG" image.png

# JPEG
magick -size 50x50 -background white -fill black -gravity center label:"JPEG" image.jpg

# GIF
magick \
  -delay 50 -size 50x50 -background red   -fill white -gravity center label:"GIF" \
  -delay 50 -size 50x50 -background green -fill white -gravity center label:"GIF" \
  -delay 50 -size 50x50 -background blue  -fill white -gravity center label:"GIF" \
  -loop 0 image.gif

# WEBP
magick \
  -delay 50 -size 50x50 -background red   -fill white -gravity center label:"WEBP" \
  -delay 50 -size 50x50 -background green -fill white -gravity center label:"WEBP" \
  -delay 50 -size 50x50 -background blue  -fill white -gravity center label:"WEBP" \
  -loop 0 image.webp

# SVG
cat > image.svg <<'EOF'
<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <rect width="50" height="50" fill="red" style="animation: x 1.5s infinite;"/>
  <text x="50%" y="50%" fill="white" font-size="22" font-family="Arial" text-anchor="middle" dominant-baseline="middle">
    SVG
  </text>
  <style>
    @keyframes x{0%,100%{fill:red}33%{fill:green}66%{fill:blue}}
  </style>
</svg>
EOF

# AVIF
mkdir tmp
magick -depth 8 -size 50x50 -background red   -fill white -gravity center label:"AVIF" tmp/red.png
magick -depth 8 -size 50x50 -background green -fill white -gravity center label:"AVIF" tmp/green.png
magick -depth 8 -size 50x50 -background blue  -fill white -gravity center label:"AVIF" tmp/blue.png
avifenc --timescale 1000 --duration 500 tmp/red.png tmp/green.png tmp/blue.png image.avif > /dev/null
rm -rf tmp

# 1 MiB+
magick -size 800x800 xc: +noise Gaussian \
-fill black -gravity center -pointsize 160 \
-annotate +0+0 "1MiB+" \
-quality 100 image-1MiBplus.jpg

# 5 MiB+
magick -size 1800x1800 xc: +noise Gaussian \
-fill black -gravity center -pointsize 350 \
-annotate +0+0 "5MiB+" \
-quality 100 image-5MiBplus.jpg

# 20 MiB+
magick -size 3600x3600 xc: +noise Gaussian \
-fill black -gravity center -pointsize 700 \
-annotate +0+0 "20MiB+" \
-quality 100 image-20MiBplus.jpg
