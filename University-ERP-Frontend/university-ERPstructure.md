/api/v1/transfers​Copy link

Auth Required
Headers
Idempotency-KeyCopy link to Idempotency-Key
Type:string
Body
·InternalTransferRequest
required
application/json
Request payload for internal fund transfers

amountCopy link to amount
Type:number
min:  
0.01
required
Example
Amount to transfer in base currency

destinationAccountNumberCopy link to destinationAccountNumber
Type:string
required
Example
The destination account number

idempotencyKeyCopy link to idempotencyKey
Type:string
required
Example
Unique idempotency key to prevent duplicate processing

sourceAccountNumberCopy link to sourceAccountNumber
Type:string
required
Example
The source account number

descriptionCopy link to description
Type:string
Example
Optional transfer description

scheduledDateCopy link to scheduledDate
Type:string
Example
Optional scheduled execution date (ISO-8601)

Responses

200
OK
*/*
Request Example forpost/api/v1/transfers
Shell Curl
curl https://paym.**********.com/api/v1/transfers \
  --request POST \
  --header 'Idempotency-Key: ' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "sourceAccountNumber": "4859228705057459",
  "destinationAccountNumber": "4859228705057460",
  "amount": 150,
  "idempotencyKey": "idemp_8f7b231c-9a4d-4e99-8b1c-3b9c7d4a2f81",
  "description": "Payment for consulting services",
  "scheduledDate": "2026-09-01T10:00:00Z"
}'


Test Request
(post /api/v1/transfers)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "transactionReference": "string",
    "sourceAccountNumber": "string",
    "destinationAccountNumber": "string",
    "amount": 1,
    "currency": "string",
    "status": "PENDING",
    "description": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
    "senderName": "string",
    "recipientName": "string",
    "entryType": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transfers/internal/​Copy link

Auth Required
Headers
Idempotency-KeyCopy link to Idempotency-Key
Type:string
Body
·InternalTransferRequest
required
application/json
Request payload for internal fund transfers

amountCopy link to amount
Type:number
min:  
0.01
required
Example
Amount to transfer in base currency

destinationAccountNumberCopy link to destinationAccountNumber
Type:string
required
Example
The destination account number

idempotencyKeyCopy link to idempotencyKey
Type:string
required
Example
Unique idempotency key to prevent duplicate processing

sourceAccountNumberCopy link to sourceAccountNumber
Type:string
required
Example
The source account number

descriptionCopy link to description
Type:string
Example
Optional transfer description

scheduledDateCopy link to scheduledDate
Type:string
Example
Optional scheduled execution date (ISO-8601)

Responses

200
OK
*/*
Request Example forpost/api/v1/transfers/internal/
Shell Curl
curl https://paym.**********.com/api/v1/transfers/internal/ \
  --request POST \
  --header 'Idempotency-Key: ' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "sourceAccountNumber": "4859228705057459",
  "destinationAccountNumber": "4859228705057460",
  "amount": 150,
  "idempotencyKey": "idemp_8f7b231c-9a4d-4e99-8b1c-3b9c7d4a2f81",
  "description": "Payment for consulting services",
  "scheduledDate": "2026-09-01T10:00:00Z"
}'


Test Request
(post /api/v1/transfers/internal/)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "transactionReference": "string",
    "sourceAccountNumber": "string",
    "destinationAccountNumber": "string",
    "amount": 1,
    "currency": "string",
    "status": "PENDING",
    "description": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
    "senderName": "string",
    "recipientName": "string",
    "entryType": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transfers/internal​Copy link

Auth Required
Headers
Idempotency-KeyCopy link to Idempotency-Key
Type:string
Body
·InternalTransferRequest
required
application/json
Request payload for internal fund transfers

amountCopy link to amount
Type:number
min:  
0.01
required
Example
Amount to transfer in base currency

destinationAccountNumberCopy link to destinationAccountNumber
Type:string
required
Example
The destination account number

idempotencyKeyCopy link to idempotencyKey
Type:string
required
Example
Unique idempotency key to prevent duplicate processing

sourceAccountNumberCopy link to sourceAccountNumber
Type:string
required
Example
The source account number

descriptionCopy link to description
Type:string
Example
Optional transfer description

scheduledDateCopy link to scheduledDate
Type:string
Example
Optional scheduled execution date (ISO-8601)

Responses

