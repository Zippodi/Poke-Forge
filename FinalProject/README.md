# Poke-Forge
## Group J: Final Project Report

### What Works
All Pages, API Endpoints, Styling, PWA Functionality, Offline Functionality and Installability is complete. There are no known errors. You can create a team, edit a team, delete a team, view yours and other user's teams, view all the pokemon and their data and you can login, register and logout. You can also install it as an app, as well as view some pages and information offline.
### Authentication and Authorization
Authentication and Authorization are implemented the same as before, no changes. When a User registers, their account is added to the database (hashed, with a salt as well, API_SECRET_KEY used but stored in .env file).
Then they are sent to the login page. When a user logs in, the information is verified to be valid from the user data in the DB, and then a token cookie is made to keep track of how long the user should be logged in. All pages
aside from the login and register pages require the user be logged in to be accessed, and if they access them without this, it redirects them to the login page. If a user logs out, their cookie is removed, and they are sent to the login page again. The way we check if a user is logged in is by having all pages (besides login and reigster) have a script that checks if they are logged in and if not, redirects them to the login page.

### All Pages
Login Page: The first page the user will likely come to (going to all other pages besides register redirects them here if they are not logged in.). Simply allows the user to log into their account. Checks in the DB
if the user info is valid, because of this there is no offline functionality. From this page, you can click the Register button to go to the register page to make an account, and once you log in with a valid account, you go to the 
home page.

Register: Lets the user make an account. If the user types in a valid username and password, they are added to the DB and sent to the login page. The DB checks if the user already exists in the DB, and if it does, the info is invalid. Because
this page also requires using the Database, it also has no offline functionality. 

Home Page: After being logged in, the user comes here (if they try to come here without being logged in they are redirected to the login page). The home page displays the basic information about the page at the bottom, and has 4 links to the following pages: Create Team, View Other Teams, View/Edit Teams, View Pokemon Data. There is also a logout button that logs the user out (by removing their token cookie) and redirects them to the login page. The page also displays
the user's username in the top right and allows them to toggle whether or not they want shiny sprites to be displayed instead of the regular pokemon sprites on the create team page. This page provides the offline functionality of taking you 
to the other pages (as long as you have previously visited them while online). 

Create Team: the create team page is accessed through the home page as mentioned earlier. It allows you to create a team of 1-6 Pokemon, each with their own moves, ability and item. You can also name your team and make your team public to other
users. After making a team, you can view a chart of the team's type defenses and offenses, so you can see what types your team is effective and weak against. Once the user is finished making their team, they can press the Upload Team button, and then the team will be added to the database, so they can view and edit their own team, as well as letting other users view it if they marked it as public. This page offers little offline functionality, as its main purpose, creating teams, is impossible offline as it requires interacting with the database. You can also go to the home page from this page.

View Other Teams: This page, also accessed from the home page, lets you see other user's teams, specifically one's that were made public when the user was creating or editing them. Each team displayed show's the team's name, each of their pokemon, and each pokemon's item and abiliity (if they are holding an item). The offline functionality of this page is, if you have visited this page before, then you can view the teams that were on this page when you visited it last. You can also go to the home page from this page.

View/Edit Teams:  This page, also accessed from the home page, let's you view your own teams. You also have the ability to edit a team (change the pokemon in it, or their moves, ability, or item), and delete a team. Each team displayed show's the team's name, each of their pokemon, and each pokemon's item and ability (if they are holding an item). To access the edit page, or to delete a team, each team has a edit and delete button. The edit button takes you to the edit team page, with the team selected being stored into the page. The delete button simply deletes the team from the DB and removes it from the page. The offline functionality of this page is, if you have visited this page before, then you can view the teams that were on this page when you visited it last. You cannot however, delete or edit a team as this requires the Database. You can also go to the home page from this page.

Edit Team: Accessed from the View/Edit Teams page, this page is very similar to the create team page, as they offer similar functionality. This page, unlike the create team page, has the properties of the selected team to edit stored, so you can edit the parts of the team you want to change, and keep the parts you don't want to change. After the user has made the changes they want, they can press upload team, and then the team will be altered to their liking. This page offers no offline functionality, as it requires the database to edit a team. You can also go to the home page from this page.

