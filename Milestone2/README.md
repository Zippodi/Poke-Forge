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



#### Teams:
Team data will be sent and received using JSON similar to below which is not finalized. The JSON is valid if:
- `username` is a valid user in the system
- `userid` is the userID that corresponds to the username in the database
- `teamid` is a unique identifier, not required when creating a team but required when editing a team
- `public` is a boolean value for if the team can be publicly viewed
- `pokemon` is an array of 1-6 objects with the following constraints
  - `name` is that of a Pokemon that exists in Pokemon generations 1-8
  - `moves` is an array of moves that are compatible with the Pokemon
  - `ability` is an ability that is compatible with the Pokemon
  - `item` is a falsy value, is not present, or is a valid item that exists in the list of items (not all Pokemon items are available in this app, but all items that have an effect in battle are) 

```json
{
  "username": "testuser",
  "userid": 1,
  "teamid": 1,
  "public": true,
  "pokemon": [
    {
      "name": "mankey",
      "moves": ["focuspunch", "bulldoze", "scratch"],
      "ability": "Vital Spirit"
    },
    {
      "name": "arceus",
      "moves": ["judgement", "perishsong", "earthpower", "extremespeed"],
      "ability": "multitype",
      "item": "earthplate"
    }
  ]
}
```

**The endpoints for Teams are as follows:**
| Method | Route             | Description                                                        |
|--------|-------------------|--------------------------------------------------------------------|
| `GET`    |` /teams`            | Gets an array of all public teams                                  |
| `POST`   | `/teams/create`    | Creates a new team and returns the generated team's ID             |
| `PUT`    | `/teams/id/:teamid` | Updates an existing team and returns a success value if successful |
| `GET`    | `/teams/id/:teamid` | Gets a team by its ID                                              |
| `DELETE` | `/teams/id/:teamid` | Deletes a team identified by its ID                                |
| `GET`    | `/teams/myteams`  | Gets all teams for the logged in user                              |

#### Pokemon
Data about Pokemon (not Pokemon in teams but acutal Pokemon themselves) can be retreived or filtered from [pokemon.json](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupJ/blob/main/Milestone1/api/src/_data/pokemon.json). The endpoint for Pokemon are as follows:
| Method | Route | Description |
|---|---|---|
| `GET` | `/pokemon/` | Get an array of all Pokémon |
| `GET` | `/pokemon/:name` | Get the data of a Pokémon by its name |
| `GET` | `/pokemon/type/:type` | Get an array of Pokémon of the specified type, including dual types |
| `GET` | `/pokemon/weaknesses/:name` | Get a JSON of weaknesses for a Pokémon of the specified name |
| `GET` | `/pokemon/ability/:ability` | Get an array of Pokémon that can have the specified ability. Can query to   include hidden abilities via `?hidden=include` |

The "JSON of weaknesses" above refers to an object where the keys are Pokemon types and the values are numbers corresponding to how effective a move is against that Pokemon. For example, the returned data for Charizard (fire/flying type) is:
```json
{
    "normal": 1, //normal effectiveness
    "fire": 0.5, //0.5x effectiveness
    "water": 2, //2x effectiveness
    "electric": 2,
    "grass": 0.25, //0.25x effectiveness
    "ice": 1,
    "fighting": 0.5,
    "poison": 1,
    "ground": 0, //immune
    "flying": 1,
    "psychic": 1,
    "bug": 0.25,
    "rock": 4, //4x effectiveness
    "ghost": 1,
    "dragon": 1,
    "dark": 1,
    "steel": 0.5,
    "fairy": 0.5
}
```

#### Other Pokemon Data
The following is a list of endpoints are for other data about Pokemon and are grouped together because, like Pokemon data, they are referenced from JSON files. Specifically [abilities.json](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupJ/blob/main/Milestone1/api/src/_data/abilities.json), [items.json](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupJ/blob/main/Milestone1/api/src/_data/items.json), and [moves.json](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupJ/blob/main/Milestone1/api/src/_data/moves.json). The data returned for each is in the same form as an entry in the JSON, similar to the Pokemon endpoints. The endpoints are as follows:

| Method | Route | Description |
|---|---|---|
| `GET` | `/abilities` | Get an array of all abilities |
| `GET` | `/abilities/:name` | Get an ability by its name |
| `GET` | `/items` | Get an array of all items |
| `GET` | `/items/:name` | Get an item by its name |
| `GET` | `/moves` | Get an array of all moves |
| `GET` | `/moves/:name` | Get a move by its name |
| `GET` | `/moves/type/:type` | Get an array of moves that are a specific type |
| `GET` | `/moves/category/:category` | Get an array of moves that are a specific category |
| `GET` | `/moves/attack/effectiveness` | Get a JSON of effectiveness against types for a pokemon with 1-4 specified moves passed via a URL query. All moves will use the query paramter `m`. |

For `GET /moves/attack/effectiveness`, examples of valid use are:
- `/moves/attack/effectiveness?m=earthquake`
- `/moves/attack/effectiveness?m=shadowball&m=psychic&m=darkpulse&m=yawn`

The return is a JSON that answers the question: "If a Pokemon knew these moves, what types could they hit, not hit, hit for super effectiveness, and hit but not effectively?".
- Moves with 0 power are not counted in this metric. If all moves given have 0 power then the JSON returned will show all types as immune
- OHKO moves and other undetermined power moves are treated as normal moves of their type for now, special treatment might be implemented later

EX: `GET /moves/attack/effectiveness?m=razorleaf&m=moonblast&m=thunderwave` Shows that a Pokemon knowing these three moves, two of which deal damage, can hit fighting, dragon, and dark types super effectively, but will not be effective against fire, poison, and steel types.
```json
{
    "effectiveness": {
        "normal": 1,
        "fire": 0.5,
        "water": 1,
        "electric": 1,
        "grass": 1,
        "ice": 1,
        "fighting": 2,
        "poison": 0.5,
        "ground": 1,
        "flying": 1,
        "psychic": 1,
        "bug": 1,
        "rock": 1,
        "ghost": 1,
        "dragon": 2,
        "dark": 2,
        "steel": 0.5,
        "fairy": 1
    }
}
```


### Contributions
- Matthew: API Sketch, JSON Data, API portion of milestone report
- Casey: Frontend First Pass, Rest of milestone report
