# ShipStation API v2 — contract changes

## 2026-09-24

## API Changes

### POST /v2/freight/quotes
- :warning: the `insurance/allOf[subschema #1: freight_insurance]/insured_value` request property's exclusiveMinimum was set to `0.00`
- :warning: removed the request property `handling_units/items/commodities/items/value`
-  the request property `ship_from/allOf[subschema #1: freight_address]/address_line1` became optional
-  the request property `ship_from/allOf[subschema #1: freight_address]/company_name` became optional
-  the request property `ship_from/allOf[subschema #1: freight_address]/name` became optional
-  the request property `ship_from/allOf[subschema #1: freight_address]/phone` became optional
-  the request property `ship_to/allOf[subschema #1: freight_address]/address_line1` became optional
-  the request property `ship_to/allOf[subschema #1: freight_address]/company_name` became optional
-  the request property `ship_to/allOf[subschema #1: freight_address]/name` became optional
-  the request property `ship_to/allOf[subschema #1: freight_address]/phone` became optional


### GET /v2/freight/shipments
-  added the new optional `query` request parameter `created_at_end`
-  added the new optional `query` request parameter `created_at_start`
-  added the optional property `shipments/items/created_at` to the response with the `200` status


### POST /v2/freight/shipments
- :warning: added `#/components/schemas/freight_book_address` to the `ship_from` request property `allOf` list
- :warning: added `#/components/schemas/freight_book_address` to the `ship_to` request property `allOf` list
- :warning: removed the request property `handling_units`
-  removed `#/components/schemas/freight_address` from the `ship_from` request property `allOf` list
-  removed `#/components/schemas/freight_address` from the `ship_to` request property `allOf` list
-  added the optional property `created_at` to the response with the `200` status
-  added the optional property `shipment_id` to the response with the `200` status


### GET /v2/freight/shipments/{freight_shipment_id}
-  added the optional property `created_at` to the response with the `200` status


