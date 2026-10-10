# Secure admin setup for GitHub Pages

The storefront can be hosted on GitHub Pages. The private admin uses Supabase Auth and a Supabase database; the database policies are what prevent other visitors from adding or deleting products.

## 1. Create the Supabase project

Create a project in Supabase. Keep the project URL and publishable key handy. The publishable key is designed for browser code; **never** put a Supabase secret key or legacy `service_role` key in this site or in GitHub.

## 2. Invite the owner and create the product table

An invitation has been sent to the email on your Supabase account. Wait to open it until the GitHub Pages address is configured in step 5. When the invitation returns you to the site, use the administrator password form to set a strong password. Do not share that password.

Open the Supabase SQL Editor and run [supabase-setup.sql](supabase-setup.sql). It already uses the invited user's UID in its write policies.

The products table allows public reads. Row-level security permits inserts and deletes only for the one invited user's UID. The site contains this public UID (not the user's email); the database policy is the security boundary.

## 3. Keep authentication private

Public sign-ups are disabled, email confirmation is enabled, and the project only has the invited admin user. Keep those settings in place. Do not create other users for the project.

## 4. Website connection

The current project's URL, publishable key, and administrator UID are already set in [app.js](app.js). The publishable key and UID are safe for browser code because table access is controlled by grants and row-level security. Never add a secret or service-role key to the website. The password stays in Supabase Auth and is entered only on the admin login page.

## 5. Publish with GitHub Pages

Commit the contents of the `outputs` folder into the publishing folder of your GitHub repository, then enable GitHub Pages for that branch or folder. Add the final GitHub Pages address to the Supabase Auth URL configuration as the Site URL and an allowed redirect URL. This must be set after the GitHub Pages address exists; the current project still needs that address for invitation and sign-in redirects.

After deployment and URL configuration, open the invitation link. Set your password in the administrator page, then sign in through **Admin**. Visitors can browse products but cannot change them. If the backend is not configured, the admin view deliberately refuses to show the product controls.

This is a small single-owner setup. Keep the GitHub repository and your Supabase account protected with two-factor authentication. Never commit passwords, secret keys, or the service-role key.
