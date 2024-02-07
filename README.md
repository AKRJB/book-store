## Logic used  for computing sellCount :
 I have create custom static method in Order model, named is updateSellCount, that updates the sellCount for each product in an order.
 The Order model has a schema that includes an array of orderItems, where each orderItem contains information about a product and the quantity purchased.

A static method named updateSellCount is added to the Order model.
This method takes an orderId as a parameter.
Inside the method:
It retrieves the order with the specified orderId.
It iterates over each orderItem in the order.
For each orderItem:
It uses findByIdAndUpdate to find the corresponding product and increments its sellCount based on the quantity purchased.

## Mechanism for sending email notifications :

I have used Node.js library Nodemailer for sending the mails, Nodemailer uses the concept of transporters, which define the mechanism to send emails


## Database design and implementation :

I choose MongoDB for this application because it is a popular NoSQL database:

Schema Flexibility
JSON-Like Documents makes it easy to work with data in a format that is similar to JSON, a widely used data interchange format
High Performance:MongoDB can deliver high-performance read and write operations.
Aggregation Framework: MongoDB's aggregation framework allows for powerful data transformation and analysis.
