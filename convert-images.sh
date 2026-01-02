#!/bin/bash

find content -type f \( -iname "*.heic" -o -iname "*.heif" \) | while read -r file; do
  output="${file%.*}.jpg"
  magick "$file" -quality 85 "$output"
  echo "Converted $file to $output"
done