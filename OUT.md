# Database Schema Documentation

## Overview
This document describes the complete database structure for the UXexpert application, including all tables, columns, data types, relationships, and constraints.

---

## Entity Relationship Diagram (ERD)

```
┌─────────────┐
│    Users    │
└─────────────┘
      │
      ├──────────────────┐
      │                  │
      ▼                  ▼
┌─────────────┐    ┌──────────┐
│  Analyses   │    │  Usage   │
└─────────────┘    └──────────┘
      │
      ▼
┌─────────────────┐
│ AnalysisPages   │
└─────────────────┘
      │
      ▼
┌──────────────────┐
│ AnalysisIssues   │
└──────────────────┘
```

---

## Table Definitions

### 1. **users** Table
Stores user account information and subscription data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | Integer | PRIMARY KEY, AUTO-INCREMENT | Unique user identifier |
| `email` | String | UNIQUE, NOT NULL, INDEX | User email address |
| `password_hash` | String | NOT NULL | Hashed password |
| `is_verified` | Boolean | DEFAULT: False | Email verification status |
| `verification_token` | String | NULLABLE | Token for email verification |
| `tier` | Enum | DEFAULT: 'basic' | Subscription tier (basic, premium, ultra) |
| `created_at` | DateTime | DEFAULT: NOW() | Account creation timestamp |
| `razorpay_customer_id` | String | NULLABLE | Razorpay payment provider ID |
| `razorpay_subscription_id` | String | NULLABLE | Razorpay subscription ID |
| `subscription_status` | String | DEFAULT: 'trialing' | Current subscription status |
| `subscription_period_end` | DateTime | NULLABLE | Subscription expiration date |
| `billing_cycle` | String | DEFAULT: 'monthly' | Billing cycle type (monthly/yearly) |

**Relationships:**
- **1:N with analyses** - One user can have multiple analyses
- **1:N with usage** - One user can have multiple usage records

**Indexes:**
- `id` (primary key)
- `email` (unique)

---

### 2. **analyses** Table
Stores analysis session records initiated by users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | Integer | PRIMARY KEY, AUTO-INCREMENT | Unique analysis ID |
| `user_id` | Integer | FOREIGN KEY (users.id) | Reference to user |
| `url` | String | NOT NULL | Website URL analyzed |
| `pages_count` | Integer | DEFAULT: 0 | Number of pages analyzed |
| `created_at` | DateTime | DEFAULT: NOW() | Analysis creation timestamp |

**Relationships:**
- **N:1 with users** - Each analysis belongs to one user
- **1:N with analysis_pages** - One analysis contains multiple pages
  - Cascade delete: Deleting analysis removes all associated pages

**Indexes:**
- `id` (primary key)
- `user_id` (foreign key)

---

### 3. **analysis_pages** Table
Stores individual page screenshots and analysis results for each analysis.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | Integer | PRIMARY KEY, AUTO-INCREMENT | Unique page analysis ID |
| `analysis_id` | Integer | FOREIGN KEY (analyses.id), NOT NULL, INDEX | Reference to parent analysis |
| `url` | String | NOT NULL | URL of the analyzed page |
| `imgpath` | String | NOT NULL | Path/URL to original screenshot |
| `after_image_url` | String | NULLABLE | Path/URL to AI-generated after-image |
| `image_width_px` | Integer | NULLABLE | Screenshot width in pixels |
| `image_height_px` | Integer | NULLABLE | Screenshot height in pixels |
| `score` | Float | DEFAULT: 0.0 | Overall quality/issue score |
| `images_json` | String | NULLABLE | JSON data for image chunks/regions |
| `after_images_json` | String | NULLABLE | JSON data for after-image variants |
| `created_at` | DateTime | DEFAULT: NOW() | Analysis timestamp |

**Relationships:**
- **N:1 with analyses** - Each page belongs to one analysis
- **1:N with analysis_issues** - One page can have multiple issues
  - Cascade delete: Deleting a page removes all associated issues

**Indexes:**
- `id` (primary key)
- `analysis_id` (foreign key)

---

### 4. **analysis_issues** Table
Stores detected UX/design issues found on analyzed pages.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | Integer | PRIMARY KEY, AUTO-INCREMENT | Unique issue ID |
| `page_id` | Integer | FOREIGN KEY (analysis_pages.id), NOT NULL, INDEX | Reference to analyzed page |
| `issue_type` | String | NOT NULL, DEFAULT: 'element' | Type of issue (e.g., element, layout, color) |
| `x_px` | Integer | NULLABLE | X-coordinate of issue location (pixels) |
| `y_px` | Integer | NULLABLE | Y-coordinate of issue location (pixels) |
| `width_px` | Integer | NULLABLE | Width of affected area (pixels) |
| `height_px` | Integer | NULLABLE | Height of affected area (pixels) |
| `severity` | String | NOT NULL | Issue severity level (critical, high, medium, low) |
| `title` | String | NOT NULL | Short issue title |
| `problem` | String | NOT NULL | Detailed problem description |
| `why_it_matters` | String | NOT NULL | Business/UX impact explanation |
| `fix` | String | NOT NULL | Recommended fix/solution |
| `ai_prompt` | String | NULLABLE | Original AI prompt used for analysis |
| `created_at` | DateTime | DEFAULT: NOW() | Issue detection timestamp |

**Relationships:**
- **N:1 with analysis_pages** - Each issue belongs to one page

**Indexes:**
- `id` (primary key)
- `page_id` (foreign key)

---