200
OK
*/*
Request Example forpost/api/v1/transfers/internal
Shell Curl
curl https://paym.**********.com/api/v1/transfers/internal \
  --request POST \
  --header 'Idempotency-Key: ' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "sourceAccountNumber": "4859228705057459",
  "destinationAccountNumber": "4859228705057460",
  "amount": 150,
  "idempotencyKey": "idemp_8f7b231c-9a4d-4e99-8b1c-3b9c7d4a2f81",
  "description": "Payment for consulting services",
  "scheduledDate": "2026-09-01T10:00:00Z"
}'


Test Request
(post /api/v1/transfers/internal)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "transactionReference": "string",
    "sourceAccountNumber": "string",
    "destinationAccountNumber": "string",
    "amount": 1,
    "currency": "string",
    "status": "PENDING",
    "description": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
    "senderName": "string",
    "recipientName": "string",
    "entryType": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transfers/​Copy link

Auth Required
Headers
Idempotency-KeyCopy link to Idempotency-Key
Type:string
Body
·InternalTransferRequest
required
application/json
Request payload for internal fund transfers

amountCopy link to amount
Type:number
min:  
0.01
required
Example
Amount to transfer in base currency

destinationAccountNumberCopy link to destinationAccountNumber
Type:string
required
Example
The destination account number

idempotencyKeyCopy link to idempotencyKey
Type:string
required
Example
Unique idempotency key to prevent duplicate processing

sourceAccountNumberCopy link to sourceAccountNumber
Type:string
required
Example
The source account number

descriptionCopy link to description
Type:string
Example
Optional transfer description

scheduledDateCopy link to scheduledDate
Type:string
Example
Optional scheduled execution date (ISO-8601)

Responses

200
OK
*/*
Request Example forpost/api/v1/transfers/
Shell Curl
curl https://paym.**********.com/api/v1/transfers/ \
  --request POST \
  --header 'Idempotency-Key: ' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "sourceAccountNumber": "4859228705057459",
  "destinationAccountNumber": "4859228705057460",
  "amount": 150,
  "idempotencyKey": "idemp_8f7b231c-9a4d-4e99-8b1c-3b9c7d4a2f81",
  "description": "Payment for consulting services",
  "scheduledDate": "2026-09-01T10:00:00Z"
}'


Test Request
(post /api/v1/transfers/)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "transactionReference": "string",
    "sourceAccountNumber": "string",
    "destinationAccountNumber": "string",
    "amount": 1,
    "currency": "string",
    "status": "PENDING",
    "description": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
    "senderName": "string",
    "recipientName": "string",
    "entryType": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transfers/external​Copy link

Auth Required
Headers
Idempotency-KeyCopy link to Idempotency-Key
Type:string
Body
·ExternalPaymentRequest
required
application/json
Request payload for external wire and ACH payments

amountCopy link to amount
Type:number
min:  
0.01
required
Example
Amount to transfer

destinationAccountNumberCopy link to destinationAccountNumber
Type:string
required
Example
The destination account number outside the bank

idempotencyKeyCopy link to idempotencyKey
Type:string
required
Example
Unique idempotency key to prevent duplicate processing

railNameCopy link to railName
Type:string
required
Example
The specific payment rail to use (e.g., SWIFT, ACH)

recipientNameCopy link to recipientName
Type:string
required
Example
Name of the recipient

routingNumberCopy link to routingNumber
Type:string
required
Example
Routing number of the destination bank

sourceAccountNumberCopy link to sourceAccountNumber
Type:string
required
Example
The source account number

Responses

