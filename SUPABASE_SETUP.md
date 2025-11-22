# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [database.new](https://database.new) and create a new project.
2. Save your database password securely.

## 2. Database Schema

Run the following SQL in the Supabase SQL Editor to create the necessary table:

```sql
create table public.portfolio_items (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null default auth.uid (),
  symbol text not null,
  amount numeric not null,
  constraint portfolio_items_pkey primary key (id),
  constraint portfolio_items_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade
) tablespace pg_default;

-- Enable Row Level Security (RLS)
alter table public.portfolio_items enable row level security;

-- Create Policy: Users can only see their own items
create policy "Users can view their own portfolio items"
on public.portfolio_items
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

-- Create Policy: Users can insert their own items
create policy "Users can insert their own portfolio items"
on public.portfolio_items
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

-- Create Policy: Users can delete their own items
create policy "Users can delete their own portfolio items"
on public.portfolio_items
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);
```

## 3. Authentication Setup

1. Go to **Authentication** -> **Providers**.
2. Enable **GitHub**.
3. You will need to create a GitHub OAuth App:
   - Go to GitHub -> Settings -> Developer settings -> OAuth Apps -> New OAuth App.
   - **Homepage URL**: Your Supabase project URL (e.g., `https://your-project-id.supabase.co`).
   - **Authorization callback URL**: `https://your-project-id.supabase.co/auth/v1/callback`.
   - Copy the **Client ID** and **Client Secret** from GitHub to Supabase.

## 4. Environment Variables

1. Copy `.env.example` to `.env`.
2. Get your project URL and Anon Key from Supabase (**Project Settings** -> **API**).
3. Fill in the `.env` file:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
