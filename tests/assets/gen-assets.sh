#!/usr/bin/env bash

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

rm -rf tmp && mkdir tmp

# PNG
magick -size 640x480 -background black -fill white -gravity center label:"PNG" image.png

# JPEG
magick -size 640x480 -background white -fill black -gravity center label:"JPEG" image.jpg

# GIF
magick \
  -delay 50 -size 640x480 -background red   -fill white -gravity center label:"GIF" \
  -delay 50 -size 640x480 -background green -fill white -gravity center label:"GIF" \
  -delay 50 -size 640x480 -background blue  -fill white -gravity center label:"GIF" \
  -loop 0 image.gif

# WEBP
magick \
  -delay 50 -size 640x480 -background red   -fill white -gravity center label:"WEBP" \
  -delay 50 -size 640x480 -background green -fill white -gravity center label:"WEBP" \
  -delay 50 -size 640x480 -background blue  -fill white -gravity center label:"WEBP" \
  -loop 0 image.webp

# SVG
cat > image.svg <<'EOF'
<svg width="640" height="480" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" style="animation: x 1.5s infinite;"/>
  <text x="50%" y="50%" fill="white" font-size="300" text-anchor="middle" dominant-baseline="middle">
    SVG
  </text>
  <style>
    @keyframes x{0%,100%{fill:red}33%{fill:green}66%{fill:blue}}
  </style>
</svg>
EOF

# AVIF
magick -depth 8 -size 640x480 -background red   -fill white -gravity center label:"AVIF" tmp/avif-red.png
magick -depth 8 -size 640x480 -background green -fill white -gravity center label:"AVIF" tmp/avif-green.png
magick -depth 8 -size 640x480 -background blue  -fill white -gravity center label:"AVIF" tmp/avif-blue.png

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

# Audio
ffmpeg -loglevel error -f lavfi -i "sine=frequency=440:duration=5" audio.mp3
# ffmpeg -loglevel error -f lavfi -i "sine=frequency=440:duration=5" audio.mp4 # video/mp4
ffmpeg -loglevel error -f lavfi -i "sine=frequency=440:duration=5" audio.m4a
ffmpeg -loglevel error -f lavfi -i "sine=frequency=440:duration=5" audio.wav
ffmpeg -loglevel error -f lavfi -i "sine=frequency=440:duration=5" audio.ogg
# ffmpeg -loglevel error -f lavfi -i "sine=frequency=440:duration=5" audio.webm # video/webm

# video/mp4
magick -size "640x480" -background red   -fill white -gravity center label:"video/mp4" "tmp/mp4-frame1.png"
magick -size "640x480" -background green -fill white -gravity center label:"video/mp4" "tmp/mp4-frame2.png"
magick -size "640x480" -background blue  -fill white -gravity center label:"video/mp4" "tmp/mp4-frame3.png"
ffmpeg -loglevel error -loop 1 -framerate 2 -i tmp/mp4-frame%d.png -f lavfi -i "sine=frequency=440" -t 10 video.mp4

# video/webm
magick -size "640x480" -background red   -fill white -gravity center label:"video/webm" "tmp/webm-frame1.png"
magick -size "640x480" -background green -fill white -gravity center label:"video/webm" "tmp/webm-frame2.png"
magick -size "640x480" -background blue  -fill white -gravity center label:"video/webm" "tmp/webm-frame3.png"
ffmpeg -loglevel error -loop 1 -framerate 2 -i tmp/webm-frame%d.png -f lavfi -i "sine=frequency=440" -t 10 video.webm

rm -rf tmp
