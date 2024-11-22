#!/bin/bash
find . -name "*.jpg" -print0 | xargs -0 mogrify -resize 370x300
find . -name "*.jpeg" -print0 | xargs -0 mogrify -resize 370x300
