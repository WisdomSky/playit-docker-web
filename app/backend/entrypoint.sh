# make sure we're running latest version of the playit program
apt update
apt install -y playit

node /var/app/backend/app.js
