// ===== Conexión con Supabase =====
// La clave "anon" es pública por diseño: la seguridad la da RLS en la base de datos.
const SUPABASE_URL = 'https://yofgwqqyuxcgpdumbfvq.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvZmd3cXF5dXhjZ3BkdW1iZnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNjE1NTIsImV4cCI6MjEwNjYzNzU1Mn0.P7rZr7KIBVlOZ4dH7GtlPlo_39BieCe0myoIfeK1eIU';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== Configuración =====
const SEGUNDOS = 5;
const TIPOS = {
  CC: 'Cédula de ciudadanía',
  TI: 'Tarjeta de identidad',
  CE: 'Cédula de extranjería',
  RC: 'Registro civil',
};

// ===== Elementos de la página =====
const form = document.getElementById('formulario');
const boton = document.getElementById('btn-enviar');
const estado = document.getElementById('estado');
const tarjeta = document.getElementById('guardado');
let temporizador;

// Número de identificación y celular: solo números
['numero_identificacion', 'celular'].forEach((id) => {
  document.getElementById(id).addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });
});

function mostrarEstado(tipo, texto) {
  estado.textContent = (tipo === 'ok' ? '✅ ' : '⚠️ ') + texto;
  estado.className = 'estado ' + tipo;
  estado.hidden = false;
}

function ocultarTodo() {
  estado.hidden = true;
  tarjeta.hidden = true;
}

function mostrarGuardado(d) {
  document.getElementById('d-nombre').textContent = d.nombres + ' ' + d.apellidos;
  document.getElementById('d-identificacion').textContent =
    TIPOS[d.tipo_identificacion] + ' · ' + d.numero_identificacion;
  document.getElementById('d-contacto').textContent = d.correo + ' · ' + d.celular;
  document.getElementById('d-mensaje').textContent = d.mensaje;

  tarjeta.hidden = false;
  const barra = tarjeta.querySelector('.barra'); // reinicia la animación
  barra.style.animation = 'none';
  void barra.offsetWidth;
  barra.style.animation = '';
}

// ===== Guardar en la base de datos =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearTimeout(temporizador);
  ocultarTodo();

  boton.disabled = true;
  boton.classList.add('cargando');
  boton.textContent = 'Guardando...';

  const datos = Object.fromEntries(new FormData(form));
  const { error } = await db.from('contactos').insert([datos]);

  boton.disabled = false;
  boton.classList.remove('cargando');
  boton.textContent = 'Enviar';

  if (error) return mostrarEstado('error', 'No se pudo guardar: ' + error.message);

  mostrarEstado('ok', 'Guardado en la base de datos');
  mostrarGuardado(datos); // solo el registro recién guardado
  form.reset();

  temporizador = setTimeout(ocultarTodo, SEGUNDOS * 1000);
});
