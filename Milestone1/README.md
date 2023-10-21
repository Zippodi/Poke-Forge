# Poke-Forge
## Group J: Milestone 1

### What is Done
All the html pages have been created (not completely finished, but created). Most of the styling is finished for most pages. 
All of the pages except for view/edit teams and view other teams are finished/mostly finished on the frontend. Almost all api endpoints have 
been created but might need touching up on (Matt you can remove this part if it is not true). All Dockerfiles and related files have been created 
and finished. All of the JSON data we need has been added (Also correct me if I am wrong here Matt). Going from page to page has been implemented
using scripting, instead of <a> tags like before. The logo has also been made and the source of which is linked at the bottom of the page.
All pages made (not the ones listed earlier) are responsive and mobile-first, using Bootstrap to do this. 
### What is not Done
The view/edit teams and view other teams pages are not finished. Login functionality isn't complete as not every page checks
if you are logged in as of yet. The login and register pages as of now also just take you to the home page regardless if 
you filled in anything or not, but this of course will be implemented later, in the 2nd milestone.
Wanted to add the sprites being displayed when a user chooses a pokemon to add to their team. Some pages feel a little empty,
so they will be filled in with either more content or the content will be made larger.
### Implementation Status of Pages
| Pages       | Status      | Wireframe|
| ----------- | ----------- |----------|
| Home      | 90%      |  [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupJ/blob/main/Proposal/Wireframes/CreateTeamWireFrame.png)        |
| Create Team  | 70%        |          |
| ViewOtherTeams   | 20%        |          |
| ViewEditTeams   | 20%        |          |
| Login   | 90%        |          |
| Register  | 90%        |          |
### API Endpoints

#### Authentication:
There are two POST endpoints for authentication. The exact details of implementation are not specified yet:
| Method | Route             | Description                                                        |
|--------|-------------------|--------------------------------------------------------------------|
| `POST`    | `/auth/login `           | Receives a username and password from the user and will test to see if the credentials are valid.  |
| `POST`   | `/auth/register `   | Receives a username, password, and password confirmation from the user and will test to see if the username is unique and username/password are allowed.|

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
| `POST`   | `/teams/create `    | Creates a new team and returns the generated team's ID             |
| `PUT`    | `/teams/id/:teamid` | Updates an existing team and returns a success value if successful |
| `GET`    | `/teams/id/:teamid` | Gets a team by its ID                                              |
| `DELETE` | `/teams/id/:teamid` | Deletes a team identified by its ID                                |
| `GET`    | `/teams/myteams  `  | Gets all teams for the logged in user                              |

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
| `GET` | `/attack/effectiveness` | Get a JSON of effectiveness against types for a pokemon with 1-4 specified moves passed via a URL query. All moves will use the query paramter `m`. |

For `GET /attack/effectiveness`, examples of valid use are:
- `/attack/effectiveness?m=earthquake`
- `/attack/effectiveness?m=shadowball&m=psychic&m=darkpulse&m=yawn`

The return is a JSON that answers the question: "If a Pokemon knew these moves, what types could they hit, not hit, hit for super effectiveness, and hit but not effectively?".
- Moves with 0 power are not counted in this metric. If all moves given have 0 power then the JSON returned will show all types as immune
- OHKO moves and other undetermined power moves are treated as normal moves of their type for now, special treatment might be implemented later

EX: `GET /attack/effectiveness?m=earthquake&m=darkpulse` Shows that a Pokemon knowing these two moves can hit fire, electric, poison, rock, and steel types super effectively. But it cannot hit grass, flying, or bug types effectively.
```json
{
    "effectiveness": {
        "normal": 1,
        "fire": 2,
        "water": 1,
        "electric": 2,
        "grass": 0.5,
        "ice": 1,
        "fighting": 1,
        "poison": 2,
        "ground": 1,
        "flying": 0.5,
        "psychic": 1,
        "bug": 0.5,
        "rock": 2,
        "ghost": 1,
        "dragon": 1,
        "dark": 1,
        "steel": 2,
        "fairy": 1
    }
}
```


### Contributions
