#!/bin/bash
# This file is used to automatize commits to GitHub by generating random commit messages or whatever
# It may not be required or relevant for other projects where this file is spotted
# You may ask, "why not ignore this file from uploading to GitHub or any git", well... if someone ever wonder why
# this project has strange commit names, then, this is the reason.
git add .
git commit -m "P7RND_$(($RANDOM * 50))"
git push origin master
echo "[INFO] - Upload script done!"