200
OK
*/*
Request Example forpost/api/v1/transfers/external
Shell Curl
curl https://paym.**********.com/api/v1/transfers/external \
  --request POST \
  --header 'Idempotency-Key: ' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "sourceAccountNumber": "ACC-EXT-100200300",
  "destinationAccountNumber": "EXT-NOVA-999",
  "routingNumber": "ROUTING-1234",
  "recipientName": "Nova Global",
  "amount": 1000,
  "railName": "SWIFT",
  "idempotencyKey": "idemp_ext_b2a3c4"
}'


Test Request
(post /api/v1/transfers/external)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "transactionReference": "string",
    "sourceAccountNumber": "string",
    "destinationAccountNumber": "string",
    "amount": 1,
    "currency": "string",
    "status": "PENDING",
    "description": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
    "senderName": "string",
    "recipientName": "string",
    "entryType": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transfers/external/​Copy link

Auth Required
Headers
Idempotency-KeyCopy link to Idempotency-Key
Type:string
Body
·ExternalPaymentRequest
required
application/json
Request payload for external wire and ACH payments

amountCopy link to amount
Type:number
min:  
0.01
required
Example
Amount to transfer

destinationAccountNumberCopy link to destinationAccountNumber
Type:string
required
Example
The destination account number outside the bank

idempotencyKeyCopy link to idempotencyKey
Type:string
required
Example
Unique idempotency key to prevent duplicate processing

railNameCopy link to railName
Type:string
required
Example
The specific payment rail to use (e.g., SWIFT, ACH)

recipientNameCopy link to recipientName
Type:string
required
Example
Name of the recipient

routingNumberCopy link to routingNumber
Type:string
required
Example
Routing number of the destination bank

sourceAccountNumberCopy link to sourceAccountNumber
Type:string
required
Example
The source account number

Responses

200
OK
*/*
Request Example forpost/api/v1/transfers/external/
Shell Curl
curl https://paym.**********.com/api/v1/transfers/external/ \
  --request POST \
  --header 'Idempotency-Key: ' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "sourceAccountNumber": "ACC-EXT-100200300",
  "destinationAccountNumber": "EXT-NOVA-999",
  "routingNumber": "ROUTING-1234",
  "recipientName": "Nova Global",
  "amount": 1000,
  "railName": "SWIFT",
  "idempotencyKey": "idemp_ext_b2a3c4"
}'


Test Request
(post /api/v1/transfers/external/)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "transactionReference": "string",
    "sourceAccountNumber": "string",
    "destinationAccountNumber": "string",
    "amount": 1,
    "currency": "string",
    "status": "PENDING",
    "description": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
    "senderName": "string",
    "recipientName": "string",
    "entryType": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

transaction-controller ​Copy link
transaction-controllerOperations
post
/api/v1/transactions/{id}/dispute
post
/api/v1/transactions/withdraw
post
/api/v1/transactions/receipt/send
post
/api/v1/transactions/external-payment
post
/api/v1/transactions/deposit
get
/api/v1/transactions/trace/{keyPrefix}
get
/api/v1/transactions/history
/api/v1/transactions/{id}/dispute​Copy link

Auth Required
Path Parameters
idCopy link to id
Type:integer
Format:int64
required
Signed 64-bit integers (long type).

Body
·DisputeReasonRequest
required
application/json
reasonCodeCopy link to reasonCode
Type:string
required
notesCopy link to notes
Type:string
Responses

200
OK
*/*
Request Example forpost/api/v1/transactions/{id}/dispute
Shell Curl
curl https://paym.**********.com/api/v1/transactions/1/dispute \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "reasonCode": "",
  "notes": ""
}'


Test Request
(post /api/v1/transactions/{id}/dispute)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "transactionReference": "string",
    "sourceAccountNumber": "string",
    "destinationAccountNumber": "string",
    "amount": 1,
    "currency": "string",
    "status": "PENDING",
    "description": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
    "senderName": "string",
    "recipientName": "string",
    "entryType": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/withdraw​Copy link

Auth Required
Body
·WithdrawRequest
required
application/json
Request payload for withdrawing funds from a NovaBank virtual account.

accountNumberCopy link to accountNumber
Type:string
min length:  
10
max length:  
20
required
Example
The virtual account number to withdraw funds from.

amountCopy link to amount
Type:number
min:  
0.01
required
Example
The withdrawal amount in the account's base currency.

idempotencyKeyCopy link to idempotencyKey
Type:string
max length:  
100
required
Example
A unique client-generated key to safely retry the withdrawal without duplication.

Responses

200
OK
*/*
Request Example forpost/api/v1/transactions/withdraw
Shell Curl
curl https://paym.**********.com/api/v1/transactions/withdraw \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "accountNumber": "4859228705057459",
  "amount": 100,
  "idempotencyKey": "idemp-withdraw-9b4c2"
}'


Test Request
(post /api/v1/transactions/withdraw)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "transactionReference": "string",
    "sourceAccountNumber": "string",
    "destinationAccountNumber": "string",
    "amount": 1,
    "currency": "string",
    "status": "PENDING",
    "description": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
    "senderName": "string",
    "recipientName": "string",
    "entryType": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/receipt/send​Copy link

Auth Required
Body
·ReceiptNotificationRequest
required
application/json
amountCopy link to amount
Type:number
dateCopy link to date
Type:string
recipientEmailCopy link to recipientEmail
Type:string
sourceEmailCopy link to sourceEmail
Type:string
transactionReferenceCopy link to transactionReference
Type:string
Responses

