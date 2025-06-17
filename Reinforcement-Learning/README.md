# USF Practicum - Deep Ensemble Reinforcement Learning Trading

See Main branch's readme instruction for project setup, this is only for the ama branch -- backend forlder

# Numeraxial Platform Setup

## Quick Start for New Team Members

### 1. Clone Repository
```bash
git clone https://github.com/numeraxial/Reinforcement-Learning.git
cd Reinforcement-Learning
git checkout ama
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your own values
# IMPORTANT: Change all passwords and secret keys!
```

### 3. Start Services
```bash
# Build and start all containers
docker-compose up --build

# Wait for services to start, then visit:
# - API: http://localhost:8000
# - pgAdmin: http://localhost:5050
```

### 4. Database Setup
```bash
# Enter backend container
docker-compose exec backend bash

# Run database migrations
alembic upgrade head

# Exit container
exit
```

### 5. Connect to Database (pgAdmin)
1. Open http://localhost:5050
2. Login: admin@numeraxial.com / (password from your .env)
3. Add server:
   - Name: Numeraxial Database
   - Host: db
   - Port: 5432
   - Database: numeraxial
   - Username: numeraxial_user
   - Password: (from your .env file)

### 6. Verify Setup
- API docs: http://localhost:8000/docs
- Database tables: Should see `users` and `user_usage` in pgAdmin

## Environment Variables Required

Check `.env.example` for all required variables. Key ones:
- `DATABASE_URL` - PostgreSQL connection
- `SECRET_KEY` - App security
- `JWT_SECRET_KEY` - Authentication
- `PGADMIN_DEFAULT_PASSWORD` - Database admin

## Development Workflow

### Making Database Changes
1. Modify models in `Backend/app/models/`
2. Generate migration: `alembic revision --autogenerate -m "description"`
3. Apply migration: `alembic upgrade head`
4. Commit migration files to Git

### API Development
- Add routes in `Backend/app/api/`
- Business logic in `Backend/app/services/`
- Test with http://localhost:8000/docs
