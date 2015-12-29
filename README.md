#Minecraft-Web-Admin

Allows for the remote management of a vanilla Minecraft server.  This project currently supports authentication using passport.  Only users marked as administrators are able to access server controls.

I created this project to familiarize myself with React, Node.js, Mongoose / MongoDB, and websockets.
(...also because a friend is 10 years old and doesn't know how to use SSH to manage her Minecraft server)

Goals:
- [x] Stop server safely by sending a command to stdin
- [x] Share constants between Node and client
- [x] Fix React structure
- [x] Allow client to issue commands
- [x] Fixed: server status duplicate GET requests
- [x] Naming conventions!  Constants with underscores and the rest camel case.
- [x] Fix React structure more
- [x] Make client UI prettier
- [x] Server status on client should reflect if server is killed
- [ ] Bugfix: sometimes users will be listed as online twice.
- [ ] Split up less file / use includes
- [ ] Abstract minecraft server process spawning from socket IO
- [ ] Use RequireJS (wow I really need this for React)
- [ ] Better admin request system
