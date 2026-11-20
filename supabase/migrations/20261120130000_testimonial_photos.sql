insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'testimonial-photos',
  'testimonial-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Authorized staff can upload testimonial photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'testimonial-photos'
  and public.can_manage_articles()
);

create policy "Authorized staff can update testimonial photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'testimonial-photos'
  and public.can_manage_articles()
)
with check (
  bucket_id = 'testimonial-photos'
  and public.can_manage_articles()
);

create policy "Authorized staff can delete testimonial photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'testimonial-photos'
  and public.can_manage_articles()
);