200
OK
*/*
Request Example forpost/api/v1/transactions/receipt/send
Shell Curl
curl https://paym.**********.com/api/v1/transactions/receipt/send \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "transactionReference": "",
  "amount": 1,
  "date": "",
  "sourceEmail": "",
  "recipientEmail": ""
}'


Test Request
(post /api/v1/transactions/receipt/send)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {},
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/external-payment​Copy link

Auth Required
Body
·ExternalPaymentRequest
required
application/json
Request payload for external wire and ACH payments

amountCopy link to amount
Type:number
min:  
0.01
required
Example
Amount to transfer

destinationAccountNumberCopy link to destinationAccountNumber
Type:string
required
Example
The destination account number outside the bank

idempotencyKeyCopy link to idempotencyKey
Type:string
required
Example
Unique idempotency key to prevent duplicate processing

railNameCopy link to railName
Type:string
required
Example
The specific payment rail to use (e.g., SWIFT, ACH)

recipientNameCopy link to recipientName
Type:string
required
Example
Name of the recipient

routingNumberCopy link to routingNumber
Type:string
required
Example
Routing number of the destination bank

sourceAccountNumberCopy link to sourceAccountNumber
Type:string
required
Example
The source account number

Responses

200
OK
*/*
Request Example forpost/api/v1/transactions/external-payment
Shell Curl
curl https://paym.**********.com/api/v1/transactions/external-payment \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "sourceAccountNumber": "ACC-EXT-100200300",
  "destinationAccountNumber": "EXT-NOVA-999",
  "routingNumber": "ROUTING-1234",
  "recipientName": "Nova Global",
  "amount": 1000,
  "railName": "SWIFT",
  "idempotencyKey": "idemp_ext_b2a3c4"
}'


Test Request
(post /api/v1/transactions/external-payment)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "transactionReference": "string",
    "sourceAccountNumber": "string",
    "destinationAccountNumber": "string",
    "amount": 1,
    "currency": "string",
    "status": "PENDING",
    "description": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
    "senderName": "string",
    "recipientName": "string",
    "entryType": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/deposit​Copy link

Auth Required
Body
·DepositRequest
required
application/json
Request payload for depositing funds into a NovaBank virtual account.

accountNumberCopy link to accountNumber
Type:string
min length:  
10
max length:  
20
required
Example
The virtual account number receiving the deposit.

amountCopy link to amount
Type:number
min:  
0.01
required
Example
The deposit amount in the account's base currency.

idempotencyKeyCopy link to idempotencyKey
Type:string
max length:  
100
required
Example
A unique client-generated key to safely retry the deposit without duplication.

Responses

200
OK
*/*
Request Example forpost/api/v1/transactions/deposit
Shell Curl
curl https://paym.**********.com/api/v1/transactions/deposit \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "accountNumber": "4859228705057459",
  "amount": 250,
  "idempotencyKey": "idemp-deposit-8f92a"
}'


Test Request
(post /api/v1/transactions/deposit)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "transactionReference": "string",
    "sourceAccountNumber": "string",
    "destinationAccountNumber": "string",
    "amount": 1,
    "currency": "string",
    "status": "PENDING",
    "description": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
    "senderName": "string",
    "recipientName": "string",
    "entryType": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/trace/{keyPrefix}​Copy link

Auth Required
Path Parameters
keyPrefixCopy link to keyPrefix
Type:string
required
Responses

200
OK
*/*
Request Example forget/api/v1/transactions/trace/{keyPrefix}
Shell Curl
curl 'https://paym.**********.com/api/v1/transactions/trace/{keyPrefix}' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/v1/transactions/trace/{keyPrefix})
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "transactionReference": "string",
    "sourceAccountNumber": "string",
    "destinationAccountNumber": "string",
    "amount": 1,
    "currency": "string",
    "status": "PENDING",
    "description": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
    "senderName": "string",
    "recipientName": "string",
    "entryType": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/history​Copy link

Auth Required
Query Parameters
accountNumberCopy link to accountNumber
Type:string
required
directionCopy link to direction
Type:string
Default
pageCopy link to page
Type:integer
Format:int32
Default
Signed 32-bit integers (commonly used integer type).

sizeCopy link to size
Type:integer
Format:int32
Default
Signed 32-bit integers (commonly used integer type).

Responses

