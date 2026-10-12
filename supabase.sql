

create table if not exists public.beta_signups (
  id                bigint generated always as identity primary key,
  nombre            text        not null,
  correo            text        not null,
  perfil            text        not null,
  necesidad         text        not null,
  interes           text        not null,
  consentimiento    boolean     not null default false,
  fecha_inscripcion timestamptz not null default now(),

  -- Validaciones también en la base de datos (no solo en el navegador)
  constraint nombre_largo     check (char_length(nombre) between 2 and 80),
  constraint correo_formato   check (correo ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' and char_length(correo) <= 120),
  constraint perfil_valido    check (perfil in (
                                'Familiar o cuidador',
                                'Persona con dificultad del habla',
                                'Fonoaudiólogo o terapeuta',
                                'Otro')),
  constraint necesidad_largo  check (char_length(necesidad) between 10 and 500),
  constraint interes_valido   check (interes in (
                                'Comunicarme con pictogramas y voz',
                                'Practicar con ejercicios y rachas',
                                'Ver el avance y compartirlo con el profesional',
                                'Todo lo anterior')),
  constraint consentimiento_si check (consentimiento = true)
);


