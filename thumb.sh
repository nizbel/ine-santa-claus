find . -name "*.jpg" -print0 | xargs -0 convert -thumbnail 370x300 --path ./thumbs