200
OK
*/*
Request Example forget/api/v1/transactions/history
Shell Curl
curl 'https://paym.**********.com/api/v1/transactions/history?accountNumber=&direction=ALL&page=0&size=10' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/v1/transactions/history)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "content": [
      {
        "transactionReference": "string",
        "sourceAccountNumber": "string",
        "destinationAccountNumber": "string",
        "amount": 1,
        "currency": "string",
        "status": "PENDING",
        "description": "string",
        "createdAt": "2026-09-13T07:36:55.594Z",
        "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
        "senderName": "string",
        "recipientName": "string",
        "entryType": "string"
      }
    ],
    "pageNumber": 1,
    "pageSize": 1,
    "totalElements": 1,
    "totalPages": 1,
    "last": true
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

transaction-intent-controller ​Copy link
transaction-intent-controllerOperations
post
/api/v1/transactions/intents
post
/api/v1/transactions/intents/{intentId}/execute
post
/api/v1/transactions/intents/{intentId}/authorization/verify
post
/api/v1/transactions/intents/{intentId}/authorization/push-request
post
/api/v1/transactions/intents/{intentId}/authorization/options
post
/api/v1/transactions/intents/{intentId}/authorization/deny
post
/api/v1/transactions/intents/{intentId}/authorization/approve
get
/api/v1/transactions/intents/{intentId}/authorization/status
/api/v1/transactions/intents​Copy link

Auth Required
Body
·TransactionIntent
required
application/json
amountCopy link to amount
Type:number
createdAtCopy link to createdAt
Type:string
Format:date-time
the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

currencyCopy link to currency
Type:string
executedTransactionIdCopy link to executedTransactionId
Type:integer
Format:int64
Signed 64-bit integers (long type).

expiresAtCopy link to expiresAt
Type:string
Format:date-time
the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

feeCopy link to fee
Type:number
idCopy link to id
Type:integer
Format:int64
Signed 64-bit integers (long type).

idempotencyKeyCopy link to idempotencyKey
Type:string
railCopy link to rail
Type:string
recipientCopy link to recipient
Type:string
sourceAccountIdCopy link to sourceAccountId
Type:string
statusCopy link to status
Type:string
enum
values
DRAFT
PENDING_AUTH
AUTHENTICATING
AUTHORIZED
PROCESSING
Show all values
Show additional propertiesfor Request Body
Responses

200
OK
*/*
Request Example forpost/api/v1/transactions/intents
Shell Curl
curl https://paym.**********.com/api/v1/transactions/intents \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "id": 1,
  "userId": 1,
  "rail": "",
  "sourceAccountId": "",
  "recipient": "",
  "amount": 1,
  "currency": "",
  "fee": 1,
  "total": 1,
  "idempotencyKey": "",
  "status": "DRAFT",
  "createdAt": "",
  "expiresAt": "",
  "executedTransactionId": 1
}'


Test Request
(post /api/v1/transactions/intents)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "id": 1,
    "userId": 1,
    "rail": "string",
    "sourceAccountId": "string",
    "recipient": "string",
    "amount": 1,
    "currency": "string",
    "fee": 1,
    "total": 1,
    "idempotencyKey": "string",
    "status": "DRAFT",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "expiresAt": "2026-09-13T07:36:55.594Z",
    "executedTransactionId": 1
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/intents/{intentId}/execute​Copy link

Auth Required
Path Parameters
intentIdCopy link to intentId
Type:integer
Format:int64
required
Signed 64-bit integers (long type).

Responses

200
OK
*/*
Request Example forpost/api/v1/transactions/intents/{intentId}/execute
Shell Curl
curl https://paym.**********.com/api/v1/transactions/intents/1/execute \
  --request POST \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(post /api/v1/transactions/intents/{intentId}/execute)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "transactionReference": "string",
    "sourceAccountNumber": "string",
    "destinationAccountNumber": "string",
    "amount": 1,
    "currency": "string",
    "status": "PENDING",
    "description": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "scheduledExecutionAt": "2026-09-13T07:36:55.594Z",
    "senderName": "string",
    "recipientName": "string",
    "entryType": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/intents/{intentId}/authorization/verify​Copy link

Auth Required
Path Parameters
intentIdCopy link to intentId
Type:integer
Format:int64
required
Signed 64-bit integers (long type).

Body
·WebAuthnVerificationRequest
required
application/json
assertionPayloadCopy link to assertionPayload
Type:string
challengeCopy link to challenge
Type:string
Responses

200
OK
*/*
Request Example for
Shell Curl
curl https://paym.**********.com/api/v1/transactions/intents/1/authorization/verify \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "challenge": "",
  "assertionPayload": ""
}'


