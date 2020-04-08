# Stripe Integrations for Payment and Terminal on AWS using Serverless

This is a collection of lambda functions, and dynamoDb Tables hosted in AWS 

## Getting Started

this project relies heavily on AWS services and the Serverless framework.  
setup an AWS account and Serverless  
https://serverless.com/framework/docs/getting-started/  
https://serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/  
install the AWS cli tools and serverless tools.   

update the serverless.yml file to suite your needs, the current serverless.yml is configured to use a real domain name through CloudFront, it's beyond the scope of this readme.  
https://serverless.com/framework/docs/providers/aws/events/cloudfront/  
 
```yaml
# app and org for use with dashboard.serverless.com
app: stripe-connect-aws
org: example_org #CHANGE THIS

custom:
  customDomain:
    domainName: api${self:provider.stage}.example.com # CHANGE THIS
```

### Prerequisites

- An AWS Account
- A Serverless Framework account 
- Serverless 

### Recommended
- a Domain hosted by AWS Route 53
- an SSL certificate - free with your domain name on AWS
- Stripe requires production systems to use SSL - default api Gateway is http only.

### Installing

- clone this repo
- `npm install`
- `sls dynamodb install`

You can run this offline using 
```
 npm run local
```


Test using Postman, note the url at the end of the deploy script and the Routes for each lambda.
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
## Running the tests
- write then
- run them
- create a pull request
- Much thanks!

## Deployment
Upload to AWS and run from your own domain, or the AWS domain provided. 
```text
npm run deploy
```

Populate your Catalog with Items. As DynamoDb is dynamic - there's a lot of latitude for the type of items you have in your catalog. 
 
## Authors
* **Ken Easson** - *Initial work* - [Rangle.io](https://rangle.io)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments
* Dave McDonald - *Overall project support*
* José Guillén - *Serverless and AWS assistance*
* Jason Santos - *Typescript and Code Review*
* The many others at *Rangle.io* that have helped me learn all this tech!

