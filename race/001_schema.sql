-- Minimal DDL mirroring the tables the webhook writes to (with this change applied).
CREATE TABLE subscriptions(id serial PRIMARY KEY,stripe_subscription_id text,status text,stripe_event_created bigint);
