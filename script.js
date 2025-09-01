// Funciones de formato
const formatoNumero = (x, digitos = 6) => {
  if (!Number.isFinite(x)) return '—';
  return x.toLocaleString('es-AR', { maximumFractionDigits: digitos });
};

const formatoPorcentaje = (x, digitos = 4) => {
  if (!Number.isFinite(x)) return '—';
  return (100 * x).toLocaleString('es-AR', { maximumFractionDigits: digitos }) + '%';
};

// Animación al hacer scroll
document.addEventListener('DOMContentLoaded', () => {
  // Configurar observador para animaciones
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observar todos los elementos con clase fade-in
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Observar las tarjetas individualmente para animación escalonada
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Animación escalonada con retraso
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card').forEach(card => {
    cardObserver.observe(card);
  });

  // Navegación móvil
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Cerrar menú al hacer clic en un enlace (móvil)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // Cambiar estilo de la navbar al hacer scroll
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.06)';
    }
  });

  // Calculadora de errores
  const btnCalcular = document.getElementById('btn-calcular');
  const btnLimpiar = document.getElementById('btn-limpiar');

  if (btnCalcular) {
    btnCalcular.addEventListener('click', calcularErrores);
  }

  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', limpiarCalculadora);
  }

  // Agregar funcionalidad de enter en los inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        calcularErrores();
      }
    });
  });
});

// Función para calcular errores
function calcularErrores() {
  const valorExacto = parseFloat(document.getElementById('valor-exacto').value);
  const valorAproximado = parseFloat(document.getElementById('valor-aproximado').value);
  const cotaError = parseFloat(document.getElementById('cota-error').value);

  // Validaciones
  if (!Number.isFinite(valorAproximado)) {
    alert('Por favor, ingresa un valor aproximado válido.');
    return;
  }

  // Calcular errores
  let errorAbsoluto = Number.isFinite(valorExacto) ? Math.abs(valorExacto - valorAproximado) : NaN;
  let errorRelativo = Number.isFinite(errorAbsoluto) && valorExacto !== 0 ? errorAbsoluto / Math.abs(valorExacto) : NaN;
  
  // Calcular cotas
  let cotaAbsoluta = Number.isFinite(cotaError) ? cotaError : NaN;
  let cotaRelativa = Number.isFinite(cotaError) && valorAproximado !== 0 ? cotaError / Math.abs(valorAproximado) : NaN;
  
  // Calcular intervalo
  let intervalo = '';
  if (Number.isFinite(cotaError)) {
    const limiteInferior = valorAproximado - cotaError;
    const limiteSuperior = valorAproximado + cotaError;
    intervalo = `[${formatoNumero(limiteInferior)}, ${formatoNumero(limiteSuperior)}]`;
  }

  // Mostrar resultados
  document.getElementById('error-absoluto').textContent = Number.isFinite(errorAbsoluto) ? formatoNumero(errorAbsoluto, 8) : '—';
  document.getElementById('error-relativo').textContent = Number.isFinite(errorRelativo) ? formatoPorcentaje(errorRelativo, 6) : '—';
  document.getElementById('cota-absoluta').textContent = Number.isFinite(cotaAbsoluta) ? formatoNumero(cotaAbsoluta, 8) : '—';
  document.getElementById('cota-relativa').textContent = Number.isFinite(cotaRelativa) ? formatoPorcentaje(cotaRelativa, 6) : '—';
  document.getElementById('intervalo').textContent = intervalo;

  // Generar texto explicativo
  let explicacion = '';
  
  if (Number.isFinite(valorExacto)) {
    explicacion += `El error absoluto es |${formatoNumero(valorExacto)} − ${formatoNumero(valorAproximado)}| = ${formatoNumero(errorAbsoluto, 8)}. `;
    
    if (Number.isFinite(errorRelativo)) {
      explicacion += `El error relativo es ${formatoNumero(errorAbsoluto, 8)}/${formatoNumero(Math.abs(valorExacto))} = ${formatoNumero(errorRelativo, 8)} (${formatoPorcentaje(errorRelativo, 6)}). `;
    }
  }
  
  if (Number.isFinite(cotaError)) {
    explicacion += `La cota de error absoluto garantiza que el valor exacto se encuentra en el intervalo [${formatoNumero(valorAproximado - cotaError, 8)}, ${formatoNumero(valorAproximado + cotaError, 8)}]. `;
    
    if (Number.isFinite(cotaRelativa)) {
      explicacion += `La cota de error relativo es ${formatoNumero(cotaError, 8)}/${formatoNumero(Math.abs(valorAproximado))} = ${formatoNumero(cotaRelativa, 8)} (${formatoPorcentaje(cotaRelativa, 6)}).`;
    }
  }
  
  if (!explicacion) {
    explicacion = 'Ingresa los valores necesarios para calcular los errores.';
  }
  
  document.getElementById('texto-explicacion').textContent = explicacion;
  // --- CÓDIGO PARA EL GRÁFICO ---
  if (Number.isFinite(valorAproximado) && Number.isFinite(cotaError)){
    const data = [{
      x: ['Medición'],
      y: [valorAproximado],
      type: 'bar',
      name:'Valor Aproximado',
      marker:{
        color: '#1f77b4',
        width: 0.2
      },
      error_y: {
        type: 'data',
        array:[cotaError],
        visible: true,
        color: '#FF7F0E',
        thickness: 2, 
        width: 5
      }
    }];
// Si hay un valor exacto, lo añadimos al gráfico
    if (Number.isFinite(valorExacto)) {
      data.push({
        x: ['Medición'],
        y: [valorExacto],
        type: 'scatter',
        mode: 'markers',
        name: 'Valor Exacto',
        marker: {
          color: '#ff3333ff',
          size: 10
        }
      });
    }

    
    const layout = {
      title: 'Visualización del Valor Aproximado y su Cota de Error',
      xaxis: {
        title: 'Tipo de Valor',
        showgrid: false 
      },
      yaxis: {
        title: 'Valor',
        
      },
      showlegend: true,
    };
    
    Plotly.newPlot('plot', data, layout);
  } else {
    // Si no hay datos, limpiamos el gráfico
    Plotly.purge('plot');
  }
}

// Función para limpiar la calculadora
function limpiarCalculadora() {
  document.getElementById('valor-exacto').value = '';
  document.getElementById('valor-aproximado').value = '';
  document.getElementById('cota-error').value = '';
  
  document.getElementById('error-absoluto').textContent = '—';
  document.getElementById('error-relativo').textContent = '—';
  document.getElementById('cota-absoluta').textContent = '—';
  document.getElementById('cota-relativa').textContent = '—';
  document.getElementById('intervalo').textContent = '—';
  document.getElementById('texto-explicacion').textContent = 'Ingresa los valores y haz clic en Calcular para ver los resultados y su explicación.';

  Plotly.purge('plot');
}
