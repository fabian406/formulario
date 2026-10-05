-- Ejecutar en Supabase > SQL Editor
-- OJO: borra la tabla anterior (y los registros de prueba) y la crea de nuevo.
drop table if exists public.contactos;

create table public.contactos (
  id uuid primary key default gen_random_uuid(),
  nombres text not null,
  apellidos text not null,
  tipo_identificacion text not null check (tipo_identificacion in ('CC','TI','CE','RC')),
  numero_identificacion text not null check (numero_identificacion ~ '^[0-9]{5,15}$'),
  correo text not null,
  celular text not null check (celular ~ '^[0-9]{10}$'),
  mensaje text not null,
  creado_en timestamptz default now()
);

alter table public.contactos enable row level security;

-- Solo se permite insertar. No hay política de lectura:
-- desde el navegador nadie puede leer la tabla (se consulta en el Table Editor).
create policy "insertar_publico" on public.contactos
  for insert to anon with check (true);
