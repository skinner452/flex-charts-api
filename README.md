# FlexCharts API

## Deployment

- Install dependencies: `npm install`

- Deploy: `serverless deploy`

## Local development

- Using the serverless offline plugin, you can run the lambda and api gateway all locally

- Copy the example env `cp .env.example .env.local`

- Update the values in your new `.env.local` file to match your database credentials

- Run `serverless offline --stage local` to run the API using the local environment variables

## Migrations

- Run `node migrate.js`

  - If you want to use an environment file other than `.env`, you can use the argument `--env=xyz` which will load the environment file `.env.xyz`

  - If you want to target a specific migration, you can append `--migrationID=x` to the command. This will run the up or down scripts to reach the specified migration ID.

  - If the migrations look correct, run it again with `--confirm` to apply the migrations
