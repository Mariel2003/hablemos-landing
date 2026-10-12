// Marcador de posición si falta una imagen de wireframe
function ph(texto) {
  var d = document.createElement("div");
  d.className = "ph";
  d.textContent = texto + " (agrega la imagen en la carpeta img)";
  return d;
}

(function () {
  "use strict";

  var cfg = window.HABLEMOS_CONFIG || {};
  var configurado =
    cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY &&
    cfg.SUPABASE_URL.indexOf("PEGA_AQUI") === -1 &&
    cfg.SUPABASE_ANON_KEY.indexOf("PEGA_AQUI") === -1;

  var db = null;
  if (configurado && window.supabase) {
    db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  }

  var form = document.getElementById("beta-form");
  var boton = document.getElementById("enviar");
  var mensaje = document.getElementById("mensaje");

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(id, texto) {
    var campo = document.getElementById(id);
    var err = document.getElementById("err-" + id);
    var contenedor = campo.closest(".field");
    err.textContent = texto || "";
    if (contenedor) contenedor.classList.toggle("invalid", !!texto);
    campo.setAttribute("aria-invalid", texto ? "true" : "false");
    return !texto;
  }

  function validar() {
    var nombre = document.getElementById("nombre").value.trim();
    var correo = document.getElementById("correo").value.trim();
    var perfil = document.getElementById("perfil").value;
    var necesidad = document.getElementById("necesidad").value.trim();
    var interes = document.getElementById("interes").value;
    var consiente = document.getElementById("consentimiento").checked;

    var resultados = [
      setError("nombre", nombre.length < 2 ? "Escribe tu nombre (mínimo 2 letras)." :
                         nombre.length > 80 ? "El nombre es demasiado largo (máximo 80)." : ""),
      setError("correo", !EMAIL_RE.test(correo) ? "Escribe un correo válido, por ejemplo nombre@correo.com." : ""),
      setError("perfil", !perfil ? "Selecciona tu perfil." : ""),
      setError("necesidad", necesidad.length < 10 ? "Cuéntanos un poco más (mínimo 10 caracteres)." :
                            necesidad.length > 500 ? "Máximo 500 caracteres." : ""),
      setError("interes", !interes ? "Selecciona qué te interesa más." : ""),
      setError("consentimiento", !consiente ? "Debes aceptar para poder inscribirte." : "")
    ];

    return resultados.every(Boolean);
  }

  function mostrar(tipo, texto) {
    mensaje.className = "msg " + tipo;
    mensaje.textContent = texto;
  }

  // Validación al salir de cada campo
  ["nombre", "correo", "perfil", "necesidad", "interes", "consentimiento"].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener("change", function () { if (el.closest(".field").classList.contains("invalid")) validar(); });
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    mensaje.className = "msg";
    mensaje.textContent = "";

    // Si un bot llenó el campo trampa, fingimos éxito sin guardar
    if (document.getElementById("sitio_web").value) {
      mostrar("ok", "¡Gracias! Tu inscripción fue registrada.");
      return;
    }

    if (!validar()) {
      mostrar("bad", "Revisa los campos marcados en rojo e inténtalo de nuevo.");
      var primero = form.querySelector(".invalid input, .invalid select, .invalid textarea");
      if (primero) primero.focus();
      return;
    }

    if (!db) {
      mostrar("bad", "El formulario aún no está conectado. Falta configurar config.js con las claves de Supabase.");
      return;
    }

    boton.disabled = true;
    boton.textContent = "Enviando...";

    var registro = {
      nombre: document.getElementById("nombre").value.trim(),
      correo: document.getElementById("correo").value.trim().toLowerCase(),
      perfil: document.getElementById("perfil").value,
      necesidad: document.getElementById("necesidad").value.trim(),
      interes: document.getElementById("interes").value,
      consentimiento: true
    };

    try {
      var res = await db.from("beta_signups").insert(registro);
      if (res.error) {
        if (res.error.code === "23505") {
          mostrar("bad", "Ese correo ya está inscrito. ¡Gracias por tu interés!");
        } else {
          console.error(res.error);
          mostrar("bad", "No pudimos guardar tu inscripción. Inténtalo de nuevo en unos minutos.");
        }
      } else {
        form.reset();
        document.querySelectorAll(".field.invalid").forEach(function (f) { f.classList.remove("invalid"); });
        mostrar("ok", "¡Listo! Tu inscripción a la beta fue registrada. Te escribiremos pronto.");
      }
    } catch (err) {
      console.error(err);
      mostrar("bad", "Hubo un problema de conexión. Revisa tu internet e inténtalo de nuevo.");
    } finally {
      boton.disabled = false;
      boton.textContent = "Inscribirme a la beta";
    }
  });
})();
