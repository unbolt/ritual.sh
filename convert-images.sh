#!/bin/bash

# Convert HEIC/HEIF to JPG and resize to max 2000px on either side
find content -type f \( -iname "*.heic" -o -iname "*.heif" \) | while read -r file; do
  output="${file%.*}.jpg"
  magick "$file" -resize '2000x2000>' -quality 85 "$output"
  echo "Converted $file to $output"

  # Strip GPS data from the converted image
  exiftool -gps:all= -overwrite_original "$output"
  echo "Stripped GPS data from $output"

  # Delete the original HEIC/HEIF file after successful conversion
  rm "$file"
  echo "Deleted $file"
done

# Strip GPS data from existing JPG, JPEG, and PNG files
find content -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r file; do
  # Check if file has GPS data before processing
  if exiftool -gps:all "$file" | grep -q "GPS"; then
    exiftool -gps:all= -overwrite_original "$file"
    echo "Stripped GPS data from $file"
  fi
done
