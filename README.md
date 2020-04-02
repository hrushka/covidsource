# covidsource

The `covidsource` project is an API wrapper library for [The COVID Tracking Project](https://covidtracking.com/)'s API. The wrapper is a real-time passthrough set of APIs developed on AWS using the [serverless](https://serverless.com/) framework meant to be ingested into [Grafana](https://grafana.com/).

The API augments the data with other sources and reformats the information to be injested by Grafana using the [JSON datasource](https://grafana.com/plugins/simpod-json-datasource) ([repo](https://github.com/simPod/grafana-json-datasource)).

## how to use the project

### the dashboards

While you can use the APIs to make your own, the projects dashboards can be seen at: https://c19.grafana.net

### use the APIs

You can use the current version of the API below. It will have more limited features than the development version, but will remain fairly stable.

|                    | Stable                | Development               |
| -----------------: | --------------------- | ------------------------- |
|        **Feature** | `https://c19api.com/` | `https://dev.c19api.com/` |
|      US State Data | `Yes`                 | `Yes`                     |
|   US National Data | `No`                  | `Yes`                      |
|        Census Data | `No`                  | `Yes`                      |
| International Data | `No`                  | `No`                      |

### contribute to the development / on your own

You can contribute or fork the code to fit your needs. Just use the following steps:

1. Make sure you have an AWS account and install and authenticate the CLI with an access key and secret.

2. Make sure you have node.js installed

3. Install the [serverless](https://serverless.com/) framework:

   ```bash
   npm i -g serverless
   ```

4. Clone the repo into a new folder.

5. Switch to the folder.

6. Install the dependencies

   ```bash
   npm i
   ```
6. Deploy the API

   ```bash
   sls deploy
   ```
   
   *Keep in mind here, that I've got my serverless.yaml configured to use the custom domain (which you will not be able to use, but I'm leaving the config in the file so you can see how I did it.)*

## follow the live build

More information is available on the https://c19.dev website. I'm currently live streaming the build of the API and dashboards on [Twitch](https://www.twitch.tv/hrudotsh) and posting the videos afterwards on [YouTube](https://www.youtube.com/channel/UC_D6qpdhkoJJZE_CGFyVhog).

/ [Matt](https://www.linkedin.com/in/hrushka/)

