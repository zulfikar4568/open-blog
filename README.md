<p align="center">
  <a href="" target="blank"><img src="./public/zulfikar.svg" width="320" alt="kreMES Logo" /></a>
</p>
<h1 align="center">Open Blog</h1>
<h3 align="center">

[Demo](https://zulfikar-blog.herokuapp.com/api/blog)

</h3>

This application made by Typescript and Nestjs, you can login with google or facebook
## Prerequisite:
* Install Docker Engine in [here](https://docs.docker.com/engine/install/), I'm using docker version `Docker version 20.10.16, build aa7e414`
* Install Docker Compose in [here](https://docs.docker.com/compose/install/), I'm using docker compose version `docker-compose version 1.29.2, build 5becea4c`
* Install Node JS [here](https://nodejs.org/en/), I'm using Node js version `v17.6.0`
* Install Nest CLI [here](https://docs.nestjs.com/cli/overview). I'm using nest cli version `8.2.2.`
  
## Running as a Development Mode (Locally)

### 1. Setup your .env file
Rename `.env.example` and change to `.env`
### 2. Database Setup
Up database
```bash
docker-compose up -d --build dev-db
```

Down Database
```bash
docker-compose down
```

### 3. Install Dependencies
```bash
yarn install
```

### 4.1. Running
```bash
yarn dev
```

### 4.2. Running with watching
```bash
yarn watch
```

Visit: http://localhost:4000/api