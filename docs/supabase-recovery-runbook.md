# Dune Consulting Supabase Recovery Runbook

**Status checked:** 9 October 2026
**Project:** `lipurkjvkpknwhdqioas` (`eu-west-1`, Postgres 17)
**Readiness:** NO-GO; no usable recovery point has been confirmed.

## Current Evidence

- `supabase backups list --project-ref lipurkjvkpknwhdqioas` reports `walg_enabled: true`, `pitr_enabled: false`, and an empty `backups` list.
- The project list confirms the linked reference and an active project named `duneconsulting01@gmail.com's Project`. The authenticated Dashboard was not available, and the CLI project list omits the subscription tier. Confirm the intended project name and plan in the Dashboard before enabling or restoring anything.
- No provider recovery timestamp, retention window, logical export, approved export destination, or successful restore test is recorded. WAL archiving being enabled alone does not establish a usable recovery point.
- October 7 and October 9 migrations remain unapplied. Do not use a database restore as a routine migration rollback.

## Google Drive Backup Proposal - Not Ready

No Google Drive integration or authenticated Drive client is connected in this workspace. `rclone`, `gdrive`, `drive`, and `gcloud` are unavailable, and the shared browser is not authenticated to Drive. Do not create a folder, grant access, authorize an integration, or upload an export from this workspace yet. A manual upload through the owner's authenticated Drive browser avoids granting an API OAuth scope; no browser upload has been performed.

### Destination Readiness Checklist

- [ ] Project owner confirms this is the intended Dune Consulting project and identifies the authorized Drive account (personal Google account or Workspace account).
- [ ] Owner creates or designates a dedicated folder outside this repository and confirms its ownership and exact intended destination.
- [ ] Review effective folder permissions, including inherited parent access. Grant access only to named backup/restore operators; confirm link sharing is off. Workspace shared-drive controls and personal Drive controls are not interchangeable.
- [ ] Establish a second authorized recovery administrator or an independent Drive/Workspace recovery route so losing the primary Google account does not lose the only archive.
- [ ] Select a recipient public-key fingerprint and verify it out-of-band. Keep the corresponding private key in an approved password manager/offline escrow separate from Drive and the archive.
- [ ] Agree on retention and cleanup owners. Never delete the only checksum-verified and restore-tested archive.
- [ ] After upload, verify Drive shows the expected private folder, filename, and size; download the encrypted object and compare its SHA-256 with the local manifest before accepting the upload.
- [ ] Confirm the Drive account, destination permissions, retention, recovery access, and handling procedure before authorizing any export.

If later automation is approved, use a dedicated application identity restricted to the dedicated folder where the account type supports it. Prefer the narrow `drive.file` scope only if the selected client can work with app-created/app-authorized files and the target folder; do not grant broad Drive access as a shortcut. No API client, OAuth authorization, service account, or automation is configured here.

### Proposed Export Command Shape - Do Not Run Yet

The source is PostgreSQL 17.6. The cached image `public.ecr.aws/supabase/postgres:17.6.1.155` was run with networking disabled and reported `pg_dump`, `pg_restore`, and `psql` 17.6. Host PostgreSQL 16.15 tools must not be used. GPG 2.4.4 is present; `age` is not. This validates client versions only, not connectivity, the dump, or restoration.

After destination, credential handling, key custody, and Auth recovery are approved, use one exported PostgreSQL snapshot for both the custom-format public archive and the narrowly selected Auth-user JSON sidecar. Put connection settings in a protected service file and password in a mode-0600 `PGPASSFILE`, both outside the repository. Mount them read-only; do not place a password or connection URI in command arguments or shell history. Disable shell tracing, use a private encrypted local volume for encrypted artifacts, and choose unique timestamped names so existing backups cannot be overwritten. Keep the snapshot keeper transaction open until both exports finish.

Illustrative procedure only; do not run until the destination and all security prerequisites are approved. Placeholders are local protected configuration, not values to send in chat. `PGSERVICEFILE`, `PGPASSFILE`, `BACKUP_DIR`, `BACKUP_ID`, and `GPG_RECIPIENT_FINGERPRINT` must be prepared and reviewed before use. The service name `source` must be configured in the protected service file. Start a no-echo `psql` snapshot keeper using the pinned PostgreSQL 17 image:

