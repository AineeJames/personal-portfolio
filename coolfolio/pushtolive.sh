#!/bin/bash
# A script to merge dev branch with live

printf "Please give a commit message: "
read msg

echo "beginning process..."
git branch dev
git add -A
git commit -m "$msg"
git push
git checkout live
git merge dev
git push
git checkout dev
echo "sucess!"

