# AI SQL Data Agent for Complex Business Analytics

This application allows users to query a complex business database using natural language questions, which are then translated to SQL by the Gemini Flash AI model and executed against a Supabase database.

## Features

- Natural language to SQL conversion using Google Gemini Flash
- Complex database schema with intentionally "dirty" elements to challenge AI
- Visualization of query results
- Detailed explanations of generated SQL
- Handling of business analytics questions about sales, users, products, and regions

## Project Structure

The project consists of two main parts:

- **Client**: React frontend with TypeScript and Tailwind CSS
- **Server**: Node.js backend with Express and TypeScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (or npm/yarn)
- Supabase account
- Google Gemini API key

### Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd ai-data-analytics
```

2. **Set up environment variables**

Create `.env` files in both the client and server directories.

For server:
```
SUPABASE_URL=https://nxyvixarrciicytnkrvs.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
```

For client:
```
VITE_API_URL=http://localhost:5000/api
```

3. **Install dependencies and start the applications**

For server:
```bash
cd server
pnpm install
pnpm dev
```

For client:
```bash
cd client
pnpm install
pnpm dev
```

## Database Schema

The database schema is intentionally complex with some "dirty" elements to challenge the AI:

### Tables

1. **regions**: Geographic regions with cryptic columns
   - Contains boolean flags Q1-Q4 indicating quarterly activity
   - Has ambiguous x_factor metric

2. **products**: Product catalog
   - Contains columns with abbreviated names like prd_desc and prd_code
   - Includes various product status indicators

3. **users**: Customer information
   - Contains cryptic tier indicators t1, t2, t3
   - Stores user preferences in JSON format

4. **sales**: Transaction data
   - Includes cryptic columns c1 (channel), c2 (campaign code)
   - Contains discount percentage and satisfaction score
   - Linked to products, users, and regions

5. **inventory**: Stock information
   - Tracks inventory by product and region
   - Contains fields for stock thresholds and flags

## Usage Examples

Here are some example questions you can ask:

1. "Why did sales drop in Q2 in the southern zone?"
   ```sql
   -- Expected SQL:
   SELECT 
     r.name AS region_name, 
     p.name AS product_name,
     SUM(CASE WHEN EXTRACT(QUARTER FROM s.date) = 1 THEN s.amount ELSE 0 END) AS q1_sales,
     SUM(CASE WHEN EXTRACT(QUARTER FROM s.date) = 2 THEN s.amount ELSE 0 END) AS q2_sales,
     COUNT(DISTINCT s.id) AS transaction_count,
     AVG(s.dscnt) AS avg_discount
   FROM
     sales s
   JOIN
     regions r ON s.region_id = r.id
   JOIN
     products p ON s.product_id = p.id
   WHERE
     r.zone = 'South'
     AND EXTRACT(YEAR FROM s.date) = 2024
   GROUP BY
     r.name, p.name
   HAVING
     SUM(CASE WHEN EXTRACT(QUARTER FROM s.date) = 1 THEN s.amount ELSE 0 END) >
     SUM(CASE WHEN EXTRACT(QUARTER FROM s.date) = 2 THEN s.amount ELSE 0 END)
   ORDER BY
     (SUM(CASE WHEN EXTRACT(QUARTER FROM s.date) = 1 THEN s.amount ELSE 0 END) - 
      SUM(CASE WHEN EXTRACT(QUARTER FROM s.date) = 2 THEN s.amount ELSE 0 END)) DESC
   ```

2. "Which products had the highest profit margin in Q4?"
   ```sql
   -- Expected SQL:
   SELECT 
     p.id, 
     p.name AS product_name,
     p.category,
     SUM(s.amount) AS total_sales,
     SUM(s.qty * p.cost) AS total_cost,
     SUM(s.amount) - SUM(s.qty * p.cost) AS total_profit,
     (SUM(s.amount) - SUM(s.qty * p.cost)) / SUM(s.amount) * 100 AS profit_margin_percentage
   FROM 
     sales s
   JOIN 
     products p ON s.product_id = p.id
   JOIN 
     regions r ON s.region_id = r.id
   WHERE 
     r."Q4" = true
     OR EXTRACT(QUARTER FROM s.date) = 4
   GROUP BY 
     p.id, p.name, p.category
   ORDER BY 
     profit_margin_percentage DESC
   LIMIT 10
   ```

3. "Show me the top 5 selling products in New York in 2024"
   ```sql
   -- Expected SQL:
   SELECT
     p.id,
     p.name AS product_name,
     p.category,
     SUM(s.qty) AS total_quantity_sold,
     SUM(s.amount) AS total_sales_amount
   FROM
     sales s
   JOIN
     products p ON s.product_id = p.id
   JOIN
     regions r ON s.region_id = r.id
   WHERE
     r.name = 'New York'
     AND EXTRACT(YEAR FROM s.date) = 2024
   GROUP BY
     p.id, p.name, p.category
   ORDER BY
     total_quantity_sold DESC
   LIMIT 5
   ```

4. "Compare online vs in-store sales across different regions"
   ```sql
   -- Expected SQL:
   SELECT
     r.name AS region_name,
     r.country,
     SUM(CASE WHEN s.c1 = 'online' THEN s.amount ELSE 0 END) AS online_sales,
     SUM(CASE WHEN s.c1 = 'in-store' THEN s.amount ELSE 0 END) AS in_store_sales,
     COUNT(CASE WHEN s.c1 = 'online' THEN s.id END) AS online_transactions,
     COUNT(CASE WHEN s.c1 = 'in-store' THEN s.id END) AS in_store_transactions,
     SUM(CASE WHEN s.c1 = 'online' THEN s.amount ELSE 0 END) / 
       NULLIF(SUM(CASE WHEN s.c1 = 'in-store' THEN s.amount ELSE 0 END), 0) AS online_to_instore_ratio
   FROM
     sales s
   JOIN
     regions r ON s.region_id = r.id
   GROUP BY
     r.name, r.country
   ORDER BY
     r.name
   ```

5. "Which regions have the most critical inventory levels?"
   ```sql
   -- Expected SQL:
   SELECT
     r.name AS region_name,
     r.country,
     p.name AS product_name,
     p.category,
     i.qty_available,
     i.min_stock_level,
     i.qty_available - i.min_stock_level AS stock_buffer,
     CASE
       WHEN i.qty_available <= i.min_stock_level THEN 'Critical'
       WHEN i.qty_available <= i.min_stock_level * 1.2 THEN 'Warning'
       ELSE 'Normal'
     END AS stock_status
   FROM
     inventory i
   JOIN
     regions r ON i.region_id = r.id
   JOIN
     products p ON i.product_id = p.id
   WHERE
     i.qty_available <= i.min_stock_level * 1.2
   ORDER BY
     stock_buffer ASC,
     r.name
   LIMIT 15
   ```

## Implementation Details

- The application uses Supabase for database hosting
- Gemini Flash API is used for natural language to SQL conversion
- The backend includes a service to provide the AI with schema information
- A custom SQL execution function in Supabase allows dynamic query execution

## Limitations

- The visualization component is a placeholder and would need integration with a charting library in a production environment
- The Gemini Flash model may sometimes generate incorrect SQL for very complex queries
- Error handling could be improved in a production version

## License

[MIT License](LICENSE)