Test Request
(post /api/v1/transactions/intents/{intentId}/authorization/verify)
Status:
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {},
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/intents/{intentId}/authorization/push-request​Copy link

Auth Required
Path Parameters
intentIdCopy link to intentId
Type:integer
Format:int64
required
Signed 64-bit integers (long type).

Body
·PushAuthRequest
required
application/json
amountCopy link to amount
Type:number
destinationAccountCopy link to destinationAccount
Type:string
sourceAccountCopy link to sourceAccount
Type:string
Responses

200
OK
*/*
Request Example for
Shell Curl
curl https://paym.**********.com/api/v1/transactions/intents/1/authorization/push-request \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "amount": 1,
  "sourceAccount": "",
  "destinationAccount": ""
}'


Test Request
(post /api/v1/transactions/intents/{intentId}/authorization/push-request)
Status:
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "id": 1,
    "transactionIntentId": 1,
    "challenge": "string",
    "credentialId": "string",
    "status": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "expiresAt": "2026-09-13T07:36:55.594Z",
    "verifiedAt": "2026-09-13T07:36:55.594Z",
    "authType": "string",
    "ipAddress": "string",
    "amount": 1,
    "sourceAccount": "string",
    "destinationAccount": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/intents/{intentId}/authorization/options​Copy link

Auth Required
Path Parameters
intentIdCopy link to intentId
Type:integer
Format:int64
required
Signed 64-bit integers (long type).

Responses

200
OK
*/*
Request Example for
Shell Curl
curl https://paym.**********.com/api/v1/transactions/intents/1/authorization/options \
  --request POST \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(post /api/v1/transactions/intents/{intentId}/authorization/options)
Status:
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "id": 1,
    "transactionIntentId": 1,
    "challenge": "string",
    "credentialId": "string",
    "status": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "expiresAt": "2026-09-13T07:36:55.594Z",
    "verifiedAt": "2026-09-13T07:36:55.594Z",
    "authType": "string",
    "ipAddress": "string",
    "amount": 1,
    "sourceAccount": "string",
    "destinationAccount": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/intents/{intentId}/authorization/deny​Copy link

Auth Required
Path Parameters
intentIdCopy link to intentId
Type:integer
Format:int64
required
Signed 64-bit integers (long type).

Responses

200
OK
*/*
Request Example for
Shell Curl
curl https://paym.**********.com/api/v1/transactions/intents/1/authorization/deny \
  --request POST \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(post /api/v1/transactions/intents/{intentId}/authorization/deny)
Status:
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {},
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/intents/{intentId}/authorization/approve​Copy link

Auth Required
Path Parameters
intentIdCopy link to intentId
Type:integer
Format:int64
required
Signed 64-bit integers (long type).

Responses

200
OK
*/*
Request Example for
Shell Curl
curl https://paym.**********.com/api/v1/transactions/intents/1/authorization/approve \
  --request POST \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(post /api/v1/transactions/intents/{intentId}/authorization/approve)
Status:
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {},
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/transactions/intents/{intentId}/authorization/status​Copy link

Auth Required
Path Parameters
intentIdCopy link to intentId
Type:integer
Format:int64
required
Signed 64-bit integers (long type).

Responses

200
OK
*/*
Request Example for
Shell Curl
curl https://paym.**********.com/api/v1/transactions/intents/1/authorization/status \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/v1/transactions/intents/{intentId}/authorization/status)
Status:
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "additionalProperty": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

statement-controller ​Copy link
statement-controllerOperations
post
/api/v1/statements/generate
get
/api/v1/statements/account/{accountNumber}
/api/v1/statements/generate​Copy link

Auth Required
Query Parameters
accountNumberCopy link to accountNumber
Type:string
required
startDateCopy link to startDate
Type:string
Format:date
required
full-date notation as defined by RFC 3339, section 5.6, for example, 2017-07-21

endDateCopy link to endDate
Type:string
Format:date
required
full-date notation as defined by RFC 3339, section 5.6, for example, 2017-07-21

Responses

200
OK
*/*
Request Example forpost/api/v1/statements/generate
Shell Curl
curl 'https://paym.**********.com/api/v1/statements/generate?accountNumber=&startDate=&endDate=' \
  --request POST \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(post /api/v1/statements/generate)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "id": 1,
    "accountNumber": "string",
    "startDate": "2026-09-13",
    "endDate": "2026-09-13",
    "pdfUrl": "string",
    "generatedAt": "2026-09-13T07:36:55.594Z"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/statements/account/{accountNumber}​Copy link