```bash
set -euo pipefail
set +x
umask 077
set -o noclobber

coproc SNAPSHOT_KEEPER {
	docker run --rm --interactive --network bridge \
		--mount "type=bind,src=$PGSERVICEFILE,dst=/run/secrets/pg_service.conf,readonly" \
		--mount "type=bind,src=$PGPASSFILE,dst=/run/secrets/pgpass,readonly" \
		--env PGSERVICEFILE=/run/secrets/pg_service.conf \
		--env PGPASSFILE=/run/secrets/pgpass \
		--env PGSERVICE=source \
		--entrypoint psql public.ecr.aws/supabase/postgres:17.6.1.155 \
		-X -qAt --dbname=source
}
printf 'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY;\nSELECT pg_export_snapshot();\n' >&"${SNAPSHOT_KEEPER[1]}"
IFS= read -r SNAPSHOT_ID <&"${SNAPSHOT_KEEPER[0]}"

docker run --rm --network bridge \
	--mount "type=bind,src=$PGSERVICEFILE,dst=/run/secrets/pg_service.conf,readonly" \
	--mount "type=bind,src=$PGPASSFILE,dst=/run/secrets/pgpass,readonly" \
	--env PGSERVICEFILE=/run/secrets/pg_service.conf \
	--env PGPASSFILE=/run/secrets/pgpass \
	--env PGSERVICE=source \
	--entrypoint pg_dump public.ecr.aws/supabase/postgres:17.6.1.155 \
	--dbname=source --snapshot="$SNAPSHOT_ID" --format=custom --no-owner \
	--schema=public --schema=supabase_migrations --file=- \
	| gpg --batch --encrypt --recipient "$GPG_RECIPIENT_FINGERPRINT" --output - \
	> "$BACKUP_DIR/$BACKUP_ID.dump.gpg"

docker run --rm --network bridge \
	--mount "type=bind,src=$PGSERVICEFILE,dst=/run/secrets/pg_service.conf,readonly" \
	--mount "type=bind,src=$PGPASSFILE,dst=/run/secrets/pgpass,readonly" \
	--env PGSERVICEFILE=/run/secrets/pg_service.conf \
	--env PGPASSFILE=/run/secrets/pgpass \
	--env PGSERVICE=source \
	--entrypoint psql public.ecr.aws/supabase/postgres:17.6.1.155 \
	-X -qAt --set=ON_ERROR_STOP=1 --dbname=source \
	--command "BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY; SET TRANSACTION SNAPSHOT '$SNAPSHOT_ID'; SELECT coalesce(jsonb_agg(jsonb_build_object('id', id, 'email', email, 'phone', nullif(phone, ''), 'password_hash', nullif(encrypted_password, ''), 'email_confirm', email_confirmed_at is not null, 'phone_confirm', phone_confirmed_at is not null, 'user_metadata', raw_user_meta_data, 'app_metadata', raw_app_meta_data) ORDER BY id), '[]'::jsonb)::text FROM auth.users; COMMIT;" \
	| gpg --batch --encrypt --recipient "$GPG_RECIPIENT_FINGERPRINT" --output - \
	> "$BACKUP_DIR/$BACKUP_ID.auth.json.gpg"

(
	cd "$BACKUP_DIR"
	sha256sum "$BACKUP_ID.dump.gpg" "$BACKUP_ID.auth.json.gpg" \
		> "$BACKUP_ID.sha256"
)
gpg --batch --decrypt "$BACKUP_DIR/$BACKUP_ID.auth.json.gpg" \
	| jq -e 'type == "array"' >/dev/null

printf 'COMMIT;\n\\q\n' >&"${SNAPSHOT_KEEPER[1]}"
wait "$SNAPSHOT_KEEPER_PID"

gpg --batch --decrypt "$BACKUP_DIR/$BACKUP_ID.dump.gpg" \
	| docker run --rm --interactive --network none \
			--entrypoint pg_restore public.ecr.aws/supabase/postgres:17.6.1.155 \
			--list - >/dev/null
```

