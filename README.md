<p align="center"><img src="https://api.aposoftworks.com/storage/image/ehRdFIz6tqiERXID1SIXAeu0mmTBKLdixIXsNj9s.png" width="256"></p>

[![GitHub](https://img.shields.io/github/license/AcaiFramework/query)](https://github.com/AcaiFramework/query) [![Build Status](https://travis-ci.org/AcaiFramework/query.svg?branch=master)](https://travis-ci.org/AcaiFramework/query) [![Support](https://img.shields.io/badge/Patreon-Support-orange.svg?logo=Patreon)](https://www.patreon.com/rafaelcorrea)

# Açaí's Framework query builder
A simple modular, scalable query builder that let you toggle strategies to easily, used and created by Açaí Framework.

## Supports
- [x] MySQL
- [x] PostgreSQL
- [ ] mongo
- [ ] sqlite

## Installation
npm
```
npm install --save @acai/query
```

yarn
```
yarn add @acai/query
```

## Usage
### Setup
The first thing you are going to need is setup your query, you can easily define your default query or just setup one as follows:

``` typescript
import query, { setDefault, SqlQuery } 	from "query/mod.ts";

// setup specifically the sql query
await SqlQuery.toggleSettings({
	/* Your settings here */
});

// or setup a default query so you can easily import
await setDefaultQuery("pg", {
	/* Optional sql query settings, if you want to pass any */
});

// now every time you call query, it will provide the postgreSQL to you
const q = query(); // <-- this is a postgreSQL query builder
```

### Querying
You can easily search select using the query
``` typescript
import query from "query/mod.ts";

const results = await query().table("people").where("id", 5).get(["name", "age"]);
```

Our query builder smartlys build your raw string query so you don't have to worry about the details, for example:

``` typescript
await query().table("people").where("id", 5).where("name", "Robert").get();

// will output:
// SELECT FROM people WHERE id = 5 AND name = Robert

await query().table("people").where("id", 2).orWhere("name", "Robert").get();

// will output:
// SELECT FROM people WHERE id = 5 OR name = Robert
```

### Inserting
``` typescript
import query from "query/mod.ts";

await query().table("people").insert({
    name: "John",
    surname: "Doe",
    age: 32,
});
```

### Updating
``` typescript
import query from "query/mod.ts";

await query().table("people").where("id", 5).update({
    name: "John"
});
```

### Deleting
``` typescript
import query from "query/mod.ts";

await query().table("people").where("id", 5).delete();
```