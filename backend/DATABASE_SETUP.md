# Database Setup Guide

## 🚀 Automatic Database Initialization

Your backend now automatically initializes the database when it starts! Here's how it works:

### What Happens on Startup

1. **Connection Test** - Tests the database connection
2. **Table Check** - Checks if tables already exist
3. **Schema Creation** - Creates tables from `database/schema.sql` if they don't exist
4. **Data Seeding** - Seeds the database with data from `database/seed.sql`

### Manual Database Management

You can also manage the database manually using these commands:

#### Using npm scripts:
```bash
# Initialize database (create tables and seed data)
npm run db:init

# Reset database (drop all tables and recreate)
npm run db:reset

# Use the database manager
npm run db:manage
```

#### Using the database manager:
```bash
# Initialize database
npm run db:manage init

# Reset database
npm run db:manage reset

# Check database status
npm run db:manage check

# Show help
npm run db:manage
```

### Environment Variables

Make sure your `.env` file has the correct `DATABASE_URL`:

```bash
# For Railway (production)
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require

# For local development
DATABASE_URL=postgresql://username:password@localhost:5432/feedbackapp
```

### Database Schema

The following tables will be created:

- **users** - User accounts (clients and business owners)
- **businesses** - Business information
- **reviews** - Customer reviews
- **bonuses** - Available bonuses
- **user_bonuses** - User bonus claims
- **settings** - Business settings

### Seed Data

The database will be seeded with:

- Sample business owner: `owner1@biz.com`
- Sample client: `client1@email.com`
- Sample business: "Wyndham Residences Aqkol"
- Sample reviews and bonuses

### Troubleshooting

If you encounter issues:

1. **Check your DATABASE_URL** - Make sure it's correct
2. **Check database permissions** - Ensure your user can create tables
3. **Check for existing data** - The script won't overwrite existing tables
4. **Use reset command** - If you need to start fresh: `npm run db:reset`

### Production Deployment

When deploying to Railway:

1. Set your `DATABASE_URL` environment variable in Railway
2. Deploy your backend
3. The database will be automatically initialized on first startup
4. No manual database setup required!

### Development

For local development:

1. Set up a local PostgreSQL database
2. Update your `.env` file with the local connection string
3. Run `npm run dev` - the database will be initialized automatically