Auth Required
Path Parameters
accountNumberCopy link to accountNumber
Type:string
required
Responses

200
OK
*/*
Request Example forget/api/v1/statements/account/{accountNumber}
Shell Curl
curl 'https://paym.**********.com/api/v1/statements/account/{accountNumber}' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/v1/statements/account/{accountNumber})
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": [
    {
      "id": 1,
      "accountNumber": "string",
      "startDate": "2026-09-13",
      "endDate": "2026-09-13",
      "pdfUrl": "string",
      "generatedAt": "2026-09-13T07:36:55.594Z"
    }
  ],
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

merchant-gateway-controller ​Copy link
merchant-gateway-controllerOperations
post
/api/v1/gateway/payments/{intentId}/refund
post
/api/v1/gateway/checkout/sessions
get
/api/v1/gateway/payments/{intentId}
/api/v1/gateway/payments/{intentId}/refund​Copy link

Auth Required
Path Parameters
intentIdCopy link to intentId
Type:string
required
Headers
Idempotency-KeyCopy link to Idempotency-Key
Type:string
required
Body
·MerchantRefundRequest
required
application/json
amountCopy link to amount
Type:number
required
reasonCopy link to reason
Type:string
required
Responses

200
OK
*/*
Request Example forpost/api/v1/gateway/payments/{intentId}/refund
Shell Curl
curl 'https://paym.**********.com/api/v1/gateway/payments/{intentId}/refund' \
  --request POST \
  --header 'Idempotency-Key: ' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "amount": 1,
  "reason": ""
}'


Test Request
(post /api/v1/gateway/payments/{intentId}/refund)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "id": "string",
    "status": "string",
    "amount": 1,
    "currency": "string",
    "reference": "string",
    "environment": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "updatedAt": "2026-09-13T07:36:55.594Z"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/gateway/checkout/sessions​Copy link

Auth Required
Headers
Idempotency-KeyCopy link to Idempotency-Key
Type:string
required
Body
·MerchantCheckoutRequest
required
application/json
currencyCopy link to currency
Type:string
Pattern:^(?!null$).*
required
lineItemsCopy link to lineItems
Type:array object[] · LineItem[]
required
Show Child Attributesfor lineItems
referenceCopy link to reference
Type:string
Pattern:^(?!null$).*
required
successUrlCopy link to successUrl
Type:string
Pattern:^(?!null$).*
required
cancelUrlCopy link to cancelUrl
Type:string
Responses

200
OK
*/*
Request Example forpost/api/v1/gateway/checkout/sessions
Shell Curl
curl https://paym.**********.com/api/v1/gateway/checkout/sessions \
  --request POST \
  --header 'Idempotency-Key: ' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "reference": "",
  "currency": "",
  "successUrl": "",
  "cancelUrl": "",
  "lineItems": [
    {
      "name": "",
      "quantity": 1,
      "unitAmount": 1
    }
  ]
}'


Test Request
(post /api/v1/gateway/checkout/sessions)
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "id": "string",
    "status": "string",
    "amount": 1,
    "currency": "string"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/gateway/payments/{intentId}​Copy link

Auth Required
Path Parameters
intentIdCopy link to intentId
Type:string
required
Responses

200
OK
*/*
Request Example forget/api/v1/gateway/payments/{intentId}
Shell Curl
curl 'https://paym.**********.com/api/v1/gateway/payments/{intentId}' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/v1/gateway/payments/{intentId})
Status:200
{
  "success": true,
  "status": 1,
  "message": "string",
  "data": {
    "id": "string",
    "status": "string",
    "amount": 1,
    "currency": "string",
    "reference": "string",
    "environment": "string",
    "createdAt": "2026-09-13T07:36:55.594Z",
    "updatedAt": "2026-09-13T07:36:55.594Z"
  },
  "errorCode": "string",
  "correlationId": "string",
  "timestamp": "2026-09-13T07:36:55.594Z"
}

OK

payment-gateway-controller ​Copy link
payment-gateway-controllerOperations
post
/api/v1/gateway/payments/intents
get
/api/v1/gateway/payments/intents/{intentId}
/api/v1/gateway/payments/intents​Copy link

