#Entity Queries for DynamoDB tables
## Shopping: 
    PK - Partition Key
    SK - Sort Key
    ---------------------------------
    GSAx - Global Secondary Attribute
    GSI1 - Hash + Range
    # LSAx - Local Secondary Attribute
    # LSIx - Local Secondary Index comprised of PK and LSI's

Get a Customer by ID  [PK]
Get a Customer by Email [GSI2]
Get a Customer by Phone [GSI1]
Get Customers Details [SK] // begin's with DETAIL_
Get Customers Details + Region [SK] // begins with DETAIL_(COUNTRY_)(PROVINCE_)(CITY)
All Items for a Customer - [PK/SK]
Items in a Customer's Card - [PK-GSA1]
Customer's order Stripe ID [GSA2]

Partition key for each object type in the PrimaryKey

    CART_uuid.v1()
    CUST_uuid.v1()
    ORDER_uuid.v1()
    PROD_uuid.v1()
    SUBS_uuid.v1()

Cart/Order item ID's come from the Products Table

CustomerID, CartItemId, ItemOrderStatus, ItemOrderDate,

ItemOrderStatus's: 
DateTime_prefix: [Range Index]

    inCart_YYYYMMDDHHIISS // Item has been added to a customer's cart
    ordered_YYYYMMDDHHIISS // Item order has been completed by customer
    payed_YYYYMMDDHHIISS // Item has been paid for
    allocated_YYYYMMDDHHIISS // Item is in the "handling" process
    shipped_YYYYMMDDHHIISS // Product has left the warehouse
    delivered_YYYYMMDDHHIISS // Customer has recieved the item
    activated_YYYYMMDDHHIISS // Subscriptions, licences, digital deliverables

CustomerInfo

Customer (search params)
    customerID | Email | Phone | Name  | Address{}
Orders
    customerId | ItemId | Item | category[enum] | Status[enum] |  


##Products:
types vs categories
a Type is a broad spectrum distinction in the prouct by delivery mechanism: a physical item that needs to be delivered (product), vs a Software licence that is downloaded or "activated" by an end user (licence) or which can be renewed digitally such as a licence subscription.
An unqualified subscription is simply something that recurrs - ie a magazine that's send every month or a Gardening service.
"services" are typcially associated with human labour being the prmiary component of the deliverable.  

Categories are the much smaller bucks with crossover. IE a book vs a magazine vs an ebook, categories can include legal services, clothing, electronics, music instruments etc.
Items tend to have a primary category - or purpose - but can fit into a range of categories - ie: "Tape" can fall into a primary categroy of "Adhesives" but could sub-category as "building material" or "Childrens' craft item"

Get a Product by ID [PK]
Get Products by Type ()
Get Products by Primary Category ()
Get top reviewed Products
Get all reviews for a Product

Product Pagination/Search - consider elastic search @todo
