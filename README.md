# covidsource

The `covidsource` project is broken up into two distinct pieces:

1. An ETL pipeline using [AWS](https://aws.amazon.com/) and the [serverless](https://serverless.com/) framework to continually ingest available COVID-19 data into an [RDS Aurora](https://aws.amazon.com/rds/aurora/) datastore.
2. A set of [Grafana](https://grafana.com/) dashboards to visualize the data.

The ETL source code and Grafana dashboards will be backed up and stored here. I will also be providing helpful links to static data is used in this project.

## the sources of data

Below are the current data sources being populated.

|                    | Website          | Function Name | Data         |
| -----------------: | --------------------- | ------------------------- | ------------------ |
|        The Covid Tracking Project | [covidtracking.com](https://covidtracking.com/) | ingest_ctp | [CSV](https://covidtracking.com/api/v1/states/daily.csv) |
| US Census Data / 2019 projections | [census.gov](https://www.census.gov/) | ingest_us | [API](https://api.census.gov/data/2019/pep/population?get=NAME,COUNTY,STATE,DENSITY,POP&for=county:*) |
|        New York Times County Data | [nyt.com](https://www.nytimes.com/article/coronavirus-county-data-us.html) | ingest_nyt    | [CSV](https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv) |
|               Apple Mobility Data | [apple.com](https://www.apple.com/covid19/mobility)          | ingest_apl    | [CSV](https://www.apple.com/covid19/mobility)                |
|              Google Mobility Data | [google.com](https://www.google.com/covid19/mobility)        | ingest_gog *  | [CSV](https://www.gstatic.com/covid19/mobility/Global_Mobility_Report.csv) |
|  Eric Celeste / US County GeoJSON | [eric.clst.org](https://eric.clst.org/tech/usgeojson/)       | -             | [JSON](https://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_050_00_20m.json) |

> \* the Google data source currently takes longer than the 30 second lambda timeout so can currently only be ingested manually. This can be done by setting the `AURORA_HOST` environment variable.

## use & contribute

You can contribute or fork the code to fit your needs. Just use the following steps:

1. Make sure you have an AWS account and install and authenticate the CLI with an access key and secret.

2. Make sure you have node.js installed

3. Install the [serverless](https://serverless.com/) framework:

   ```bash
   npm i -g serverless
   ```

4. Clone the repo into a new folder.

5. Switch to the folder.

6. You will need to create a `serverconfig.yaml` file that contains your secrets. The format is as follows:

   ```yaml
   dev:
     database:
       name: c19_dev_db_example
       username: c19_user
       password: superstrongpassword
     cfnRole: arn:aws:iam::00000000:role/your-own-special-lambda-role
   
   prod:
     database:
       name: c19_prod_db_example
       username: c19_user
       password: superstrongpassword
     cfnRole: arn:aws:iam::00000000:role/your-own-special-lambda-role
   ```

   

7. Install the dependencies

   ```bash
   npm i
   ```

8. Deploy the API

   ```bash
   sls deploy
   ```

   *Keep in mind here, that I've got my serverless.yaml configured to use the custom domain (which you will not be able to use, but I'm leaving the config in the file so you can see how I did it.)*

9. Seed the database. Some ETL lambdas run on a schedule, but if you'd like to run them immediately to seed the database, you can do so by running the commands manually using the `invoke` function (see the table above).

   ```bash
   sls invoke -f [function name]
   ```

   

## follow the live build

More information is available on the https://c19.dev website. I'm currently live streaming the build of the API and dashboards on [Twitch](https://www.twitch.tv/hrudotsh) and posting the videos afterwards on [YouTube](https://www.youtube.com/channel/UC_D6qpdhkoJJZE_CGFyVhog).

/ [Matt](https://www.linkedin.com/in/hrushka/)