The Auth sidecar contains sensitive account identifiers, metadata, and password hashes; it must remain encrypted and must never be printed or used in the public manifest. The example hashes both encrypted artifacts and validates that decrypted Auth JSON is an array without exposing it. The final `pg_restore --list` check tests archive readability only. It is not a restore test. Upload the `.dump.gpg`, `.auth.json.gpg`, checksums, and non-sensitive manifest manually in the owner's authenticated Drive browser only after destination approval. Then download both encrypted artifacts to a protected disposable workspace and compare SHA-256 before decryption. Google Drive metadata alone cannot verify this SHA-256; the download-and-hash comparison does.

Manifest fields may include backup ID, UTC timestamp, approved source project reference, server/client versions, custom-format method, included schemas, encrypted byte size, SHA-256, upload/readability status, and exclusions. Do not include credentials, connection information, user data, or keys.

The observed database is 12,201,107 bytes. Actual custom-dump and Auth-sidecar sizes are unknown until an approved export exists. Reserve up to 50 MB per encrypted backup pair for initial planning; 30 daily, 8 weekly, and 12 monthly retained pairs would therefore need about 2.5 GB, plus temporary restore space. Check the chosen Drive account's available quota and recalculate from the first real encrypted pair before adopting that retention schedule.

### Current Scope And Auth Recovery Plan

Read-only baseline: PostgreSQL 17.6, database size 12,201,107 bytes. Counts are articles 1; contact enquiries 6; mentorship applications 1; newsletter campaigns 1; newsletter provider events 0; newsletter subscribers 1; profiles 1; quote requests 1; Auth users 1; Auth identities 1; Storage objects 0. `vault.secrets` has 0 rows. Installed extensions are `pg_stat_statements` 1.11, `pgcrypto` 1.3, `plpgsql` 1.0, `supabase_vault` 0.3.1, and `uuid-ossp` 1.1. `public.profiles.id` references `auth.users.id`; `newsletter_campaigns.created_by` references `profiles.id`. Public RLS is enabled and policies exist on all eight public tables. The `auth.users` trigger `on_auth_user_created` invokes `public.handle_new_user`; it is a customization on a managed schema and is not captured by a `public`-only dump.

Supabase documents exporting Auth user data through the Dashboard/SQL Editor. The installed Auth Admin API exposes `createUser` with `id`, `password_hash`, email/phone confirmation, and metadata attributes; its types document bcrypt, Firebase scrypt, and Argon2 password hashes. This is a supported candidate for restoring users through the Auth API without directly inserting into managed Auth tables. A minimum encrypted user-recovery sidecar would need the user UUID, email/phone, supported password hash, confirmation state, and required user/app metadata. Keep it encrypted and access-restricted like the database archive; never put those fields in the manifest. The export/import path has not yet been exercised against an isolated Supabase Auth service.

The current aggregate baseline has one Auth user and one `email` identity, 3 sessions, 44 refresh-token rows, 0 MFA factors, 0 OAuth clients/custom providers, and 0 SSO/SAML providers. Recreating the user through Auth Admin with the original UUID and supported password hash should preserve the `public.profiles.id` foreign-key target; the API creates the email identity, but its identity-row ID and timestamps are not guaranteed to match. Sessions and refresh tokens should be intentionally invalidated, and users must sign in again. Provider/project settings remain separate. Verify hash compatibility, identity behavior, profile-trigger ordering, and the same-ID foreign key in an isolated restore before claiming account recovery. Do not dump or restore managed Auth internals wholesale or write to production Auth tables.

The isolated restore sequence should provision the Auth user through `auth.admin.createUser` first, using the original `id` and a supported `password_hash` from the encrypted sidecar, then restore the public archive so `profiles.id` resolves to the same Auth UUID. Ensure the project-specific `auth.users` profile trigger is not fired before the public dump is restored; recreate that trigger from the reviewed migration after the data restore. The Admin API key must belong only to the disposable local environment and must never be a production key. Do not restore sessions or refresh tokens.