View Pokemon Data: This page can also be accessed from the home page, but is different from the others, as it does not have anything to do with teams. It allows the user to view all the pokemon stored in the database. It contains all pokemon from the 1st generation of pokemon to the 8th. Each pokemon shown also can be clicked, and doing so will take you to the pokemon's individual page. You can also go to the home page from here as well. The offline functionality for this page allows you to view all the pokemon, and their individual data, as long as you have visited these pages previously while online.

Pokemon Page: This page, accessed from the View Pokemon Data page, allows the user to view the individual pokemon's data. This allows you to view the individual pokemon's abilities (each with a name and a description and if they have a hidden ability), type defenses, and list of moves (each with a name, type, category, power and accuracy) they can learn. There is also a chart thaty displays the pokemon's stats, including their HP, Attack, Defense, SP Attack, SP Defense, and speed.You can also access the home page from here as well. The offline functionality of this page lets you view all of this data as long as you have visited the page before. 

Not Found Page: If the user tries to access a page that doesnt exist (/homer or something). This page tells the user the page they are trying to access does not exist, and provides them links to pages that do.

Offline Page: If the user tries to access a page that requires them to be online, (create team page for example) then this page is displayed telling them to check their internet connection.

### Caching Strategy
For most cases, we cached data that the user has previously accessed before. This is because there is a lot of data the user may not want to access, as well as data that is specific to the user that they might want to view offline. 

### API Endpoints

Method | Route                 | Description
------ | --------------------- | ---------
`POST` | `/api/auth/login`              | Receives a username and password and creates a token if the user exists
`POST` | `/api/auth/register`           | Creates a new user account and creates a token if the provided username and password are valid
`POST` | `/api/auth/logout`              | Deletes the token cookie and sends the user back to the login page
`POST`  | `/api/teams/create`              | Creates a pokemon team with the logged in user's id
`PUT`  | `/api/teams/id/:teamid`              | Edits the pokemon team with the given team id.
`DELETE`  | `/api/teams/id/:teamid`              | Deletes the pokemon team with the given team id.
`GET` | `/api/auth/currentuser`              | Gets the user's info that is logged in
`GET`  | `/api/abilities`      | Retrieves all abilities
`GET`  | `/api/abilities/:name`      | Retrieves the abilitiy with the given name
`GET`  | `/api/abilities/id/:id`      | Retrieves the abilitiy with the given id
`GET`  | `/api/items`      | Retrieves all items
`GET`  | `/api/items/:name`      | Retrieves the item with the given name
`GET`  | `/api/items/id/:id`      | Retrieves the item with the given id
`GET`  | `/api/moves`      | Retrieves all moves
`GET`  | `/api/moves/:name`      | Retrieves the move with the given name
`GET`  | `/api/moves/id/:id`      | Retrieves the move with the given id
`GET`  | `/api/moves/type/:type`      | Retrieves the move of the given type
`GET`  | `/api/moves/category/:category`      | Retrieves the move in the given category
`GET`  | `/api/pokemon`      | Retrieves all pokemon
`GET`  | `/api/pokemon/:name`      | Retrieves the pokemon with the given name
`GET`  | `/api/pokemon/id/:id`      | Retrieves the pokemon with the given id
`GET`  | `/api/pokemon/type/:type`      | Retrieves the pokemon with the given type
`GET`  | `/api/pokemon/identifier/:defenses`      | Retrieves the pokemon's weaknesses
`GET`  | `/api/pokemon/identifier/:moves`      | Retrieves the moves a pokemon can learn
`GET`  | `/api/pokemon/identifier/:abilities`      | Retrieves the abilities a pokemon can learn
`GET`  | `/api/pokemon/teams`      | Retrieves all public teams, can be filtered to give teams with specific pokemon
`GET`  | `/api/pokemon/teams/id/:teamid`      | Retrieves team with given id
`GET`  | `/api/pokemon/teams/myteams`      | Retrieves the teams of the logged in user, private and public





### Contributions
- Matthew: Finished Create Team Page, deployed onto the VM. Created ServiceWorker and did offline functionality. Debugged errors involving deploying and bugs that existed before this milestone. Created and finished the not found page, and offline page.
- Casey: Made the new Delete Team and Edit Team API Endpoints. Created and finished the edit team page. Finished the view/edit teams page, and the view other teams page. Made the PWA Installable, as well as creating the manifest, and creating the logo's in Abobe Illustrator. Made the report.
