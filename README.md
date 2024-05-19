

## Description

Develop a RESTful API for a simple task management system with the following features
<li>User Authentication</li>
<li>Task CRUD Operations</li>
<li>Data Persistence</li>
<li>Input Validation</li>
<li>Websocket connection</li>


## Prerequisites
<li>Node.js</li>
<li>Docker</li>
<li>Docker Compose</li>


## Getting Started
1. Clone this repository:

```bash
$ git clone https://github.com/YhomiAce/task_assessment
```

2. Navigate to the project directory:

```bash
$ cd task_assessment
```

3. Create .env from .env.example:

```bash
$ cp .env.example .env
```

4. Build the Docker images and start the postgres container:

```bash
$ docker-compose up -d --build
```

5. Installation:

```bash
$ npm install
```

6. Run Migrations:

```bash
$ npm run migration:run
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## Api Documentation

<p> The Apis are documented using Swagger OpenApi </p>
<a href="http://localhost:3000/api/docs">Swagger Api Docs</a>

## Models and Migrations
<p> The ORM used for this project is <b>Typeorm</b> </p>
<p> The entities are in the <b>src/entities</b> folder</p>
<p> The migrations are in the <b>src/database/migrations</b> folder</p>
<p> To create a new empty migration:</p>

```bash
$ npm run migration:create --name=name-of-migration
```
<p> To generate a migration from entity file:</p>

```bash
$ npm run migration:generate --name=name-of-migration
```
<p> To run a migration:</p>

```bash
$ npm run migration:run
```
<p> To rollback/revert last migration:</p>

```bash
$ npm run migration:revert
```

## Websocket connection

<p>To connect to the websocket:</p>
<h3>{{API_URL}}?userId="uuid-of-user"</h3>
<p>E.g. http://localhost:3000?userId=fc59b8c1-b1e7-4807-a30d-186d659c58b7 </p>
<p>Listen to <b>"task_event"</b> to get all user's task in real time</p>