Illustrative Auth Admin API shape for a disposable target only; user data must be read from the protected decrypted sidecar in memory and must never be logged:

```ts
await isolatedSupabase.auth.admin.createUser({
  id: user.id,
  email: user.email,
  phone: user.phone,
  password_hash: user.password_hash,
  email_confirm: user.email_confirm,
  phone_confirm: user.phone_confirm,
  user_metadata: user.user_metadata,
  app_metadata: user.app_metadata,
});
```

After verifying every expected Auth UUID exists in the isolated target, the archive restore command shape is:

```bash
gpg --batch --decrypt "$BACKUP_DIR/$BACKUP_ID.dump.gpg" \
	| docker run --rm --interactive --network host \
			--mount "type=bind,src=$RESTORE_PGSERVICEFILE,dst=/run/secrets/pg_service.conf,readonly" \
			--mount "type=bind,src=$RESTORE_PGPASSFILE,dst=/run/secrets/pgpass,readonly" \
			--env PGSERVICEFILE=/run/secrets/pg_service.conf \
			--env PGPASSFILE=/run/secrets/pgpass \
			--env PGSERVICE=isolated \
			--entrypoint pg_restore public.ecr.aws/supabase/postgres:17.6.1.155 \
			--exit-on-error --single-transaction --no-owner --dbname=isolated -
```

This command is a proposed shape, not a tested restore. The service file and password file must point only to the confirmed disposable local database. Apply and validate the `auth.users` trigger customization afterward, and test the exact restore against the chosen clean local Supabase stack before using this procedure operationally.

The proposed `public,supabase_migrations` archive retains application schema/data, public constraints, indexes, functions, RLS policies, grants, and migration history in the selected schemas. An encrypted Auth-user sidecar from the same exported snapshot is required to recreate Auth users through the Auth Admin API; it is not a direct-restorable Auth-schema dump. The archive excludes managed-schema customizations, Storage object bytes, Edge Functions, Vault key material, project/provider settings, secrets, and application code. Extensions in the `extensions`/`vault` schemas and platform roles must be provisioned compatibly in the isolated target; the archive alone does not do that.

### Restore Gate And Retention

Do not call restore readiness verified until an owner-approved disposable target has the required PostgreSQL 17/Supabase services and extensions, the Auth/profile identity strategy is resolved, and the decrypted archive has been restored there. Verify schemas, tables, indexes, constraints, foreign keys, policies, grants, triggers/customizations, extensions, migration history, all baseline aggregate row counts, and application access. Disable outbound email/newsletter integrations and use synthetic records for write tests. Never connect the test application to production services.

Proposed manual cadence after approval: one encrypted export every calendar day, including weekends, plus one immediately before each production schema rollout. Retain at least 30 daily, 8 weekly, and 12 monthly copies if the owner's Drive capacity and policy permit; review actual archive sizes before adopting this. Perform upload/download checksum verification for every backup and an isolated restore test quarterly and before a migration campaign. Keep at least two verified recovery points and do not prune the newest verified one until a newer backup has passed an isolated restore test. No schedule, automation, or cleanup task is enabled.

Google Drive storage does not replace recovery of Storage object bytes, Auth provider configuration, Vault encryption keys, Edge Functions, project settings, secrets, or application code. Maintain separate approved recovery records for each. Store credentials and private decryption keys in the approved secrets manager, rotate them through the owning systems, and verify recovery access without placing backup credentials beside the archive.

## Protection To Establish

