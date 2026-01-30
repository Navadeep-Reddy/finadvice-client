-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.accounts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  consent_id uuid,
  fip_id text,
  fip_name text,
  account_type text,
  masked_account_number text,
  balance numeric,
  currency text DEFAULT 'INR'::text,
  last_synced_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT accounts_consent_id_fkey FOREIGN KEY (consent_id) REFERENCES public.consents(id)
);
CREATE TABLE public.balance_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL,
  user_id uuid NOT NULL,
  balance numeric NOT NULL,
  snapshot_date date NOT NULL,
  source character varying NOT NULL DEFAULT 'manual'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT balance_snapshots_pkey PRIMARY KEY (id),
  CONSTRAINT balance_snapshots_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id),
  CONSTRAINT balance_snapshots_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.cached_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  metric_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  forecast_data jsonb,
  calculated_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cached_metrics_pkey PRIMARY KEY (id),
  CONSTRAINT cached_metrics_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.consents (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  consent_id text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'PENDING'::text CHECK (status = ANY (ARRAY['PENDING'::text, 'APPROVED'::text, 'REJECTED'::text, 'EXPIRED'::text, 'REVOKED'::text])),
  consent_start date,
  consent_expiry date,
  redirect_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT consents_pkey PRIMARY KEY (id),
  CONSTRAINT consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  business_name text NOT NULL,
  business_type text NOT NULL CHECK (business_type = ANY (ARRAY['grocery'::text, 'pharmacy'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.recurring_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  account_id uuid NOT NULL,
  pattern_hash character varying NOT NULL,
  avg_amount numeric NOT NULL,
  frequency_days integer NOT NULL,
  last_occurrence timestamp with time zone NOT NULL,
  next_expected timestamp with time zone NOT NULL,
  narration_pattern text NOT NULL,
  category character varying,
  confidence numeric NOT NULL DEFAULT 0.0,
  transaction_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT recurring_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT recurring_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT recurring_transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id)
);
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  account_id uuid,
  user_id uuid,
  txn_id text,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['CREDIT'::text, 'DEBIT'::text])),
  mode text,
  narration text,
  txn_date timestamp with time zone,
  category text,
  created_at timestamp with time zone DEFAULT now(),
  is_manual boolean DEFAULT false,
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id),
  CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.accounts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  consent_id uuid,
  fip_id text,
  fip_name text,
  account_type text,
  masked_account_number text,
  balance numeric,
  currency text DEFAULT 'INR'::text,
  last_synced_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT accounts_consent_id_fkey FOREIGN KEY (consent_id) REFERENCES public.consents(id)
);
CREATE TABLE public.balance_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL,
  user_id uuid NOT NULL,
  balance numeric NOT NULL,
  snapshot_date date NOT NULL,
  source character varying NOT NULL DEFAULT 'manual'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT balance_snapshots_pkey PRIMARY KEY (id),
  CONSTRAINT balance_snapshots_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id),
  CONSTRAINT balance_snapshots_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.cached_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  metric_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  forecast_data jsonb,
  calculated_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cached_metrics_pkey PRIMARY KEY (id),
  CONSTRAINT cached_metrics_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.consents (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  consent_id text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'PENDING'::text CHECK (status = ANY (ARRAY['PENDING'::text, 'APPROVED'::text, 'REJECTED'::text, 'EXPIRED'::text, 'REVOKED'::text])),
  consent_start date,
  consent_expiry date,
  redirect_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT consents_pkey PRIMARY KEY (id),
  CONSTRAINT consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  business_name text NOT NULL,
  business_type text NOT NULL CHECK (business_type = ANY (ARRAY['grocery'::text, 'pharmacy'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.recurring_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  account_id uuid NOT NULL,
  pattern_hash character varying NOT NULL,
  avg_amount numeric NOT NULL,
  frequency_days integer NOT NULL,
  last_occurrence timestamp with time zone NOT NULL,
  next_expected timestamp with time zone NOT NULL,
  narration_pattern text NOT NULL,
  category character varying,
  confidence numeric NOT NULL DEFAULT 0.0,
  transaction_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT recurring_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT recurring_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT recurring_transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id)
);
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  account_id uuid,
  user_id uuid,
  txn_id text,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['CREDIT'::text, 'DEBIT'::text])),
  mode text,
  narration text,
  txn_date timestamp with time zone,
  category text,
  created_at timestamp with time zone DEFAULT now(),
  is_manual boolean DEFAULT false,
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id),
  CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);