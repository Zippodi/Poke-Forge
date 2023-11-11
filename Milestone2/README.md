# Poke-Forge
## Group J: Milestone 2

### What is Done
As before, all HTML pages are created, not complete yet. Namely view/other and viiew/edit pages have not been touched as of yet, because it would not be worth working on until createTeam was finished. Speaking of which, createTeam is completely finished, so is the home page, login page, register page, and two new pages, Pokemon.html and viewPokemon.html. The login and register pages are completely done, so the user can login, logout, and create an account, as well as tokens being created or deleted for this. Each method that requires the user to be logged in requires the authetication middleware (which is also finished) to be completed. The two new pages, are for looking at all of the pokemon in the database, and then clicking on these pokemon allows the user to see more details about the pokemon. All of the pokemon and team endpoints are finished as well. 
### What is not Done
The view/edit teams and view other teams pages are not finished.
Still want to add the sprites being displayed when a user chooses a pokemon to add to their team.  Some pages might also have their style touched up a bit more but the core of what they will look like is completed. The view/edit and view other team pages would have been at least nearly finished if not for running into issues with docker and dependencies. These have been fixed but now we will have to implement these next iteration. There will also be pages for items, moves and abilities, that will be added very soon.
### Implementation Status of Pages
| Pages       | Status      | Wireframe|
| ----------- | ----------- |----------|
| Home      | 100%      | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupJ/blob/main/Proposal/Wireframes/Home%20Page%20(1).png)         |
| Create Team  | 100%        | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupJ/blob/main/Proposal/Wireframes/CreateTeamWireFrame.png)         |
| ViewOtherTeams   | 20%        | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupJ/blob/main/Proposal/Wireframes/ViewOthersTeamsWireframe.png)|
| ViewEditTeams   | 20%        | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupJ/blob/main/Proposal/Wireframes/vieweditwireframe.png)|
| Login   | 100%        |  [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupJ/blob/main/Proposal/Wireframes/LoginRegister.png) |
| Register  | 10%        |  [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupJ/blob/main/Proposal/Wireframes/LoginRegister.png) |
| Pokemon  | 60%        |  (N/A) |
| ViewPokemon  | 100%        |  (N/A) |
### API Endpoints

All API endpoints are prepended with `/api` but it is not typed out explicitly in this document.  
#### Authentication:
There are two POST endpoints for authentication. Register creates a user based on the data given from the user (as long as the username doesn't already exist), and then creates a token for the user. Also hashes their password and creates a salt for them. The Login endpoint simply checks if the user with the username and hashed version of the password the user typed in exists in the database, and then if they do, creates a token for them. Each endpoint being user requires the middleware to check if the user is logged in, and uses the info from the token to do whatever the user is trying to do if they are (creating a team uses the user's id).

Method | Route                 | Description
------ | --------------------- | ---------
`POST` | `/api/auth/login`              | Receives a username and password and creates a token if the user exists
`POST` | `/api/auth/register`           | Creates a new user account and creates a token if the provided username and password are valid
`POST` | `/api/auth/logout`              | Deletes the token cookie and sends the user back to the login page
`POST`  | `/api/teams/create`              | Creates a pokemon team with the logged in user's id
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
- Matthew: API Sketch, JSON Data, API portion of milestone report
- Casey: Frontend First Pass, Rest of milestone report