1. An authorized project owner must confirm the production project, plan, compute size, and current backup settings in the Supabase Dashboard. Supabase documents automated daily backups for Pro, Team, and Enterprise plans, with 7, 14, and up to 30 days of access respectively. The current plan is not verified here.
2. If eligible, choose provider-managed daily backups or PITR based on the required recovery point objective. Supabase documents PITR as an add-on for Pro, Team, and Enterprise projects and requires at least Small compute. Published PITR pricing is retention-dependent (7 days: $0.137/hour; 14 days: $0.274/hour; 28 days: $0.55/hour; approximately $100/$200/$400 per month). PITR is not covered by the spend cap. Enabling it, changing compute/retention, or incurring charges requires explicit owner approval.
3. After the approved protection is enabled, use the read-only backup inventory or Dashboard to confirm a recovery window or backup timestamp, project identity, and retention. Record the earliest and latest PITR points when shown. A listed backup is metadata evidence, not proof of a successful restore.
4. Consider a separate encrypted logical export for defense in depth. `supabase db dump` is documented for schema, data, and role exports. It contains sensitive production data. Before exporting, the owner must approve the exact restricted destination, access list, encryption, retention, and cost. Do not write dumps into this repository, chat, terminal logs, or an unapproved local folder; do not overwrite an existing artifact. No export was created during this audit.
5. Back up Storage objects separately. Supabase database backups contain Storage metadata, not the actual objects. Inventory buckets, then use an owner-approved object backup/versioning process and separately protect project secrets and external integration configuration in the approved secrets manager. No Storage or secret export was performed.

## Isolated Restore Verification

Only the named Supabase project owner or explicitly delegated database operator may authorize a restore. A second operator should review the target and recovery timestamp. Never test against production.

1. Create or designate an isolated, access-restricted restore project with compatible Postgres/extensions. Project creation or additional compute may incur charges and needs approval. Confirm its project reference independently before restoring.
2. For a provider backup, use the Supabase Dashboard's documented backup restore flow. For PITR, select a timestamp inside the displayed earliest/latest recovery window and review the confirmation details. Supabase documents that the selected project becomes inaccessible during restore; do not submit a production restore request as a test.
3. For a logical export, follow Supabase's documented `supabase db dump` / `pg_dump` and `psql` restore procedure using credentials obtained and entered by the authorized operator directly through approved secret handling. The documented procedure separates roles, schema, and data and calls out special handling for managed `auth`/`storage` schemas, custom roles, Vault encryption keys, and migration history. Tailor and review the exact restore commands for the export before running them; none have been executed or verified for this project.
4. On the isolated target, verify restore completion in provider status, expected public table/schema inventory, constraints/indexes/RLS, migration history, and aggregate row counts. Run application read/write smoke tests only against synthetic test records; do not print private row contents. Compare expected counts and key constraints to the recorded pre-restore inventory. Record the target, source backup timestamp, operator, results, and cleanup approval.
5. No restore has been tested for this project. A future recovery plan is not considered verified until these isolated checks pass.

## Migration Incident Procedure

1. Stop further migration activity and preserve deployment/CLI output securely. Do not mark migrations applied manually or reset production.
2. The incident commander and authorized database operator assess whether a reviewed forward-fix is safer than restoring. Prefer a reviewed forward-fix when data remains sound; application-code rollback alone does not reverse database schema or data changes.
3. If restore is necessary, the project owner approves the exact recovery point and downtime/data-loss impact. Restore using the provider procedure only after a fresh backup inventory and incident review. Supabase notes that provider restore makes the project inaccessible during the operation and returns the database to the selected point; transactions after that point may be lost.
4. Verify schema, migration history, and application health before resuming traffic. Roll application code forward/back independently to a version compatible with the restored schema. Reconcile any post-recovery-point submissions from separately retained systems where possible.

## References

- [Supabase Database Backups and PITR](https://supabase.com/docs/guides/platform/backups)
- [Supabase PITR usage and pricing](https://supabase.com/docs/guides/platform/manage-your-usage/point-in-time-recovery)
- [Supabase CLI database dump](https://supabase.com/docs/reference/cli/supabase-db-dump)
- [Supabase backup and restore guide](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore)

## Approval Needed

- Confirm the production project name and subscription plan in the authenticated Dashboard.
- Approve any plan/compute/PITR/retention setting changes and associated charges.
- Approve a logical export destination, encryption/access controls, retention, and operator.
- Approve an isolated restore target and any associated project/compute charges.
- Complete and record a successful isolated restore before classifying migration rollout as GO.