### 5. **usage** Table
Tracks monthly/yearly page usage per user for billing and quota enforcement.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | Integer | PRIMARY KEY, AUTO-INCREMENT | Unique usage record ID |
| `user_id` | Integer | FOREIGN KEY (users.id), NOT NULL, INDEX | Reference to user |
| `pages_used` | Integer | DEFAULT: 0 | Number of pages used in period |
| `period_start` | DateTime | NOT NULL | Start of billing period |
| `period_end` | DateTime | NOT NULL | End of billing period |
| `created_at` | DateTime | DEFAULT: NOW() | Record creation timestamp |

**Relationships:**
- **N:1 with users** - Each usage record belongs to one user

**Indexes:**
- `id` (primary key)
- `user_id` (foreign key)

---

## Enums

### UserTier
Defines subscription plan levels:
- `basic` - Free tier (5 pages/month)
- `premium` - Paid tier ($6/month, 30 pages/month)
- `ultra` - Premium tier ($18/month, 100 pages/month)

### BillingCycle
Defines payment frequency:
- `monthly` - Monthly subscription
- `yearly` - Annual subscription (discount applied)

### SubscriptionStatus
Defines current subscription state:
- `active` - Subscription is active and paid
- `canceled` - Subscription canceled by user
- `past_due` - Payment failed, not yet canceled
- `incomplete` - Subscription initiated but not completed

---

## Data Relationships & Cascade Rules

### Cascade Delete Behavior
1. **User → Analysis → AnalysisPage → AnalysisIssue**
   - Deleting a user cascades to all their analyses
   - Deleting an analysis cascades to all its pages
   - Deleting a page cascades to all its issues

2. **User → Usage**
   - No cascade delete configured (orphaned usage records may remain)
   - Consider adding cascade delete or cleanup job

### Foreign Key Constraints
- All foreign keys enforce referential integrity
- All foreign key columns are indexed for query performance
- Cascade delete is enabled on analysis hierarchy only

---

## Query Patterns & Common Joins

### Get all issues for a user's analysis
```sql
SELECT ai.* 
FROM analysis_issues ai
JOIN analysis_pages ap ON ai.page_id = ap.id
JOIN analyses a ON ap.analysis_id = a.id
WHERE a.user_id = ?
```

### Get user's subscription info and current usage
```sql
SELECT u.*, ug.pages_used
FROM users u
LEFT JOIN usage ug ON u.id = ug.user_id
WHERE u.id = ?
```

### Get all analyzed pages for a specific analysis
```sql
SELECT ap.*, COUNT(ai.id) as issue_count
FROM analysis_pages ap
LEFT JOIN analysis_issues ai ON ap.id = ai.page_id
WHERE ap.analysis_id = ?
GROUP BY ap.id
```

---

## Constraints & Business Rules

1. **Email Uniqueness**
   - Users must have unique emails (enforced by unique index)

2. **User Tier Enforcement**
   - Default tier is "basic" for new users
   - Tier change is controlled by payment processing

3. **Usage Tracking**
   - One usage record per billing period per user
   - `pages_used` is incremented as user analyzes pages
   - `period_start` and `period_end` define the billing window

4. **Analysis Hierarchy**
   - Analysis must belong to a user (NOT NULL constraint)
   - AnalysisPage must belong to an analysis (NOT NULL constraint)
   - AnalysisIssue must belong to a page (NOT NULL constraint)

5. **Issue Severity Levels**
   - Valid values: critical, high, medium, low
   - Enforced at application level (no DB constraint)

6. **Subscription State Management**
   - `subscription_status` defaults to "trialing" for new users
   - `subscription_period_end` is set when subscription becomes active
   - `billing_cycle` persists user's chosen payment frequency

---

## Indexes

All columns used in WHERE, JOIN, or ORDER BY clauses have indexes:

| Table | Column | Type | Purpose |
|-------|--------|------|---------|
| users | email | UNIQUE | Fast email lookup and uniqueness enforcement |
| users | id | PRIMARY | User identification |
| analyses | user_id | FOREIGN KEY | Fast user analysis lookup |
| analysis_pages | analysis_id | FOREIGN KEY | Fast page lookup by analysis |
| analysis_issues | page_id | FOREIGN KEY | Fast issue lookup by page |
| usage | user_id | FOREIGN KEY | Fast usage lookup by user |

---

## Storage Considerations

### Large Text Columns
- `problem`, `why_it_matters`, `fix` store detailed markdown text
- `images_json`, `after_images_json` store JSON data with image metadata
- `ai_prompt` stores the original prompt sent to Claude API

### JSON Storage
Both `images_json` and `after_images_json` store JSON objects describing:
- Image chunks and their analysis results
- After-image variations and confidence scores
- Region-specific issue coordinates

Example structure (conceptual):
```json
{
  "chunks": [
    {
      "id": 1,
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 1080,
      "issues": [...]
    }
  ]
}
```

---

## Scaling & Performance Considerations

1. **Indexes**
   - Foreign key columns are indexed for JOIN performance
   - Email is unique-indexed for login lookups
   - Consider adding index on `created_at` for time-range queries

2. **Partitioning Candidates** (for future growth)
   - `analysis_issues` by `created_at` (monthly/yearly partitions)
   - `usage` by `user_id` or `period_start`

3. **Archive Strategy**
   - Old analyses and issues could be archived after 12 months
   - Keep active data in main tables for performance

4. **Connection Pooling**
   - Recommended pool size: 5-20 connections depending on load
   - Current setup uses SQLAlchemy with connection pooling

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| May 2026 | 1.0 | Initial schema documentation |

