# Invoice Module

## Overview

The Invoice Module is a core financial subsystem of the Yassir Mobility B2B platform. It handles the automated and manual generation, distribution, tracking, and management of invoices for all corporate (B2B) clients across four operating countries: **Algeria (DZD)**, **Tunisia (TND)**, **Morocco (MAD)**, and **Senegal (XOF/CFA)**.

**Primary Users:**
- **Business Account Managers (BAMs):** View and download invoices via the B2B Corporate Portal (WebApp).
- **Operations Admins:** Generate, configure, export, and manage invoice statuses via the Admin Panel.
- **Sales Representatives:** Access bulk invoice exports and finance reports via Admin Panel Country Settings.
- **Finance Teams:** Consume exported finance reports and invoice files for reconciliation.

**Core Responsibilities:**
1. Generate monthly PDF invoices per enterprise (finished trips + adjusted trips as separate documents).
2. Apply country-specific tax rules, commissions, and multi-tier discounts.
3. Distribute invoices via email (to BAMs) and Slack (to internal teams).
4. Track invoice payment status (Paid/Unpaid) with proof-of-payment attachments.
5. Provide bulk export capabilities for invoices and finance reports.
6. Generate pre-payment invoices (factures d'avance) for advance payments.

---

## Features

### 1. Invoice Types

The system generates three distinct invoice types:

#### 1.1 Finished Trips Invoice (Facture de Consommation)
- **Trigger:** Generated automatically at the end of each billing cycle (monthly, quarterly, or yearly).
- **Content:** Covers all trips with status `FINISHED` within the billing period.
- **Structure:**
  - **Page 1 (Main Invoice):** Standard invoice with all financial details, trip cost breakdown, commissions, taxes, and a consolidated discount line showing the sum of T1 + T2 + T3 discounts.
  - **Page 2 (Annexe — Discount Details):** A table with four columns: "Discount Type," "Description," "Discount Percentage," and "Discount Amount (in Dinars/local currency)."
    - T1 (Remises) — Individual company discounts
    - T2 (Remises de Parrainage) — Referral reward discounts
    - T3 (Remises de Challenge) — Challenge cash-back discounts
  - **Note:** If no discounts are applied, the discount section/line is removed from the invoice entirely.

#### 1.2 Adjusted Trips Invoice (Facture d'Avoir)
- **Trigger:** Generated only when adjusted trips exist for the billing period. If no adjusted trips occurred, this invoice is **not generated**.
- **Content:** Covers all trips with status `ADJUSTED` within the billing period.
- **Header Details:**
  - `Avoir n°`: The adjusted trips invoice reference number (counter starts from 0).
  - `Facture n°`: Reference to the corresponding finished trips invoice for the same month.
  - Adjusted trips invoice date.
- **Naming Convention:** `NomEntreprise Mois Année - Avoir - Statut (Payée/NonPayée).pdf`

#### 1.3 Pre-Payment Invoice (Facture d'Avance)
- **Trigger:** Manually created by an Admin from the Admin Panel Payments section when a business makes an advance payment (online or bank transfer).
- **Content:** Documents advance payment amount before service consumption.
- **Template:** Follows the "Factures d'avance sur consommation" template.
- **Availability:** Created from both Online Payments and Bank/Cheque Transfers detail screens.
- **Constraint:** The "Create Pre-payment Invoice" button is disabled if a pre-payment invoice is already attached to the payment entry.

---

### 2. Invoice Template & Content

#### 2.1 Common Invoice Elements (All Countries)

Every invoice PDF contains:

- **Header:**
  - Yassir logo (rebranded)
  - Invoice reference number (serial number)
  - Invoice date
  - Billing period covered

- **Client Legal Information** (pulled from Enterprise Legal Details):
  - Legal Company Name
  - Legal Address (Building Number/Apt, Address Lines, City, Postal Code)
  - Country-specific tax identifiers (see §2.2)

- **Yassir Legal Information** (managed via Admin Panel → "Yassir's Legal Information"):
  - Enterprise Name
  - Address
  - RC Number
  - Bank & Agency
  - Capital Social
  - Bank Number
  - Support Phone Number
  - **Note:** Updates to Yassir's legal info reflect on both past and future invoices.

- **Financial Breakdown:**
  - **Prestation de chauffeur intervenant auprès de la plateforme** (Driver service fees) = sum(estimated cost − commission markup)
  - **Frais de développement et utilisation de la plateforme** (Platform development/commission fees) = sum(commission markup)
  - **Montant HT Total** (Total excl. tax) = Driver fees + Platform fees
  - **Discount line** (if applicable): Sum of T1 + T2 + T3 discounts (applied on HT)
  - **TVA** (Tax): Applied per country rules (see §3)
  - **Total TTC** (Total incl. tax)
  - **Reste à Payer** (Amount to be paid):
    - Prepaid plans: `0`
    - Postpaid plans: Due amount
    - Postpaid with remaining budget: `max(0, Total Consumed − Remaining Budget)`

- **Amount in Letters:** Equals TTC value (not "Reste à Payer"), written in the local language.

- **Footer (Algeria — Current as of CMB-28804):**
  - EURL YASSIR
  - Address: Zone d'activité Said Hamdine, Lot n11, Bir Mourad Rais, Alger, Algérie
  - Capital Social: 747,659,000 DZD
  - Tél: 021 99 99 95
  - AI: 16096247114
  - RC N°: 17 B 0999489-00/16
  - NIF N°: 001716099948978
  - NIS: 001716010111763
  - Banque: AGB GULF BANK ALGERIE
  - AGB N° 032 00028 2684431208 93
  - Agency: SIDI YAHIA, Algérie
  - Scanned stamp included on all invoices (per CMB-26985)
  - **Removed:** Oran office section, Constantine office section, duplicate account numbers

- **Footer (Tunisia — Current as of CMB-30860):**
  - YASSIR, Immeuble Kanzet, Rue du lac Tchad, Bloc B Bis, 1 étage, Apt B1, les berges du lac 1, 1053 Les Berges du Lac
  - Code TVA: 1582982RAM000
  - Banque: BIAT — Banque Internationale Arabe de Tunisie
  - IBAN: TN5908008000671002266478

- **Footer (Morocco):**
  - ICE: 002148105000084
  - IF: 26164744
  - RC: 413733
  - Address: 9 AV 2 MARS, 2ND FLOOR, CASABLANCA
  - CNSS: 1175605

- **Footer (Senegal):**
  - Yassir Sénégal Sarl
  - Address: Lot n° A W01 Cité Keur Gorgui — Sacré Coeur 3
  - NINEA N°008922522D2
  - RCCM N° SN.DKR.2021.B36050

#### 2.2 Country-Specific Client Legal Fields

| Field | Algeria | Tunisia | Morocco | Senegal |
|-------|---------|---------|---------|---------|
| Legal Company Name | ✓ | ✓ | ✓ | ✓ |
| Legal Address | ✓ | ✓ (Billing) | ✓ | ✓ |
| City (Dropdown) | ✓ | ✓ | ✓ | ✓ |
| Postal Code (Numeric) | ✓ | ✓ | ✓ | ✓ |
| NIF | ✓ | — | — | — |
| NIS | ✓ | — | — | — |
| RC | — | — | ✓ | — |
| AI | ✓ | — | — | — |
| ICE | — | — | ✓ | — |
| IF (Tax ID) | — | — | ✓ | — |
| MF (Tax Number) | — | ✓ | — | — |
| NINEA | — | — | — | ✓ |
| ID de la société | — | — | — | ✓ |
| Payment Terms | — | ✓ (Transfer/Cheque) | — | — |

- All legal fields are **optional** and empty by default.
- Invoices can be generated even if some or all legal fields are empty.
- Fields (except Date and Postal Code) accept both numbers and letters.
- Postal Code: Numeric only; invalid formats trigger a validation error.

#### 2.3 Invoice Language

- **Algeria:** All invoices are generated in **French** (CMB-11347).
- **Other countries:** Follow the Reports Language setting configured in the BAM's Account → Settings (French or English).
- Invoice email subject and body also follow this language setting.

---

### 3. Tax (TVA) Rules

#### 3.1 Tax Rates by Country

| Country | Tax Rate | Applied On | TVA Label (Current) |
|---------|----------|------------|---------------------|
| Algeria | 19% | Total amount (HT) | TVA LF 2026 (per CMB-35952, in review) |
| Tunisia | 19% | Commission amount only | TVA |
| Morocco | 20% | Commission amount only | TVA |
| Senegal | 18% | Total amount (HT) | TVA |

- **Tunisia & Morocco (CMB-23152):** VAT is calculated as `Tax Rate × Commission Amount` (not total trip cost). This means:
  - `TVA = 19% × Frais de développement et utilisation de la plateforme` (Tunisia)
  - `TVA = 20% × Frais de développement et utilisation de la plateforme` (Morocco)

- **Algeria (CMB-35952, in review):** TVA label should display "TVA LF 2026" instead of just "TVA" on both finished and adjusted trip invoices.

#### 3.2 Tax Toggle

- Each enterprise has a **tax toggle** (enabled by default) in the Legal Information section.
- When disabled: Tax is not applied and does not appear on the invoice as added value.
- When enabled: Tax is automatically calculated and deducted from each trip cost upon completion.

#### 3.3 Tunisia-Specific: Timbre Fiscal

- **Rule (CMB-30860):** A timbre fiscal of 1 TND is added to each generated invoice.
- **Exception (CMB-35046):** If the timbre fiscal amount = 0, it is removed from the invoice.
- **Currency note:** Amount in letters uses "dinars et millimes" (not "centimes").

---

### 4. Commissions

#### 4.1 B2B Commission (Platform Fee)

- **Definition:** A percentage markup applied on top of the base trip fare.
- **Formula:** `Final B2B Price = Base Trip Price + (Base Trip Price × Commission %)`
- **Default Values:**
  - Algeria: **19%**
  - Morocco, Tunisia, Senegal: **0%**
- **Configuration:** Set per-enterprise via Admin Panel → Enterprise Information → "Set Commission" button.
- **Decimal Support (CMB-12297):** Commission values accept decimal/float inputs (e.g., 1.25%, -0.5%).
- **Negative Commissions (CMB-10943):** Supported. When a negative commission is applied, it reduces the platform development cost line on the invoice. The system handles display to avoid showing negative values in the development cost line.
- **Impact:** Affects trip price estimation (visible to BAM on booking), invoice line items, budget deductions, and CSV exports.
- **Driver Earnings:** Not impacted by B2B commissions. `Driver Commission = 80% × Base Cost`.
- **Rider Visibility:** The commission-adjusted price is visible to the Business Rider during trip estimation/service listing.

---

### 5. Discounts

Three tiers of discounts exist, all applied on the **HT (pre-tax)** amount of the invoice:

#### 5.1 T1 — Individual Company Discounts (Remises)

- **Configuration:** Admin Panel → Enterprise Information → "Set Discount" / "Edit Discount" / "Clear Discount."
- **Condition Types:**
  - **Spending Amount:** Monthly spend exceeds threshold (e.g., > 20,000 DZD).
  - **Ride Count:** Monthly finished trips exceed threshold (e.g., > 100 trips).
- **Reward:** Refund percentage of consumed budget (e.g., 10% → 20,000 DZD consumed → 2,000 DZD refund).
- **Validation Limits:**
  - Spending amount: 0 to 10,000,000
  - Number of trips: 0 to 1,000,000
  - Discount percentage: 0% to 50%
- **Calculation:** Automatic at end of billing period.
- **Invoice Display:** Shown on the invoice as a refund in a dedicated discount section. For quarterly/yearly invoices, all monthly discounted values, percentages, and corresponding months are included.

#### 5.2 T2 — Referral Reward Discounts (Remises de Parrainage)

- **For Postpaid Companies:** `Reward = P% (discount %) × invoice amount`, capped at a price limit. Applied as a discount on the monthly invoice. Due budget adjusted: `Due Budget = Due Budget − Reward`.
- **For Prepaid Companies:** Reward = X number of free trips (each trip capped at a price limit). Free trips show the estimated price struck through with 0 displayed; the estimation is not deducted from the budget.
- **Finance Report Columns:**
  - Postpaid: T2 Discount Value, T2 Discount %
  - Prepaid: Free Trips Count, Total Amount of Free Trips
- **Trips Export:** Includes columns for estimated price and a `FREE TRIP` column (YES/NO).

#### 5.3 T3 — Challenge Cash-Back Discounts (Remises de Challenge)

- **Trigger:** Businesses earn cash-back percentages by completing ride challenges (gamification).
- **Processing:** Cash-back is processed within the billing cycle of the challenge's validity end date.
- **Invoice Display:** Reflected within T2 section (as a Type 2 discount).
- **Finance Report Columns:** Challenge Cash-back %, Challenge Cash-back Value.
- **Rules:**
  - Finished trips cancelled from DashOps do not impact the challenge progress counter.
  - Payment plan changes do not impact the finished trips counter progress.
  - Company deletion: Challenge cash-backs are not processed.
  - Company deactivation: Challenge progress is set ON-HOLD, resumed if the business is reactivated while the challenge is still ongoing.
  - Individual discount + challenge cash-back: Both are applied; sum of discounts applied on HT.

---

### 6. Invoice Serial Numbers

#### 6.1 Format

- **V2 Platform Invoices:** Serial number starts with `B V.2` followed by a unique counter per business.
  - Example: `B V.2.1`, `B V.2.2`, etc.
  - Counter starts at 1 for the first invoice of each business and increments sequentially.
- **V1 Platform Invoices (Legacy):** Follow the original sequential format without the "B V.2" prefix.
- **Adjusted Trips Invoice Reference:** `Avoir n°` counter starts from 0 per business.

#### 6.2 Serial Number Rules

- Sequential numbering starts from 001 per country per month for all businesses.
- When businesses migrate from V1 to V2, serial numbers are preserved from V1; only legal info is updated.
- 0-trip invoices include the correct month/year in reference and the counter follows format `V.2.x - Timestamp - Date`.

#### 6.3 Tunisia-Specific (CMB-30860)

- Format: `N° 2025-000XXX` (e.g., `N° 2025-000130`)

---

### 7. Invoice Generation

#### 7.1 Automatic Generation (Cronjob)

- Invoices are generated automatically at the end of each billing period via a background worker.
- **Migration (CMB-29897):** Invoice generation background task migrated from Pub/Sub to Cloud Tasks for reliability.
- The system uploads invoices directly from the cronjob to avoid missing invoices on individual runs (CMB-1699).

#### 7.2 Manual Generation

- Admins can manually generate invoices from the Admin Panel → Enterprise Details → Payments → "Generate an invoice" button.
- Available for both current and historical periods.

#### 7.3 Billing Periods

- **Monthly (Default):** Covers 1st to last day of the month. Example: Business created May 22 → Invoice covers May 1–31.
- **Quarterly:** Covers 3-month periods. Example: Business created May 22 → Invoice covers Apr 1–Jun 30.
- **Yearly:** Covers Jan 1–Dec 31 of the year.
- **Configuration:** Set per-enterprise via Admin Panel → Enterprise Information → Edit Legal Information → Payment Period dropdown.
- **Assumption:** Once a company's billing period is set, it does not change.

#### 7.4 Zero-Trip Invoices

- **Algeria, Morocco, Senegal:** Invoices with 0 value are generated for businesses with no trips during the period (including inactive businesses and migrated businesses with no trips).
- **Tunisia (CMB-35047):** Invoices are **NOT generated** for businesses with no finished trips.
- **Payment Status:** If the invoice amount is 0, the status should **not** be "Unpaid" (CMB-22146).

#### 7.5 Individual vs. Company Account Type

- **Account Type Toggle:** Admin Panel → Enterprise Legal Information → Radio button for "Individual" or "Company."
- **Default:** Individual (for previously created companies, default is Company — CMB-15775 Scenario 6).
- **Impact on Invoice:**
  - **Company:** Standard invoice, sent per billing period (monthly/quarterly/yearly).
  - **Individual:** Invoice format changes to per-trip invoices.
- **DashOps Integration (CMB-20043):**
  - Individual-labeled businesses: "Send Invoice" button enabled on the trip details screen; invoice sent to rider's inbox.
  - Company-labeled businesses: "Send Invoice" button is **disabled** on DashOps.
- Account type changes are logged in the transaction table.

---

### 8. Invoice Distribution

#### 8.1 Email Delivery (to BAMs)

- **Automatic Emails:** Sent to the registered Super Admin's email at the end of each billing cycle.
- **Email Content:**
  - Subject: "Yassir Business Invoice"
  - Attachment: PDF invoice
  - Language: Follows the enterprise's configured Reports Language setting (French or English).
- **Rebranding (CMB-9947, CMB-8452):** All invoice emails use the updated Yassir logo and brand colors.
- **Frequency Configuration (CMB-18460):**
  - Admin Panel → Enterprise Information → Edit Legal Information → Frequency dropdown.
  - Options: Monthly (default), Quarterly, Yearly.
  - Changing frequency takes effect from the next billing period.

#### 8.2 Slack Delivery (to Internal Teams) — CMB-19502

- Finance reports and invoice files are exported and sent to a pre-configured Slack channel (not email).
- If export fails, an error message is sent to Slack: "Export Failed: File generation error."
- File formats: CSV and Excel.
- **No email notification** is sent when export completes via Slack.

#### 8.3 Instant Download (CMB-27108)

- When Admins click "Request Invoice" for monthly invoices, the file downloads **instantly** to their device (not sent via email).
- The download includes only businesses that made trips during the selected month (TTC ≠ 0).
- Invoice links within the download are clickable.

---

### 9. Invoice Management (Admin Panel)

#### 9.1 Viewing Invoices

- **Location:** Admin Panel → Enterprise Details → Payments tab → Previous Invoices widget → "See All."
- **Display:** Monthly cards (e.g., "November 2025") with:
  - Status: Color-coded — Green for Paid, Red for Unpaid.
  - Payment Date (e.g., "Paid on Dec 27, 2025").
- **Filters:** All invoices, Paid invoices, Unpaid invoices.
- **Sections:** Separate views for Monthly, Quarterly, and Yearly invoices.

#### 9.2 Payment Status Management (CMB-16390, CMB-20026)

- **Default Status:** All new invoices are marked as **"Unpaid"** (including all previously generated invoices).
- **Exception:** Invoices with 0 amount are not marked as Unpaid (CMB-22146).
- **Marking as Paid:**
  - Admin selects "Update payment status" on a specific invoice.
  - **Required inputs:**
    - Amount Paid (validation: cannot be 0 or unreasonably large like 1,000,000 — CMB-17031)
    - Date of Payment (validation: cannot be historical dates like 1900 — CMB-17031)
    - Proof of Payment: **Mandatory** — either a URL link or uploaded file (PDF/Docx/Image). Button is disabled without attachment (CMB-20026).
  - The status update date is saved.
  - Transaction table records: admin name, timestamp, clickable link to payment statement.
- **Marking as Unpaid:** Admin can revert a Paid invoice back to Unpaid.
- **File Naming Convention:** `Company Name - Month/Year - Paid/Unpaid.pdf`

#### 9.3 Bulk Invoice Download (CMB-14918)

- **Location:** Admin Panel → Country Settings → "Download All Invoices" button.
- **Workflow:**
  1. Admin clicks the download button.
  2. Selects month and year.
  3. Receives a CSV file containing all invoices for all companies for that month.
- **CSV Columns:** Company Name, BAM Name, Email, Phone Number, Invoice Link.
- **Quarterly/Yearly:** Downloaded in overlapping cycles. If downloading for a month (e.g., February), all Q1 invoices and yearly invoices for companies with those configurations are included (only if already generated).
- **Delivery (Current):** Sent to Slack (not email) per CMB-19502.

#### 9.4 Historical Invoice Import (CMB-25819)

- Previous invoices from 2019–2022 were imported as hard copies matching the current invoice format.

#### 9.5 Invoice Naming Convention (CMB-26715, CMB-27065)

- **Finished Trips:** `NomEntreprise Mois_Année - Statut.pdf`
- **Adjusted Trips:** `NomEntreprise Mois Année - Avoir - Statut (Payée/NonPayée).pdf`
- Historical invoices (2021–2024) were retroactively renamed to follow this convention.

---

### 10. BAM Invoice Access (WebApp)

#### 10.1 Payment Screen

- **Location:** B2B Corporate Portal → Payments section.
- **Display varies by payment plan:**
  - **Prepaid:** Remaining Budget, Top-up Budget button, Payment Plan label, Invoices, Payment Receipts.
  - **Postpaid:** Invoices, Payment Plan, Monthly Budget, Budget/Due Budget, Pay Due Budget button, Payment Receipts.

#### 10.2 Previous Invoices Widget (CMB-7749)

- Located on the Payments screen.
- **Label adapts to billing period:**
  - Monthly: "Previous Monthly Invoices" (displayed as "September 2023")
  - Quarterly: "Previous Quarters Invoices" (displayed as "Quarter 1, 2023")
  - Bi-Annual/Yearly: "Previous Half Invoices" (displayed as "Half 1st, 2023")
- Labels include correspondence in the configured language.
- Only months/quarters when the business was operating are listed.
- If no invoices exist, a message indicates no invoices are available.
- Clicking an invoice downloads it as a PDF.

#### 10.3 Payment Receipts (CMB-32859)

- **Location:** WebApp → Payments → Payment Receipts banner.
- **Table Columns:** Payment Receipt Number, Date, Time, Transaction Amount, Payment Method (Satim, Dahabia, Bank Transfer/Cheque).
- BAMs can upload bank transfer proof (picture or PDF file) via the Bank Transfer option.

---

### 11. Finance Report (CMB-16389, CMB-20818, CMB-20897, CMB-26722)

#### 11.1 Export

- **Location:** Admin Panel → Country Settings → Payment → Finance Report export.
- **Trigger:** Available at end of month; can be exported for any past month.
- **Delivery:** Sent to Slack channel (not email).
- **Format:** CSV / Excel.

#### 11.2 Report Columns (Current — consolidated from all updates)

| Column | Description |
|--------|-------------|
| COMPANY NAME | Enterprise name |
| BAM NAME | Business Account Manager name |
| BAM EMAIL | BAM's email address |
| BAM PHONE NUMBER | BAM's phone number |
| BUDGET LEFT | Current remaining budget |
| INVOICE REF# | Invoice reference number |
| T1 DISCOUNT VALUE | Individual discount amount (renamed from "DISCOUNT APPLIED") |
| T1 DISCOUNT % | Individual discount percentage (renamed from "DISCOUNT APPLIED %") |
| T2 DISCOUNT VALUE | Referral reward discount amount (postpaid) |
| T2 DISCOUNT % | Referral reward discount percentage (postpaid) |
| FREE TRIPS COUNT | Number of free trips rewarded (prepaid) |
| TOTAL AMOUNT OF FREE TRIPS | Sum of estimated cost of rewarded free trips (prepaid) |
| CHALLENGE CASH-BACK % | Challenge discount percentage |
| CHALLENGE CASH-BACK VALUE | Challenge discount amount |
| B2B COMMISSIONS % | Commission percentage (not decimal) |
| B2B COMMISSIONS VALUE | Commission monetary value |
| DATE OF INVOICE | Invoice issue date |
| PAYMENT PLAN | Prepaid or Postpaid |
| INVOICE DURATION | Monthly / Quarterly / Annually |
| INVOICE AMOUNT | Total invoice amount |
| SALES REP NAME | Name of assigned sales representative |
| SALES REP EMAIL | Sales rep email |
| SALES REP PHONE | Sales rep phone number |
| FINISHED TRIPS COUNT | Number of finished trips per company per month |

- **Sales Rep Data:** Reflected on all finance reports (including previous months) if assigned during the period.
- **Note:** Downloading invoices for a month only downloads invoices generated in that month, regardless of the duration the invoice covers.

---

### 12. Trips Export (Country Settings)

#### 12.1 Export Options (CMB-16273)

- **Location:** Admin Panel → Country Configuration → Trip Export.
- **Two Export Types:**
  1. **Finished Trips Export:** All finished + adjusted trips within the date range. Trip values must match invoice values.
  2. **Requested Trips Export:** All trips created within the date range regardless of status (finished, cancelled, scheduled, etc.).

#### 12.2 Export Columns (CMB-26986, CMB-27760)

The export file follows a specific column order with additional columns:
- Columns 7 & 8 (per CMB-26986): Populated only if the export covers the 1st to end of month; otherwise empty.
- Columns 9 & 10 (per CMB-27760): Adjusted trips details — populated only if the export covers the 1st to end of month; otherwise empty.
- A `FREE TRIP` column with values YES/NO.
- An estimated price column.

---

### 13. Payment Section (Admin Panel — CMB-32860)

#### 13.1 Structure

The Admin Panel Payments section contains two sub-sections:
1. **Online Payments**
2. **Cheque / Bank Transfers**

#### 13.2 Common Table Columns

| Column | Description |
|--------|-------------|
| Month | Displayed in letters |
| Transfer Date | Online payment date or bank receipt upload date |
| Amount | Top-up amount |
| Business Name | Name of the business |
| Budget Top-up Status | "In progress" or "Done" (manually toggleable by admin) |
| Action | "Create pre-payment invoice" / "See all details" |

#### 13.3 Online Payment Details

Additional columns: Value Date (manually filled by admin), Code 1, Code 2, Attachments (pre-payment invoice + payment receipt).

#### 13.4 Bank/Cheque Transfer Details

Additional columns: Code 1, Code 2, Attachments (pre-payment invoice).

#### 13.5 Notifications

- **Business uploads bank receipt:** Notification to admins: "Business X has uploaded a cheque / payment receipt for a completed bank Transfer." Clicking redirects to the corresponding bank transfer details.
- **Pre-payment invoice created:** Notification: "Admin A has created a pre-payment invoice for Business X."
- **Admin comment added:** Notification: "Admin A has added a comment on Business X's pre-payment invoice."
- **Online top-up:** Existing notification redirects to the payment details screen.

#### 13.6 Activity Logs

Records: status updates of budget top-up, creation of pre-payment invoices, dates of online top-ups or bank receipt uploads.

---

### 14. Payment Receipt Footer (CMB-32854)

- The payment receipt footer is updated to match Yassir's legal information (identical to the invoice footer).
- The payment receipt format is visually identical to invoices.

---

### 15. Yassir's Legal Information Management (CMB-29387)

- **Location:** Admin Panel → Side Menu → "Yassir's Legal Information."
- **Fields:** Enterprise Name, Address, RC Number, Bank, Agency, Capital Social, Bank Number, Support Phone Number.
- **Default State:** Non-editable (view-only). Click "Edit" to enable editing.
- **Impact:** Changes reflect on **both past and future** invoices and payment receipts.
- **Permissions:** Only admins with the "Yassir's Legal Information" permission can view and access this section.

---

## Business Rules Summary

1. **Tax Toggle:** Enabled by default per enterprise. When disabled, no tax appears on invoices.
2. **Tax on Commission (TN/MA):** VAT applies to commission amount only, not total trip cost.
3. **Tax on Total (DZ/SN):** VAT applies to full HT amount.
4. **Commission Default:** Algeria = 19%, others = 0%. Accepts decimals and negative values.
5. **Discount Limit:** T1 discount percentage capped at 0–50%.
6. **Discount Calculation Order:** Discounts applied on HT, then tax calculated on (HT − Discount).
7. **Invoice for 0 Amount:** Generated (except Tunisia), status should NOT be Unpaid.
8. **Tunisia No-Trip Rule:** Invoices are not generated for Tunisian businesses with 0 finished trips.
9. **Adjusted Invoice Conditional:** Only generated when adjusted trips exist for the period.
10. **Billing Period Immutability:** Once set, the billing period for a company does not change.
11. **Prepaid "Reste à Payer":** Always 0.
12. **Postpaid "Reste à Payer":** Equals due amount; if remaining budget exists, it's `max(0, Total − Remaining Budget)`.
13. **Serial Number Prefix:** V2 invoices use "B V.2" prefix; V1 invoices retain legacy format.
14. **Serial Numbering:** Sequential per business, per country, per month, starting from 001.
15. **Invoice Language:** Algeria = French always. Others = per Reports Language setting.
16. **Payment Status Default:** All invoices default to Unpaid (exception: 0-amount invoices).
17. **Payment Proof Required:** Cannot mark invoice as Paid without attaching proof (URL or file).
18. **Export Date Range Limit (Trips):** Maximum 31 days per export request.
19. **Amount in Letters:** Equals TTC value. Tunisia uses "dinars et millimes."
20. **Currency per Country:** DZD (Algeria), TND (Tunisia), MAD (Morocco), XOF (Senegal). Invoices must use correct currency (CMB-22609).
21. **Timbre Fiscal (Tunisia):** 1 TND per invoice; removed if = 0.
22. **Individual Account:** Invoices sent per trip from DashOps. Company Account: Standard periodic invoices.
23. **Driver Earnings:** Not impacted by B2B commissions.
24. **Referral Free Trips (Prepaid):** Estimated price shown struck-through, 0 displayed, budget not deducted.
25. **Challenge ON-HOLD:** If business deactivated, challenge progress paused; resumed on reactivation if challenge still active.

---

## Data Flow

### Invoice Generation Pipeline

```
1. TRIGGER
   ├── Automatic: End-of-period cronjob (Cloud Tasks)
   └── Manual: Admin clicks "Generate Invoice"

2. DATA COLLECTION
   ├── Fetch all FINISHED trips for the enterprise within billing period
   ├── Fetch all ADJUSTED trips for the enterprise within billing period
   ├── Fetch enterprise legal info (client details)
   ├── Fetch Yassir legal info (from admin-managed section)
   ├── Fetch commission %, tax toggle, tax rate (country-based)
   └── Fetch discount rules (T1/T2/T3) and calculate amounts

3. CALCULATION
   ├── Base Trip Cost = Sum of all trip base costs
   ├── Commission = Base Cost × Commission %
   ├── HT = Base Trip Cost + Commission
   ├── Discounts = T1 + T2 + T3 (applied on HT)
   ├── Taxable Amount = HT − Discounts (or Commission only for TN/MA)
   ├── TVA = Tax Rate × Taxable Amount
   ├── Timbre Fiscal (Tunisia only, if > 0)
   ├── TTC = HT − Discounts + TVA + Timbre Fiscal
   └── Reste à Payer = 0 (prepaid) or Due Amount (postpaid)

4. GENERATION
   ├── Generate Finished Trips Invoice PDF (with Annexe page if discounts)
   ├── Generate Adjusted Trips Invoice PDF (only if adjusted trips exist)
   └── Generate Pre-payment Invoice PDF (manual trigger only)

5. DISTRIBUTION
   ├── Email to BAM (with PDF attachment)
   ├── Slack to internal team (CSV/Excel for bulk exports)
   └── Direct download (Admin Panel instant download)

6. STORAGE
   ├── Invoice PDF stored and linked to enterprise
   ├── Serial number incremented
   └── Payment status set to Unpaid (or appropriate for 0-amount)
```

---

## Integration Points

| System | Integration |
|--------|-------------|
| **B2B Corporate Portal (WebApp)** | BAMs view/download invoices, upload payment receipts, access payment section |
| **Admin Panel** | Invoice generation, status management, legal info configuration, finance reports, bulk exports |
| **DashOps** | Send per-trip invoices to Individual-type businesses; trip data feeds into invoice calculations |
| **Pricing Engine** | Commission rates, dynamic pricing, and trip cost calculations feed into invoice line items |
| **Referral Module** | T2 discount values, free trip counts, referral reward rules |
| **Challenge Module** | T3 discount values, challenge cash-back percentages |
| **Transaction Table** | All invoice status changes, payment plan switches, legal info updates logged |
| **Slack** | Finance reports and bulk invoice files delivered to configured channels |
| **Email System** | Periodic invoice PDFs sent to BAMs; rebranded email templates |
| **Cloud Tasks** | Background invoice generation migrated from Pub/Sub (CMB-29897) |
| **Country Configuration** | Tax rates, legal entity info, export settings managed per country |

---

## Testing Considerations

### Critical Areas for Regression Testing

1. **Multi-Country Tax Calculation:**
   - Verify VAT on commission only for Tunisia (19%) and Morocco (20%).
   - Verify VAT on total for Algeria (19%) and Senegal (18%).
   - Verify tax toggle on/off behavior per enterprise.
   - Verify TVA label shows "TVA LF 2026" for Algeria (when CMB-35952 is merged).

2. **Invoice Generation with All Discount Combinations:**
   - T1 only, T2 only, T3 only, T1+T2, T1+T3, T2+T3, T1+T2+T3.
   - Verify Annexe page (Page 2) appears with correct breakdown when any discount exists.
   - Verify no discount line/section when no discounts are applied.

3. **Adjusted Trips Invoice:**
   - Verify separate PDF generated only when adjusted trips exist.
   - Verify `Avoir n°` reference starts from 0.
   - Verify header includes corresponding `Facture n°` for the same month.
   - Verify no adjusted invoice generated when no adjusted trips exist.

4. **Zero-Trip Invoices:**
   - Verify 0-value invoices are generated for DZ/MA/SN.
   - Verify 0-value invoices are NOT generated for Tunisia.
   - Verify payment status is not "Unpaid" for 0-amount invoices.

5. **Commission Edge Cases:**
   - Decimal commissions (e.g., 1.25%).
   - Negative commissions (verify display on invoice doesn't show negative development cost).
   - 0% commission.
   - Very high commission values.

6. **Payment Status Workflow:**
   - Cannot mark as Paid without proof attachment (button disabled).
   - Cannot use invalid date (e.g., 1900) or amount (0 or extreme values).
   - Status toggle between Paid ↔ Unpaid.
   - Transaction table records all status changes with admin name and timestamp.

7. **Currency Correctness:**
   - DZD for Algeria, TND for Tunisia, MAD for Morocco, XOF for Senegal.
   - Verify currency appears correctly on all invoice elements.

8. **Serial Number Integrity:**
   - V2 format "B V.2.X" for new invoices.
   - Sequential incrementing per business.
   - Tunisia format "N° YYYY-000XXX."
   - No duplicate serial numbers.

9. **Billing Period Calculations:**
   - Monthly: Verify 1st to last day of month coverage.
   - Quarterly: Verify correct 3-month spans.
   - Yearly: Verify Jan 1 to Dec 31 coverage.

10. **Pre-Payment Invoice:**
    - Created from both Online and Bank Transfer sections.
    - Button disabled when pre-payment invoice already attached.
    - Correct template used.

11. **Finance Report Accuracy:**
    - All columns present and correctly populated.
    - Sales rep data reflected retroactively.
    - B2B commissions as percentage (not decimal).
    - Discount columns renamed (T1 DISCOUNT VALUE/%).

12. **Export File Integrity:**
    - Trips export: Columns 7-8 and 9-10 conditional on full-month range.
    - FREE TRIP column (YES/NO) present.
    - File format (CSV/Excel) intact.

### Known Historical Bugs to Watch For

- Missing legal information on generated invoices (CMB-21798, CMB-21872 — both cancelled but pattern exists).
- Wrong currency on invoices for non-Algerian countries (CMB-22609).
- Finance report missing B2B commissions or showing incorrect format (CMB-17105).
- Invoice download notification saying "Your download has started" when it's actually an email (CMB-18340 — fixed).
- Negative values in development cost line when negative commission applied (CMB-10943).
- Missing invoices after generation (CMB-21702).
- Invoice amount/TTC mismatch when discounts not visible (CMB-29083).
- Missing second page (Annexe) of invoice (CMB-29206).

---

## Changelog

| Ticket | Date | Change |
|--------|------|--------|
| CMB-385 | 2022-08 | Updated bill template footer: EURL YASSIR, SGA bank details, new addresses |
| CMB-525 | 2022-09 | Monthly Excel sheet generation with all company invoice links |
| CMB-623 | 2022-09 | Fixed AI number across all invoice templates |
| CMB-1699 | 2022-11 | Upload invoices directly from cronjob to avoid missing invoices |
| CMB-3242 | 2023-02 | Prepaid→Postpaid plan switching with budget settlement on invoices |
| CMB-3243 | 2023-02 | Transaction/action logs for budget changes and plan switches |
| CMB-4365 | 2023-03 | Added Yassir legal details per country (TN, SN, MA, DZ) on invoices |
| CMB-4368 | 2023-03 | Country-specific invoice PDF templates with all legal fields |
| CMB-5608 | 2023-05 | Added enterprise legal info tab with country-specific fields, tax toggle, payment period |
| CMB-7749 | 2023-07 | BAM can download previous invoices from WebApp payment screen |
| CMB-7752 | 2023-07 | B2B commission percentage feature with invoice breakdown |
| CMB-7753 | 2023-07 | Business discount (T1) with configurable conditions and invoice display |
| CMB-7782 | 2023-07 | Updated RIB to `032 00001 2684431208 85` |
| CMB-8102 | 2023-08 | Admin Panel invoice download for operations managers |
| CMB-8452 | 2023-08 | Rebranded invoices with new Yassir colors and logo |
| CMB-9246 | 2023-09 | Invoice refactoring epic: accuracy for commissions, driver/Yassir split |
| CMB-9247 | 2023-09 | Invoice shows separate Driver Commissions and Yassir Commissions |
| CMB-9248 | 2023-09 | "Amount to be Paid" = 0 for prepaid, due amount for postpaid |
| CMB-9573 | 2023-10 | Tax auto-deduction per trip; taxes included in cost estimates and invoices |
| CMB-9947 | 2023-10 | Rebranded all email templates including invoice emails |
| CMB-10617 | 2023-11 | Updated bank information on Algerian invoices |
| CMB-10943 | 2023-12 | Handled negative commission display on invoice dev costs |
| CMB-11022 | 2023-12 | Sequential invoice serial numbers starting from 001 per country/month |
| CMB-11347 | 2023-12 | Algeria invoices always in French; removed "Raison Social"; removed empty discount field; updated AGB N° |
| CMB-11902 | 2024-01 | V1→V2 migration: updated legal info on invoices, preserved bank/budget/serial |
| CMB-11903 | 2024-01 | V2 serial number format "B V.2" prefix |
| CMB-12297 | 2024-02 | Decimal/float values accepted for commission percentage |
| CMB-13145 | 2024-03 | "Net à payer" → "Reste à Payer"; amount in letters = TTC; "LF 2024" next to TVA; legal details reordered |
| CMB-13479 | 2024-03 | Generated March invoices for old B2B platform in French |
| CMB-13588 | 2024-04 | Old B2B invoice edits: Prepaid Reste à Payer = 0; Postpaid removes Reste à Payer line, writes TTC in letters |
| CMB-14583 | 2024-05 | Wording changes on invoices (starting end of May) |
| CMB-14882 | 2024-05 | Added stamp to Tunisia invoices (bottom-right corner) |
| CMB-14918 | 2024-05 | Bulk invoice download via Country Settings |
| CMB-15065 | 2024-05 | 0-trip invoices generated with 0 value for all scenarios |
| CMB-15775 | 2024-07 | Individual/Company account type toggle; impacts invoice format |
| CMB-16273 | 2024-07 | Trips export update: Finished At and Requested At options |
| CMB-16380 | 2024-07 | Updated Yassir legal address on invoices |
| CMB-16389 | 2024-07 | Monthly finance report with comprehensive columns |
| CMB-16390 | 2024-07 | Invoice payment status management (Paid/Unpaid), filters, file naming |
| CMB-18460 | 2024-10 | Configurable invoice email frequency (monthly/quarterly/yearly) |
| CMB-19502 | 2024-11 | Finance report and invoice files exported via Slack (not email) |
| CMB-20026 | 2024-11 | Payment statement attachment required when marking invoice as Paid |
| CMB-20043 | 2024-11 | DashOps: Send Invoice for Individual-labeled businesses |
| CMB-20818 | 2024-12 | Finance report updated with sales rep data and finished trips count |
| CMB-20897 | 2024-12 | T1/T2 discount columns on finance report; referral rewards on invoices |
| CMB-22146 | 2025-01 | 0-amount invoices should not be marked Unpaid |
| CMB-22609 | 2025-02 | Fixed multi-country currency handling on invoices |
| CMB-23152 | 2025-02 | VAT on commission only for Tunisia (19%) and Morocco (20%) |
| CMB-25819 | 2025-05 | Imported historical invoices 2019–2022 |
| CMB-26243 | 2025-06 | Referral 2.0: T2 discounts on invoices, free trips for prepaid |
| CMB-26715 | 2025-06 | PDF naming convention applied to 2021–2024 invoices |
| CMB-26722 | 2025-06 | Challenge cash-back processing reflected on invoices and finance reports (T3) |
| CMB-26750 | 2025-06 | Per-company referral reward rules reflected on invoices |
| CMB-26985 | 2025-06 | Monthly invoice update: added stamp, removed Oran/Constantine sections, Baba Hassen agency |
| CMB-26986 | 2025-06 | Trips export updated with new columns from Country Settings |
| CMB-27065 | 2025-07 | **Two invoices per month:** Finished trips + Adjusted trips (facture d'avoir) with Annexe page |
| CMB-27108 | 2025-07 | Monthly invoice instant download (not email) |
| CMB-27155 | 2025-07 | Fixed VAT applied incorrectly on DZA companies |
| CMB-27760 | 2025-07 | Adjusted trips details added to Country Settings export file |
| CMB-28804 | 2025-08 | **Updated bank number:** AGB N° 032 00028 2684431208 93; agency changed to SIDI YAHIA |
| CMB-29206 | 2025-08 | Fixed missing second page (Annexe) of invoice |
| CMB-29387 | 2025-09 | Admin-managed Yassir Legal Information section; reflects on past/future invoices |
| CMB-29897 | 2025-09 | Invoice generation migrated from Pub/Sub to Cloud Tasks |
| CMB-30860 | 2025-10 | **Tunisia invoice template overhaul:** New format, BIAT bank, MF field, timbre fiscal, N° format |
| CMB-32854 | 2025-12 | Payment receipt footer updated to match invoice footer |
| CMB-32858 | 2025-12 | Pre-payment invoices (facture d'avance) epic |
| CMB-32859 | 2025-12 | WebApp payment section redesign with bank transfer uploads |
| CMB-32860 | 2025-12 | Admin Panel centralized Payment section (Online + Bank/Cheque) |
| CMB-35046 | 2026-02 | Remove timbre fiscal from Tunisia invoices when = 0 |
| CMB-35047 | 2026-02 | Stop generating invoices for Tunisia businesses with no finished trips |
| CMB-35183 | 2026-02 | Online payment method added to payment list with notifications and invoice creation |
| CMB-35952 | 2026-03 | **(In Review)** TVA label → "TVA LF 2026" for Algerian invoices |
| CMB-36551 | 2026-03 | **(In Progress)** Create full regression suite for Invoice module |