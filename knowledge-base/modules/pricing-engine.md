---
id: "jira-pricing-engine"
title: "Pricing & Promotions Engine"
system: "Pricing Engine"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","pricing-engine","crafttheme_mobility"]
last_synced: "2025-02-16T14:11:08.215Z"
ticket_count: 5
active_ticket_count: 3
---

# Pricing & Promotions Engine

> Auto-generated from 5 Jira tickets.
> Last synced: 2025-02-16T14:11:08.215Z
> Active features: 3
> Superseded: 2

## User Stories

### CMB-20958: Website - use the correct pricing details 

**Status:** Done | **Priority:** No Priority
**Created:** 2024-12-23

**Description:**
As a user, I want to view the detailed pricing breakdown for my ride on the web app, including base cost, discounts, taxes, and the final total to pay.

**Acceptance Criteria:**
- Price Breakdown:
- Ride Cost: Display the original price before any discounts or taxes.
- Field Used: original_estimated_cost
- Displayed As: Strikethrough value to indicate the original price.
- Discount: Show the total discount applied, including any promo code or automatic discount.
- Field Used:
- If an auto-discount is applied (autoDiscount.amount > 0), display this as the discount.
- If a coupon is used (coupon.isUsed = true), show the coupon discount instead.
- Displayed As: The applicable discount amount.
- Taxes: Show taxes applied to the ride.
- Field Used: Sum of values in the taxes[].amount array.
- Displayed As: Tax labels (e.g., "Stamp duty") and respective amounts.
- Total Price: Display the final price the user will pay after applying discounts and taxes.
- Field Used: estimated_cost_with_boost
- Displayed As: Total cost, including any applicable boost, discounts, and taxes.
- Currency: Display the currency used for the ride.
- Field Used: currency_label (localized currency label like "DA" for Algerian Dinar).
- Calculation Logic:
- Discount Calculation:
- If autoDiscount.amount > 0, show the auto-discount as the reduction.
- If a coupon is used, show the coupon discount.
- Final Price Calculation: The total should be the sum of the ride cost after discount, plus taxes.
- Ride Cost:
- Given the user views the pricing breakdown on the web app,
- When the ride has a base price,
- Then display the ride cost before applying any discounts, taxes, or boosts.
- Discount Details:
- Given a discount is applicable to the ride,
- When the discount is an automatic discount or a promo code,
- Then display the discount percentage and the actual discount amount as a deduction from the ride cost.
- Discounted Price:
- Given a discount is applied,
- When the discount amount is deducted from the ride cost,
- Then display the discounted price after applying the discount.
- Taxes:
- Given the ride includes applicable taxes,
- When the taxes are calculated,
- Then display each tax label (e.g., "Stamp duty") and its corresponding amount in the breakdown.
- Boost (if applicable):
- Given a boost is applied to the ride price,
- When the boost value is calculated,
- Then display the boost amount in the pricing breakdown.
- Total Price:
- Given the ride pricing breakdown is displayed,
- When all components (ride cost, discount, taxes, boost) are added together,
- Then display the final total price payable by the user.
- Currency:
- Given the ride is priced in a specific currency,
- When the pricing breakdown is displayed,
- Then display the localized currency label consistently with the user's region (e.g., "DZD").

---

### CMB-5674: Android - Hiding Trip Price Listing Services 

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-05-09

**Description:**
As a business rider on the Yassir Go app, I want to hide the pricing on the service listing screen, and trip requesting screen, so that the user will not be able to compare the different prices

**Acceptance Criteria:**
- Given-When-Then Scenarios:
- Scenario 1:
- Given a business rider switches to the business profile,
- When they access the service listing screen,
- Then they should not see any pricing information, only the service name and estimated time of arrival (ETA).
- Scenario 2:
- Given a business rider tries to book a trip from the business profile,
- When they reach the screen to request the trip,
- Then they should not see any pricing information on this screen.
- Scenario 3:
- Given a business rider tries to book a scheduled trip from the business profile
- When they reach the screen to request the trip, the have chosen the date and time of the scheduled trip
- Scenario 4:
- When they reach the screen to request the trip and tap in the Service info backdrop
- Then they should not see any pricing information on this screen only service description
- Scenario 5:
- Given a business rider has requested a trip from the business profile,
- When they are searching for a driver,
- Then they should only see the driver's name and vehicle details, and not see any pricing information. (we hide the  icon completely )

