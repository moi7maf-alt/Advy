-- Run this in Supabase SQL Editor

create table templates (
  id bigint primary key generated always as identity,
  name text not null,
  category text not null,
  dimensions text not null,
  image_url text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table templates enable row level security;

-- Allow public read access (for the gallery + editor)
create policy "Public can read templates"
  on templates for select
  using (true);

-- Allow only authenticated admin to insert/update/delete
create policy "Admin can insert templates"
  on templates for insert
  to authenticated
  with check (true);

create policy "Admin can update templates"
  on templates for update
  to authenticated
  using (true);

create policy "Admin can delete templates"
  on templates for delete
  to authenticated
  using (true);

-- Storage bucket for template images
insert into storage.buckets (id, name, public)
values ('template-images', 'template-images', true);

-- Allow public read on storage
create policy "Public read template-images"
  on storage.objects for select
  using (bucket_id = 'template-images');

-- Allow authenticated admin to upload/delete
create policy "Admin upload template-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'template-images');

create policy "Admin delete template-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'template-images');