Auth Required
Headers
Idempotency-KeyCopy link to Idempotency-Key
Type:string
X-Client-IdCopy link to X-Client-Id
Type:string
X-Linked-AccountCopy link to X-Linked-Account
Type:string
Body
·CreatePaymentIntentRequest
required
application/json
sourceAccountIdCopy link to sourceAccountId
Type:string
Pattern:^(?!null$).*
required
amountCopy link to amount
Type:number
cancelUrlCopy link to cancelUrl
Type:string
currencyCopy link to currency
Type:string
descriptionCopy link to description
Type:string
idempotencyKeyCopy link to idempotencyKey
Type:string
merchantReferenceCopy link to merchantReference
Type:string
returnUrlCopy link to returnUrl
Type:string
Responses

200
OK
*/*
Request Example forpost/api/v1/gateway/payments/intents
Shell Curl
curl https://paym.**********.com/api/v1/gateway/payments/intents \
  --request POST \
  --header 'Idempotency-Key: ' \
  --header 'X-Client-Id: ' \
  --header 'X-Linked-Account: ' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
  "sourceAccountId": "",
  "amount": 1,
  "currency": "",
  "description": "",
  "merchantReference": "",
  "idempotencyKey": "",
  "returnUrl": "",
  "cancelUrl": ""
}'


Test Request
(post /api/v1/gateway/payments/intents)
Status:200
{
  "additionalProperty": {}
}

OK

/api/v1/gateway/payments/intents/{intentId}​Copy link

Auth Required
Path Parameters
intentIdCopy link to intentId
Type:string
required
Headers
X-Client-IdCopy link to X-Client-Id
Type:string
X-Linked-AccountCopy link to X-Linked-Account
Type:string
Responses

200
OK
application/json
Request Example forget/api/v1/gateway/payments/intents/{intentId}
Shell Curl
curl 'https://paym.**********.com/api/v1/gateway/payments/intents/{intentId}' \
  --header 'X-Client-Id: ' \
  --header 'X-Linked-Account: ' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/v1/gateway/payments/intents/{intentId})
Status:200
{
  "additionalProperty": {}
}

OK

dynamic-qr-controller ​Copy link
dynamic-qr-controllerOperations
post
/api/v1/gateway/payment-intents/{intentId}/qr
post
/api/v1/gateway/payment-intents/qr/{qrReference}/scan
/api/v1/gateway/payment-intents/{intentId}/qr​Copy link

Auth Required
Path Parameters
intentIdCopy link to intentId
Type:string
required
Headers
X-Merchant-IdCopy link to X-Merchant-Id
Type:integer
Format:int64
required
Signed 64-bit integers (long type).

Responses

200
OK
*/*
Request Example forpost/api/v1/gateway/payment-intents/{intentId}/qr
Shell Curl
curl 'https://paym.**********.com/api/v1/gateway/payment-intents/{intentId}/qr' \
  --request POST \
  --header 'X-Merchant-Id: 1' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(post /api/v1/gateway/payment-intents/{intentId}/qr)
Status:200
{
  "id": 1,
  "qrReference": "string",
  "paymentIntentId": 1,
  "qrPayload": "string",
  "status": "string",
  "expiresAt": "2026-09-13T07:36:55.594Z",
  "scannedAt": "2026-09-13T07:36:55.594Z",
  "createdAt": "2026-09-13T07:36:55.594Z",
  "updatedAt": "2026-09-13T07:36:55.594Z"
}

OK

/api/v1/gateway/payment-intents/qr/{qrReference}/scan​Copy link

Auth Required
Path Parameters
qrReferenceCopy link to qrReference
Type:string
required
Responses

200
OK
*/*
Request Example forpost/api/v1/gateway/payment-intents/qr/{qrReference}/scan
Shell Curl
curl 'https://paym.**********.com/api/v1/gateway/payment-intents/qr/{qrReference}/scan' \
  --request POST \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(post /api/v1/gateway/payment-intents/qr/{qrReference}/scan)
Status:200
{
  "id": 1,
  "version": 1,
  "intentId": "string",
  "merchantId": 1,
  "customerAccountNumber": "string",
  "amount": 1,
  "currency": "string",
  "feeAmount": 1,
  "status": "CREATED",
  "description": "string",
  "idempotencyKey": "string",
  "qrGenerationStartedAt": "2026-09-13T07:36:55.594Z",
  "createdAt": "2026-09-13T07:36:55.594Z",
  "updatedAt": "2026-09-13T07:36:55.594Z"
}

OK