---

### CMB-2560: Design: Managing Service Types allowed: Configuration

**Status:** Done | **Priority:** P3 - Low
**Created:** 2022-12-19

**Description:**
As an OPs manager I need to be able to change the available listed service in a country, so that I'm sure that the BAM is choosing between a certain services with a certain pricing model

**Acceptance Criteria:**
- Services listed in market-based, it can differ from one market to another
- We need to have at least one service chosen
- When we remove a used service, we need to choose to which service the businesses
- We need to inform the BAM about the update in those services

---

## Consolidated Acceptance Criteria

- Price Breakdown:
- Ride Cost: Display the original price before any discounts or taxes.
- Field Used: original_estimated_cost
- Displayed As: Strikethrough value to indicate the original price.
- Discount: Show the total discount applied, including any promo code or automatic discount.
- Field Used:
- If an auto-discount is applied (autoDiscount.amount > 0), display this as the discount.
- If a coupon is used (coupon.isUsed = true), show the coupon discount instead.
- Displayed As: The applicable discount amount.
- Taxes: Show taxes applied to the ride.
- Field Used: Sum of values in the taxes[].amount array.
- Displayed As: Tax labels (e.g., "Stamp duty") and respective amounts.
- Total Price: Display the final price the user will pay after applying discounts and taxes.
- Field Used: estimated_cost_with_boost
- Displayed As: Total cost, including any applicable boost, discounts, and taxes.
- Currency: Display the currency used for the ride.
- Field Used: currency_label (localized currency label like "DA" for Algerian Dinar).
- Calculation Logic:
- Discount Calculation:
- If autoDiscount.amount > 0, show the auto-discount as the reduction.
- If a coupon is used, show the coupon discount.
- Final Price Calculation: The total should be the sum of the ride cost after discount, plus taxes.
- Ride Cost:
- Given the user views the pricing breakdown on the web app,
- When the ride has a base price,
- Then display the ride cost before applying any discounts, taxes, or boosts.
- Discount Details:
- Given a discount is applicable to the ride,
- When the discount is an automatic discount or a promo code,
- Then display the discount percentage and the actual discount amount as a deduction from the ride cost.
- Discounted Price:
- Given a discount is applied,
- When the discount amount is deducted from the ride cost,
- Then display the discounted price after applying the discount.
- Taxes:
- Given the ride includes applicable taxes,
- When the taxes are calculated,
- Then display each tax label (e.g., "Stamp duty") and its corresponding amount in the breakdown.
- Boost (if applicable):
- Given a boost is applied to the ride price,
- When the boost value is calculated,
- Then display the boost amount in the pricing breakdown.
- Total Price:
- Given the ride pricing breakdown is displayed,
- When all components (ride cost, discount, taxes, boost) are added together,
- Then display the final total price payable by the user.
- Currency:
- Given the ride is priced in a specific currency,
- When the pricing breakdown is displayed,
- Then display the localized currency label consistently with the user's region (e.g., "DZD").
- Given-When-Then Scenarios:
- Scenario 1:
- Given a business rider switches to the business profile,
- When they access the service listing screen,
- Then they should not see any pricing information, only the service name and estimated time of arrival (ETA).
- Scenario 2:
- Given a business rider tries to book a trip from the business profile,
- When they reach the screen to request the trip,
- Then they should not see any pricing information on this screen.
- Scenario 3:
- Given a business rider tries to book a scheduled trip from the business profile
- When they reach the screen to request the trip, the have chosen the date and time of the scheduled trip
- Scenario 4:
- When they reach the screen to request the trip and tap in the Service info backdrop
- Then they should not see any pricing information on this screen only service description
- Scenario 5:
- Given a business rider has requested a trip from the business profile,
- When they are searching for a driver,
- Then they should only see the driver's name and vehicle details, and not see any pricing information. (we hide the  icon completely )
- Services listed in market-based, it can differ from one market to another
- We need to have at least one service chosen
- When we remove a used service, we need to choose to which service the businesses
- We need to inform the BAM about the update in those services

## Superseded Features

> These features were overridden by newer tickets.

- ~~CMB-6078: iOS - Hiding Trip Price Listing Services~~ → Replaced by CMB-5674
- ~~CMB-20195: Website - Use the mobile pricing details~~ → Replaced by CMB-20958
