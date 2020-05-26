# Stripe Integrations for Payment and Terminal using Serverless

This is a collection of lambda functions and DynamoDb tables that can be run locally using the Serverless framework

Developers with AWS experience can also deploy this to their AWS account to add a custom domain name, deploy Lambda functions, store DynamoDB data and use CloudFront CDN.

## Prerequisites

- A Serverless Framework account
- Serverless
- Stripe CLI
- Java

## Getting Started

This project relies heavily on the Serverless framework.

You will need

- A Serverless account
- The Serverless CLI
- An app in serverless (eg. `stripe-training`)

Follow this guide to get started: https://serverless.com/framework/docs/getting-started/

Update the serverless.yml file:

```yaml
# app and org for use with dashboard.serverless.com
app: example_app #CHANGE THIS to the name of the App you created in Serverless
org: example_org #CHANGE THIS

...
  environment:
    ...
    STRIPE_API_KEY: "sk_test_OD123456" # CHANGE THIS Your Stripe "Secret key"
```

### Installing

- Clone this repo
- `npm install`
- `sls dynamodb install`

### Running the application

```
 npm run local
```

Test using Postman/Insomnia, note the url at the end of the deploy script and the Routes for each lambda.

```text
...
Serverless: Routes for getOrder:
Serverless: GET /orders/getOrder
Serverless: POST /{apiVersion}/functions/stripe-react-frontend-dev-getOrder/invocations

Serverless: Routes for createTerminalConnection:
Serverless: GET /terminal/connect
Serverless: POST /{apiVersion}/functions/stripe-react-frontend-dev-createTerminalConnection/invocations

Serverless: Routes for capturePaymentIntent:
Serverless: POST /terminal/capture
Serverless: POST /{apiVersion}/functions/stripe-react-frontend-dev-capturePaymentIntent/invocations

Serverless: Offline [HTTP] listening on http://localhost:15001
Serverless: Enter "rp" to replay the last request
```

## Capturing Stripe webhooks

You can recieve webhooks from Stripe to your local development environment using Stripe CLI

### Install Stripe CLI

Follow the instructions at https://stripe.com/docs/stripe-cli

### Listen for webhooks

Listen for webhooks and redirect to your local development API.

```yaml
stripe listen --forward-to localhost:15001/webhook/listen
```

Any webhooks sent by Stripe should now show in the terminal and be picked up by `src/api/webhook/listen.ts`

https://stripe.com/docs/stripe-cli/webhooks

## Running the tests

- Write then
- Run them
- Create a pull request
- Much thanks!

## Deployment - Advanced

This is an optional step for advanced AWS users who want to deploy the application remotely.

Upload to AWS and run from your own domain, or the AWS domain provided.

```text
npm run deploy
```

Populate your Catalog with Items. As DynamoDb is dynamic - there's a lot of latitude for the type of items you have in your catalog.

## Authors

- **Ken Easson** - _Initial work_ - [Rangle.io](https://rangle.io)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- Dave McDonald - _Overall project support_
- José Guillén - _Serverless and AWS assistance_
- Jason Santos - _Typescript and Code Review_
- The many others at _Rangle.io_ that have helped me learn all this tech!
