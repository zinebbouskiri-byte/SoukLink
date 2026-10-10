# Private cloud sync setup

Cloud sync keeps a private copy of orders in the existing SoukLink Supabase project. Local browser storage and JSON backups continue to work independently.

## One-time database setup

1. Open the SoukLink project in the Supabase dashboard.
2. Open **SQL Editor** and create a new query.
3. Copy all of `supabase-orders-setup.sql` into the editor and run it.
4. Open Order Desk and select **Synchroniser**. Sign in with the existing SoukLink administrator account.

The SQL creates an orders table with row-level security. Only the existing owner account (UID `5fa6fa95-8faf-465a-8ad7-7eea347e3026`) can read or change its rows. The browser uses the project's publishable key, never a service-role or secret key.

On sign-in, local and cloud orders are combined by order reference. Changes are saved locally first and then synced. Use **Sauvegarder** to download an independent JSON backup before device changes or browser cleanup. **Restaurer** replaces the local list after confirmation.
