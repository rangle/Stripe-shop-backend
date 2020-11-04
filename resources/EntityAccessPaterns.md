#Entity Queries for DynamoDB table: Shopping
* x = a number
PK - Primary Key
SK - Secondary Key
GSAx - Global Secondary Attribute
LSAx - Local Secondary Attribute

GSIx - Global Secondary Index comprised of GSA's and PK's
LSIx - Local Secondary Index comprised of PK and LSI's

Customers: 

Get a Customer by ID  [PK]
Get a Customer by Email [GSA1]
Add Cart Items [SK] to a Customer [PK]
Convert all Cart Items [SK] to Order Items for a Customer [PK]
Get Cart Items [SK] for a Customer [PK]
Get Order Items [SK] for a Customer [PK] By Order/Shipping Status [GSA1]
Get Subscriptions [SK] for a Customer [PK]
Get Subscriptions [SK] for a Customer [PK] By Subscription status [LSA1]
Get Subscriptions [SK] for a Customer [PK] By date [GSA1]
Get anything by Stripe ID [GSA2]

PK
CART_uuid.v1()
CUST_uuid.v1()
ORDER_uuid.v1()
PROD_uuid.v1()
SUBS_uuid.v1()

Cart/Order item ID's come from the Catalog Table

CustomerID, CartItemId, ItemOrderStatus, ItemOrderDate,

ItemOrderStatus's: 
DateTime_prefix: [Range Index]
    inCart_YYYYMMDDHHIISS
    ordered_YYYYMMDDHHIISS
    payed_YYYYMMDDHHIISS
    shipped_YYYYMMDDHHIISS
    delivered_YYYYMMDDHHIISS
CustomerInfo

Customer (search params)
    customerID | Email | Phone | Name  | Address{}
Orders
    customerId | ItemId | Item | category[enum] | quantity | Status[enum] |  
