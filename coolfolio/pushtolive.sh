!/bin/bash
# A script to merge dev branch with live

if [ -z "$1"]
then
  echo "please give a commit message ex: ./pushtolive <message>"
  exit 0
fi

echo "beginning process..."
git branch dev
git add -A
git commit -m "$1"
git push
git checkout live
git merge dev
git push
git chekout dev
echo "sucess!"