### GET /v2/labels
- :warning: the `labels/items/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  removed the optional property `labels/items/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `labels/items/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `labels/items/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `labels/items/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `labels/items/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `labels/items/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `labels/items/rate_details/items/` response property `allOf` list for the response status `200`


### POST /v2/labels
- :warning: added `#/components/schemas/rate_detail` to the `allOf[subschema #1: label]/rate_details/items/` request property `allOf` list
- :warning: removed the request property `allOf[subschema #1: label]/rate_details/items/amount`
- :warning: removed the request property `allOf[subschema #1: label]/rate_details/items/billing_source`
- :warning: removed the request property `allOf[subschema #1: label]/rate_details/items/carrier_billing_code`
- :warning: removed the request property `allOf[subschema #1: label]/rate_details/items/carrier_description`
- :warning: removed the request property `allOf[subschema #1: label]/rate_details/items/carrier_memo`
- :warning: removed the request property `allOf[subschema #1: label]/rate_details/items/rate_detail_type`
- :warning: the `allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  the `allOf[subschema #1: label]/rate_details/items/` request property `type` was widened from `object` to `any`
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`


### GET /v2/labels/external_shipment_id/{external_shipment_id}
- :warning: the `allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`


### POST /v2/labels/rate_shopper_id/{rate_shopper_id}
- :warning: the `allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`


### POST /v2/labels/rates/{rate_id}
- :warning: the `allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`


### POST /v2/labels/shipment/{shipment_id}
- :warning: the `allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`


### POST /v2/labels/shipping_rules/{shipping_rule_id}
- :warning: the `allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`


### GET /v2/labels/{label_id}
- :warning: the `allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`


### POST /v2/labels/{label_id}/cancel_refund
- :warning: the `rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  removed the optional property `rate_details/items/amount` from the response with the `200` status
-  removed the optional property `rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `rate_details/items/` response property `allOf` list for the response status `200`


### POST /v2/labels/{label_id}/return
- :warning: the `allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`


### POST /v2/mailing/envelopes
- :warning: the `allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`


### POST /v2/mailing/mail_labels
- :warning: the `allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
- :warning: the `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  removed the optional property `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`


### POST /v2/mailing/netstamps
- :warning: the `allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
- :warning: the `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  removed the optional property `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #2]/associated_labels/items/allOf[subschema #1: label]/rate_details/items/` response property `allOf` list for the response status `200`


### POST /v2/rates
- :warning: removed `#/components/schemas/se_id` from the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/created_at` response property `allOf` list for the response status `200`
- :warning: removed `#/components/schemas/se_id` from the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_id` response property `allOf` list for the response status `200`
- :warning: removed `#/components/schemas/se_id` from the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_id` response property `allOf` list for the response status `200`
- :warning: the response property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_id` became optional for the status `200`
- :warning: the response property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_id` became optional for the status `200`
- :warning: added the new `quick` enum value to the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_type/allOf[subschema #1: rate_type]/` response property for the response status `200`
- :warning: added the new `quick` enum value to the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_type/allOf[subschema #1: rate_type]/` response property for the response status `200`
- :warning: added `#/components/schemas/se_id, subschema #1` to the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_id` response property `oneOf` list for the response status `200`
- :warning: added `#/components/schemas/se_id, subschema #1` to the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_id` response property `oneOf` list for the response status `200`
- :warning: the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/created_at` response's property `type/format` changed from `string/date-time` to `any` for status `200`
- :warning: the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
- :warning: the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  added the new optional request property `oneOf[subschema #1: calculate_rates_by_shipment_id]/allOf[subschema #1: rate_request_rate_options]/rate_options/allOf[subschema #1: rate_request_body]/rate_type`
-  added the new optional request property `oneOf[subschema #2: calculate_rates_by_shipment]/allOf[subschema #1: rate_request_rate_options]/rate_options/allOf[subschema #1: rate_request_body]/rate_type`
-  added the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/carrier_weight` to the response with the `200` status
-  added the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/display_scheme` to the response with the `200` status
-  added the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/carrier_weight` to the response with the `200` status
-  added the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/display_scheme` to the response with the `200` status
-  the response optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/created_at` became read-only for the status `200`
-  removed the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/rate_detail_type` from the response with the `200` status
-  removed the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/date_time` to the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/created_at` response property `allOf` list for the response status `200`
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/` response property `allOf` list for the response status `200`
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #2: rate_response]/rate_response/allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/` response property `allOf` list for the response status `200`


### POST /v2/rates/bulk
-  added the new optional request property `rate_options/allOf[subschema #1: rate_request_body]/rate_type`


### POST /v2/rates/estimate
- :warning: added the new `quick` enum value to the `items/allOf[subschema #1: rate_estimate]/rate_type/allOf[subschema #1: rate_type]/` response property for the response status `200`


### GET /v2/rates/{rate_id}
- :warning: removed `#/components/schemas/se_id` from the `allOf[subschema #1: rate]/rate_id` response property `allOf` list for the response status `200`
- :warning: the response property `allOf[subschema #1: rate]/rate_id` became optional for the status `200`
- :warning: added the new `quick` enum value to the `allOf[subschema #1: rate]/rate_type/allOf[subschema #1: rate_type]/` response property for the response status `200`
- :warning: added `#/components/schemas/se_id, subschema #1` to the `allOf[subschema #1: rate]/rate_id` response property `oneOf` list for the response status `200`
- :warning: the `allOf[subschema #1: rate]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  added the optional property `allOf[subschema #1: rate]/carrier_weight` to the response with the `200` status
-  added the optional property `allOf[subschema #1: rate]/display_scheme` to the response with the `200` status
-  removed the optional property `allOf[subschema #1: rate]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rate]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rate]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rate]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rate]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rate]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: rate]/rate_details/items/` response property `allOf` list for the response status `200`


### GET /v2/shipments/{shipment_id}/rates
- :warning: removed `#/components/schemas/se_id` from the `allOf[subschema #1: rates_information]/created_at` response property `allOf` list for the response status `200`
- :warning: removed `#/components/schemas/se_id` from the `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_id` response property `allOf` list for the response status `200`
- :warning: removed `#/components/schemas/se_id` from the `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_id` response property `allOf` list for the response status `200`
- :warning: the response property `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_id` became optional for the status `200`
- :warning: the response property `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_id` became optional for the status `200`
- :warning: added the new `quick` enum value to the `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_type/allOf[subschema #1: rate_type]/` response property for the response status `200`
- :warning: added the new `quick` enum value to the `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_type/allOf[subschema #1: rate_type]/` response property for the response status `200`
- :warning: added `#/components/schemas/se_id, subschema #1` to the `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_id` response property `oneOf` list for the response status `200`
- :warning: added `#/components/schemas/se_id, subschema #1` to the `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_id` response property `oneOf` list for the response status `200`
- :warning: the `allOf[subschema #1: rates_information]/created_at` response's property `type/format` changed from `string/date-time` to `any` for status `200`
- :warning: the `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
- :warning: the `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/` response's property `type` changed from `object` to `any` for status `200`
-  added the optional property `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/carrier_weight` to the response with the `200` status
-  added the optional property `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/display_scheme` to the response with the `200` status
-  added the optional property `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/carrier_weight` to the response with the `200` status
-  added the optional property `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/display_scheme` to the response with the `200` status
-  the response optional property `allOf[subschema #1: rates_information]/created_at` became read-only for the status `200`
-  removed the optional property `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/rate_detail_type` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/amount` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/billing_source` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/carrier_billing_code` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/carrier_description` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/carrier_memo` from the response with the `200` status
-  removed the optional property `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/rate_detail_type` from the response with the `200` status
-  added `#/components/schemas/date_time` to the `allOf[subschema #1: rates_information]/created_at` response property `allOf` list for the response status `200`
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: rates_information]/invalid_rates/items/allOf[subschema #1: rate]/rate_details/items/` response property `allOf` list for the response status `200`
-  added `#/components/schemas/rate_detail` to the `allOf[subschema #1: rates_information]/rates/items/allOf[subschema #1: rate]/rate_details/items/` response property `allOf` list for the response status `200`

## Initial snapshot

Initial spec snapshot; no diff available.
