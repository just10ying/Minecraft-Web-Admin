#Minecraft-Web-Admin

Allows for the remote management of a vanilla Minecraft server.  This project currently supports authentication using passport.  Only users marked as administrators are able to access server controls.

I created this project to familiarize myself with React, Node.js, Mongoose / MongoDB, and websockets.
(...also because a friend is 10 years old and doesn't know how to use SSH to manage her Minecraft server)

Goals:
- [x] Stop server safely by sending a command to stdin
- [x] Share constants between Node and client
- [x] Fix React structure
- [x] Allow client to issue commands
- [ ] Use RequireJS
- [ ] Fix: server status duplicate GET requests
- [ ] Save and visualize metrics using C3
- [ ] Better admin request system
- [ ] Make client UI prettier