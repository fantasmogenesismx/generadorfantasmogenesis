// ============================================
// GENERADOR DE FANTASMAS - OPTIMIZADO
// Capa de inicialización y gestión mejorada
// ============================================

class AppController {
  constructor() {
    this.visualizer = null;
    this.initialized = false;
    this.eventListenersSetup = false;
  }

  async init() {
    console.log('🚀 Iniciando aplicación optimizada...');
    
    try {
      // Esperar a que GhostVisualizer esté disponible
      await this.waitForVisualizer();
      
      // Crear instancia del visualizador
      this.visualizer = new GhostVisualizer();
      
      // Configurar event listeners adicionales
      this.setupOptimizedEventListeners();
      
      // Configurar atajos de teclado mejorados
      this.setupKeyboardShortcuts();
      
      // Configurar auto-hide de UI
      this.setupAutoHideUI();
      
      this.initialized = true;
      console.log('✅ Aplicación optimizada inicializada');
      
    } catch (error) {
      console.error('❌ Error en inicialización:', error);
      this.showError('Error al inicializar la aplicación');
    }
  }

  async waitForVisualizer(maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
      if (typeof GhostVisualizer !== 'undefined') {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    throw new Error('GhostVisualizer no disponible');
  }

  setupOptimizedEventListeners() {
    if (this.eventListenersSetup) return;
    
    // Debounce para sliders
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
      let timeout;
      slider.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          // El evento ya está manejado por el visualizer
          // Solo agregamos logging optimizado si es necesario
        }, 16); // ~60fps
      });
    });

    // Panel toggles con animación suave
    document.querySelectorAll('.panel-header').forEach(header => {
      header.addEventListener('click', (e) => {
        const panel = header.closest('.collapsible-panel');
        if (panel) {
          panel.classList.toggle('expanded');
          
          // Guardar estado en localStorage
          const panelId = panel.id;
          const isExpanded = panel.classList.contains('expanded');
          localStorage.setItem(`panel_${panelId}`, isExpanded);
        }
      });
    });

    // Restaurar estado de paneles
    this.restorePanelStates();

    this.eventListenersSetup = true;
  }

  restorePanelStates() {
    document.querySelectorAll('.collapsible-panel').forEach(panel => {
      const panelId = panel.id;
      const savedState = localStorage.getItem(`panel_${panelId}`);
      
      if (savedState !== null) {
        const isExpanded = savedState === 'true';
        if (isExpanded) {
          panel.classList.add('expanded');
        } else {
          panel.classList.remove('expanded');
        }
      }
    });
  }

  setupKeyboardShortcuts() {
    const shortcuts = {
      ' ': () => this.visualizer?.togglePlay?.(),
      's': () => this.visualizer?.randomizeShader?.(),
      'r': () => this.visualizer?.randomizeModulation?.(),
      'c': () => this.visualizer?.takeScreenshot?.(),
      'g': () => this.visualizer?.toggleRecording?.(),
      'f': () => this.visualizer?.toggleFullscreen?.(),
      'h': () => this.toggleAllPanels(),
      'escape': () => this.exitFullscreen(),
      '1': () => this.toggleEffect(1),
      '2': () => this.toggleEffect(2),
      '3': () => this.toggleEffect(3),
      '4': () => this.toggleEffect(4),
      '5': () => this.toggleEffect(5),
      '6': () => this.toggleEffect(6),
      '7': () => this.toggleEffect(7),
      '8': () => this.toggleEffect(8),
    };

    document.addEventListener('keydown', (e) => {
      // Ignorar si estamos en un input o select
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        return;
      }

      const key = e.key.toLowerCase();
      const handler = shortcuts[key];

      if (handler) {
        e.preventDefault();
        handler();
      }
    });
  }

  toggleEffect(effectNumber) {
    const slider = document.getElementById(`fx${effectNumber}Slider`);
    if (slider && this.visualizer) {
      const currentValue = parseInt(slider.value);
      const newValue = currentValue > 0 ? 0 : 50;
      slider.value = newValue;
      this.visualizer.effects[`fx${effectNumber}`] = newValue;
      
      // Feedback visual
      this.showToast(`FX.${effectNumber} ${newValue > 0 ? 'ON' : 'OFF'}`);
    }
  }

  toggleAllPanels() {
    const panels = document.querySelectorAll('.collapsible-panel');
    const firstPanel = panels[0];
    const shouldExpand = !firstPanel?.classList.contains('expanded');

    panels.forEach(panel => {
      if (shouldExpand) {
        panel.classList.add('expanded');
      } else {
        panel.classList.remove('expanded');
      }
    });
  }

  exitFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }

  setupAutoHideUI() {
    let hideTimeout;
    const container = document.querySelector('.container');
    const panels = document.querySelectorAll('.collapsible-panel');
    const actionBar = document.querySelector('.action-bar');

    const resetHideTimer = () => {
      clearTimeout(hideTimeout);
      
      // Mostrar UI
      container?.classList.remove('ui-hidden');
      
      // Auto-hide después de 5 segundos de inactividad
      hideTimeout = setTimeout(() => {
        if (this.visualizer?.isPlaying) {
          container?.classList.add('ui-hidden');
        }
      }, 5000);
    };

    // Eventos que resetean el timer
    ['mousemove', 'mousedown', 'keydown', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetHideTimer);
    });
  }

  showToast(message, duration = 2000) {
    // Remover toast anterior si existe
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.95);
      color: #000;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      z-index: 10001;
      animation: fadeIn 0.3s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      setTimeout(() => {
        errorDiv.style.display = 'none';
      }, 5000);
    }
  }
}

// Agregar estilos para animaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(-50%) translateY(0); }
    to { opacity: 0; transform: translateX(-50%) translateY(10px); }
  }

  .ui-hidden .collapsible-panel,
  .ui-hidden .action-bar,
  .ui-hidden .title-section {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s ease;
  }

  .container:not(.ui-hidden) .collapsible-panel,
  .container:not(.ui-hidden) .action-bar,
  .container:not(.ui-hidden) .title-section {
    opacity: 1;
    pointer-events: auto;
    transition: opacity 0.3s ease;
  }
`;
document.head.appendChild(style);

// Inicializar aplicación
let appController;

function initApp() {
  if (!appController) {
    appController = new AppController();
    appController.init();
  }
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Exportar para uso global
window.appController = appController;
