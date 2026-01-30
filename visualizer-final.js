// Generador de fantasmas - V4 Estable Multicapa 
// Funcionalidades avanzadas: capas múltiples con opacidades independientes
class GhostVisualizer {
  constructor() {
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.animationId = null;
    this.startTime = Date.now();
    this.audioContext = null;
    this.analyser = null;
    this.audioData = null;
    this.currentShader = 0;
    this.isPlaying = false;
    this.currentLanguage = 'es';

    // Audio management básico
    this.audioElement = null;
    this.audioSource = null;
    this.microphoneStream = null;

    // Song management simple
    this.songQueue = [];
    this.currentSongIndex = 0;

    // MIDI básico
    this.midiAccess = null;
    this.midiInputs = [];

    // Hosting compatibility flags
    this.isHostingEnvironment = window.location.protocol === 'https:' && window.location.hostname !== 'localhost';
    this.hasAudioContext = false;
    this.hasWebGL = false;
    this.eventListenersSetup = false;

    // Uniforms básicos
    this.uniforms = {
      mod1: 0.5,
      mod2: 0.5,
      mod3: 0.5,
      mod4: 0.5,
      mod5: 0.5,
      mod6: 0.5,
      colorHue: 0.5,
      opacity: 1.0,
      saturation: 1.0
    };

    // Efectos dramáticos (intensidad 0-100)
    this.effects = {
      fx1: 0, // Glitch extremo
      fx2: 0, // Ruido caótico
      fx3: 0, // Ondas espaciales
      fx4: 0, // Espejo kaleidoscopio
      fx5: 0, // Cromática dramática
      fx6: 0, // Pixelación extrema
      fx7: 0, // Inversión pulsante
      fx8: 0  // Scanlines CRT
    };

    // Sistema MIDI
    this.midiMappings = new Map();
    this.isLearningMIDI = false;

    // Recording state
    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.currentLearningControl = null;

    // Textos en diferentes idiomas
    this.texts = {
      es: {
        title: "Generador de fantasmas",
        subtitle: "por @fantasm0genesis",
        description: "Esta aplicación convierte sonido en fantasmas que intentan recordar el mundo en el que vivían<br>Carga un archivo de audio y disfruta un visual audio reactivo en automático",
        loadAudio: "CARGAR AUDIO",
        useMicrophone: "AUDIO DEL SISTEMA",
        controlsTitle: "Modifica tu fantasma manualmente o déjalo a la suerte",
        randomStyle: "Estilo aleatorio (S)",
        randomMod: "Modificación aleatoria (R)",
        record: "GRABAR VISUAL (G)",
        play: "PLAY (BARRA ESP.)",
        screenshot: "TOMAR FOTO (C)",
        fullscreen: "PANTALLA COMPLETA (F)",
        donate: "DONAR",
        donateText: "Este generador es gratuito, pero puedes <a href=\"https://ko-fi.com/fantamosgenesis\" target=\"_blank\" rel=\"noopener noreferrer\">donar</a> si lo deseas",
        midiNotDetected: "MIDI: No detectado",
        midiConnected: "MIDI: Conectado",
        effectsTitle: "EFECTOS",
        midiMapBtn: "MAPEAR MIDI",
        midiModalTitle: "Mapeo MIDI",
        midiInstructions: "Selecciona un control y mueve un fader/knob MIDI para mapearlo",
        midiLearningStatus: "Esperando conexión MIDI...",
        clearAllMappings: "Limpiar Todo"
      },
      en: {
        title: "Ghost Generator",
        subtitle: "by @fantasm0genesis",
        description: "This app converts sound into ghosts that try to remember the world they lived in.<br>Upload an audio file and enjoy an automatically reactive audio visual",
        loadAudio: "LOAD AUDIO",
        useMicrophone: "SYSTEM AUDIO",
        controlsTitle: "Modify your ghost manually or leave it to chance",
        randomStyle: "Random Style (S)",
        randomMod: "Random Modification (R)",
        record: "RECORD VISUAL (G)",
        play: "PLAY (SPACE BAR)",
        screenshot: "SCREENSHOT (C)",
        fullscreen: "FULL SCREEN (F)",
        donate: "DONATE",
        donateText: "This generator is free, but you can <a href=\"https://ko-fi.com/fantamosgenesis\" target=\"_blank\" rel=\"noopener noreferrer\">donate</a> if you wish",
        midiNotDetected: "MIDI: Not detected",
        midiConnected: "MIDI: Connected",
        effectsTitle: "EFFECTS",
        midiMapBtn: "MIDI MAP",
        midiModalTitle: "MIDI Mapping",
        midiInstructions: "Select a control and move a MIDI fader/knob to map it",
        midiLearningStatus: "Waiting for MIDI connection...",
        clearAllMappings: "Clear All"
      }
    };

    // ===== V4 MULTICAPA VARIABLES =====

    // Layer opacities (0-1)
    this.layerOpacities = {
      shader: 1.0,    // Shader layer opacity
      camera: 0.0,    // Camera layer opacity  
      image: 0.0      // Image/GIF layer opacity
    };

    // Global color for all layers (0-1, represents hue)
    this.globalColorHue = 0.5; // Default to 180° (cyan)

    // Camera stream for camera layer
    this.cameraStream = null;
    this.cameraVideo = null;
    this.cameraTexture = null;
    this.cameraTextureConfigured = false;
    this.isCameraActive = false;

    // Image/GIF for image layer
    this.imageElement = null;
    this.imageTexture = null;
    this.isImageLoaded = false;
    this.isGifAnimated = false;
    this.gifCanvas = null;
    this.gifContext = null;

    // Effect targets V4 (determines which layers get effects applied)
    this.effectTargets = {
      fx1: { shader: true, camera: false, image: false },
      fx2: { shader: true, camera: false, image: false },
      fx3: { shader: true, camera: false, image: false },
      fx4: { shader: true, camera: false, image: false },
      fx5: { shader: true, camera: false, image: false },
      fx6: { shader: true, camera: false, image: false },
      fx7: { shader: true, camera: false, image: false },
      fx8: { shader: true, camera: false, image: false }
    };

    // V4 WebGL resources for texture rendering
    this.textureProgram = null;
    this.quadPositionBuffer = null;
    this.quadTexCoordBuffer = null;



    this.init();
  }

  // ===== INICIALIZACIÓN =====

  async init() {
    console.log('🚀 Iniciando GhostVisualizer...');

    try {
      // Método 1: Inicialización directa
      await this.initializeComponents();
      console.log('✅ Inicialización exitosa - Método directo');
    } catch (error) {
      console.warn('⚠️ Método directo falló, intentando método 2...', error);

      try {
        // Método 2: Inicialización con delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.initializeComponents();
        console.log('✅ Inicialización exitosa - Método con delay');
      } catch (error2) {
        console.warn('⚠️ Método con delay falló, intentando método 3...', error2);

        try {
          // Método 3: Inicialización mínima
          await this.initializeMinimal();
          console.log('✅ Inicialización mínima exitosa');
        } catch (error3) {
          console.error('❌ Todas las inicializaciones fallaron:', error3);
          this.showCriticalError('Error de inicialización. Recarga la página.');
        }
      }
    }
  }

  async initializeComponents() {
    // 1. Inicializar Canvas y WebGL
    await this.initializeCanvas();

    // 2. Inicializar Audio (puede fallar en hosting)
    await this.initializeAudio();

    // 3. Inicializar MIDI (puede fallar en hosting)
    await this.initializeMIDI();

    // 4. Configurar eventos
    this.setupEventListeners();

    // 5. Configurar fullscreen listeners
    this.setupFullscreenListener();

    // 6. Iniciar rendering
    this.loadShader(0);
    this.animate();

    console.log('🎯 Inicialización completa exitosa');
  }

  async initializeMinimal() {
    console.log('🔧 Iniciando modo mínimo para hosting...');

    // Solo lo esencial que debería funcionar en cualquier hosting
    await this.initializeCanvas();
    this.setupBasicEventListeners();
    this.loadShader(0);
    this.animate();

    // Mostrar advertencia de funcionalidad limitada
    this.showHostingWarning();
  }

  async initializeCanvas() {
    console.log('🖼️ Inicializando Canvas...');

    this.canvas = document.getElementById('glCanvas');
    if (!this.canvas) {
      throw new Error('Canvas no encontrado');
    }

    // Guardar tamaño original para fullscreen
    this.originalCanvasWidth = this.canvas.width;
    this.originalCanvasHeight = this.canvas.height;

    // Intentar obtener contexto WebGL con preserveDrawingBuffer para screenshots
    this.gl = this.canvas.getContext('webgl', { preserveDrawingBuffer: true }) ||
      this.canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    if (!this.gl) {
      throw new Error('WebGL no disponible');
    }

    this.hasWebGL = true;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    console.log('✅ Canvas y WebGL inicializados con tamaño original:', this.originalCanvasWidth, 'x', this.originalCanvasHeight);
  }

  async initializeAudio() {
    console.log('🎵 Inicializando Audio...');

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        throw new Error('AudioContext no disponible');
      }

      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.audioData = new Uint8Array(this.analyser.frequencyBinCount);

      this.hasAudioContext = true;
      console.log('✅ Audio inicializado');
    } catch (error) {
      console.warn('⚠️ Audio no disponible:', error);
      this.hasAudioContext = false;
      // Continuar sin audio
    }
  }

  async initializeMIDI() {
    console.log('🎹 Inicializando MIDI...');

    try {
      if (!navigator.requestMIDIAccess) {
        throw new Error('MIDI no soportado');
      }

      this.midiAccess = await navigator.requestMIDIAccess();
      this.setupMIDIInputs();
      console.log('✅ MIDI inicializado');
    } catch (error) {
      console.warn('⚠️ MIDI no disponible:', error);
      // Continuar sin MIDI
    }
  }

  // Configurar dispositivos MIDI de entrada
  setupMIDIInputs() {
    if (!this.midiAccess) {
      console.warn('⚠️ No hay acceso MIDI para configurar');
      return;
    }

    console.log('🎹 Configurando dispositivos MIDI...');

    // Configurar cada dispositivo de entrada
    for (let input of this.midiAccess.inputs.values()) {
      console.log(`🎹 Configurando dispositivo: ${input.name || 'Dispositivo MIDI'}`);

      // Agregar event listener para mensajes MIDI
      input.addEventListener('midimessage', (e) => {
        this.handleMIDIMessage(e);
      });
    }

    // Escuchar cambios en dispositivos MIDI (conectar/desconectar)
    this.midiAccess.addEventListener('statechange', (e) => {
      console.log(`🎹 Cambio de estado MIDI: ${e.port.name} - ${e.port.state}`);

      if (e.port.type === 'input') {
        if (e.port.state === 'connected') {
          console.log(`🎹 Dispositivo MIDI conectado: ${e.port.name}`);
          e.port.addEventListener('midimessage', (event) => {
            this.handleMIDIMessage(event);
          });
        } else if (e.port.state === 'disconnected') {
          console.log(`🎹 Dispositivo MIDI desconectado: ${e.port.name}`);
        }
      }

      // Actualizar estado en UI
      this.updateMIDIStatus(this.midiAccess.inputs.size > 0 ? 'connected' : 'disconnected');
    });

    // Actualizar estado inicial
    this.updateMIDIStatus(this.midiAccess.inputs.size > 0 ? 'connected' : 'disconnected');

    console.log(`✅ ${this.midiAccess.inputs.size} dispositivos MIDI configurados`);
  }

  setupBasicEventListeners() {
    console.log('🔧 Configurando eventos básicos...');

    // Solo los eventos esenciales que deberían funcionar siempre
    const randomStyleBtn = document.getElementById('randomStyleBtn');
    if (randomStyleBtn) {
      randomStyleBtn.addEventListener('click', () => {
        this.randomizeShader();
      });
    }

    // Sliders básicos
    for (let i = 1; i <= 6; i++) {
      const slider = document.getElementById(`mod${i}`);
      if (slider) {
        slider.addEventListener('input', (e) => {
          this.uniforms[`mod${i}`] = parseFloat(e.target.value) / 100;
          console.log(`🎛️ MOD${i}: ${e.target.value}%`);
        });
      }
    }

    // Sliders de color y opacidad  
    const colorSlider = document.getElementById('colorSlider');
    if (colorSlider) {
      colorSlider.addEventListener('input', (e) => {
        this.uniforms.colorHue = parseFloat(e.target.value) / 360;
        console.log(`🎨 COLOR: ${e.target.value}° (${this.uniforms.colorHue})`);
      });
    }

    const saturationSlider = document.getElementById('saturationSlider');
    if (saturationSlider) {
      saturationSlider.addEventListener('input', (e) => {
        this.uniforms.saturation = parseFloat(e.target.value) / 100;
        console.log(`🎨 SATURACIÓN: ${e.target.value}% (${this.uniforms.saturation})`);
      });
    }

    // Effects sliders
    const effectSliders = ['fx1Slider', 'fx2Slider', 'fx3Slider', 'fx4Slider', 'fx5Slider', 'fx6Slider', 'fx7Slider', 'fx8Slider'];
    effectSliders.forEach(sliderId => {
      const slider = document.getElementById(sliderId);
      if (slider) {
        slider.addEventListener('input', (e) => {
          const value = parseFloat(e.target.value);
          const effectNumber = sliderId.replace('fx', '').replace('Slider', '');
          this.effects[`fx${effectNumber}`] = value;
        });
      }
    });
  }

  // Funciones de video mixer eliminadas - Volviendo a diseño original

  showHostingWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 9999;
            background: rgba(255, 165, 0, 0.9); color: white; padding: 10px;
            border-radius: 5px; font-size: 12px; max-width: 300px;
        `;
    warningDiv.innerHTML = `
            ⚠️ <strong>Modo Hosting Limitado</strong><br>
            Algunas funciones pueden no estar disponibles due a restricciones del hosting.
        `;
    document.body.appendChild(warningDiv);

    // Auto-ocultar después de 10 segundos
    setTimeout(() => {
      if (warningDiv.parentNode) {
        warningDiv.parentNode.removeChild(warningDiv);
      }
    }, 10000);
  }

  showCriticalError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 10000; background: rgba(255, 0, 0, 0.9); color: white;
            padding: 20px; border-radius: 10px; text-align: center;
        `;
    errorDiv.innerHTML = `
            ❌ <strong>Error</strong><br>
            ${message}<br>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 10px;">Recargar</button>
        `;
    document.body.appendChild(errorDiv);
  }



  setupWebGL() {
    this.gl = this.canvas.getContext('webgl', { preserveDrawingBuffer: true }) ||
      this.canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });

    if (!this.gl) {
      throw new Error('WebGL no está soportado en este navegador');
    }

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    console.log('✅ WebGL inicializado con preserveDrawingBuffer');
  }

  setupFullscreenListener() {
    // Listener para cambios de fullscreen
    document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
  }

  handleFullscreenChange() {
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement ||
      document.mozFullScreenElement || document.msFullscreenElement;

    if (isFullscreen) {
      // Redimensionar canvas para fullscreen
      this.canvas.width = window.screen.width;
      this.canvas.height = window.screen.height;
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

      // Agregar clase fullscreen al body para ocultar elementos UI
      document.body.classList.add('fullscreen');

      // Ocultar explícitamente el song indicator
      const songIndicator = document.getElementById('songIndicator');
      if (songIndicator) {
        songIndicator.style.display = 'none';
      }
    } else {
      // Restaurar tamaño original
      this.canvas.width = this.originalCanvasWidth;
      this.canvas.height = this.originalCanvasHeight;
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

      // Quitar clase fullscreen del body
      document.body.classList.remove('fullscreen');

      // Restaurar song indicator si hay canciones en cola
      this.updateSongIndicator();
    }

    console.log(`🖥️ Fullscreen ${isFullscreen ? 'activado' : 'desactivado'}, canvas: ${this.canvas.width}x${this.canvas.height}`);
  }

  // Funciones de resize complejas eliminadas - Volviendo a diseño original

  toggleFullscreen() {
    try {
      console.log('🖥️ Abriendo ventana de pantalla completa...');

      // Verificar si estamos en Electron
      if (window.electronAPI && window.electronAPI.openFullscreenWindow) {
        // Usar la API de Electron para abrir nueva ventana
        window.electronAPI.openFullscreenWindow();
        console.log('✅ Ventana de pantalla completa solicitada a Electron');
      } else {
        // Fallback para navegador web
        console.log('⚠️ Electron no disponible, usando fullscreen del navegador');
        if (!document.fullscreenElement && !document.webkitFullscreenElement &&
          !document.mozFullScreenElement && !document.msFullscreenElement) {
          // Request fullscreen - usar canvas directamente
          if (this.canvas.requestFullscreen) {
            this.canvas.requestFullscreen();
          } else if (this.canvas.webkitRequestFullscreen) {
            this.canvas.webkitRequestFullscreen();
          } else if (this.canvas.mozRequestFullScreen) {
            this.canvas.mozRequestFullScreen();
          } else if (this.canvas.msRequestFullscreen) {
            this.canvas.msRequestFullscreen();
          }
        } else {
          // Exit fullscreen
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      }
    } catch (error) {
      console.error('❌ Error al cambiar fullscreen:', error);
      this.showError('Error al cambiar modo de pantalla');
    }
  }

  setupEventListeners() {
    // Prevenir múltiples configuraciones de eventos
    if (this.eventListenersSetup) {
      console.warn('⚠️ Event listeners ya configurados, saltando...');
      return;
    }

    try {
      console.log('🔧 Configurando event listeners...');

      // Selector de shaders
      const shaderSelect = document.getElementById('shaderSelect');
      if (shaderSelect) {
        shaderSelect.addEventListener('change', (e) => {
          this.currentShader = parseInt(e.target.value);
          this.loadShader(this.currentShader);
          console.log(`🎨 Shader cambiado a: ${this.currentShader}`);
        });
      }

      // Sliders básicos
      for (let i = 1; i <= 6; i++) {
        const slider = document.getElementById(`mod${i}`);
        if (slider) {
          slider.addEventListener('input', (e) => {
            this.uniforms[`mod${i}`] = parseFloat(e.target.value) / 100;
            console.log(`🎛️ MOD${i}: ${e.target.value}%`);
          });
        }
      }

      // Sliders de color y opacidad  
      const colorSlider = document.getElementById('colorSlider');
      if (colorSlider) {
        colorSlider.addEventListener('input', (e) => {
          this.uniforms.colorHue = parseFloat(e.target.value) / 360;
          console.log(`🎨 COLOR: ${e.target.value}° (${this.uniforms.colorHue})`);
        });
      }

      const saturationSlider = document.getElementById('saturationSlider');
      if (saturationSlider) {
        saturationSlider.addEventListener('input', (e) => {
          this.uniforms.saturation = parseFloat(e.target.value) / 100;
          console.log(`🎨 SATURACIÓN: ${e.target.value}% (${this.uniforms.saturation})`);
        });
      }

      // Effects sliders
      const effectSliders = ['fx1Slider', 'fx2Slider', 'fx3Slider', 'fx4Slider', 'fx5Slider', 'fx6Slider', 'fx7Slider', 'fx8Slider'];
      effectSliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (slider) {
          slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            const effectNumber = sliderId.replace('fx', '').replace('Slider', '');
            this.effects[`fx${effectNumber}`] = value;
          });
        }
      });

      // Botones principales - VERSIÓN CORREGIDA
      const loadAudioBtn = document.getElementById('loadAudioBtn');
      if (loadAudioBtn) {
        // Remover listeners anteriores si existen
        loadAudioBtn.replaceWith(loadAudioBtn.cloneNode(true));
        const newLoadAudioBtn = document.getElementById('loadAudioBtn');
        
        newLoadAudioBtn.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('🎵 Clic en CARGAR AUDIO');
          const audioFile = document.getElementById('audioFile');
          if (audioFile) {
            // Resetear el input para permitir recargar el mismo archivo
            audioFile.value = '';
            audioFile.click();
          }
        });
      }

      const audioFileInput = document.getElementById('audioFile');
      if (audioFileInput) {
        // Remover listeners anteriores y configurar nuevo listener robusto
        audioFileInput.replaceWith(audioFileInput.cloneNode(true));
        const newAudioFileInput = document.getElementById('audioFile');
        
        newAudioFileInput.addEventListener('change', (e) => {
          e.preventDefault();
          console.log('📁 Evento change activado, archivos:', e.target.files.length);
          
          if (e.target.files && e.target.files.length > 0) {
            console.log('🎵 Procesando archivos de audio inmediatamente...');
            this.loadAudioFiles(e.target.files);
          } else {
            console.warn('⚠️ No se detectaron archivos en el input');
          }
        });
        
        // Listener adicional para el evento input como fallback
        newAudioFileInput.addEventListener('input', (e) => {
          if (e.target.files && e.target.files.length > 0) {
            console.log('🎵 Fallback: Procesando archivos vía input event...');
            this.loadAudioFiles(e.target.files);
          }
        });
      }



      const realMicrophoneBtn = document.getElementById('realMicrophoneBtn');
      if (realMicrophoneBtn) {
        realMicrophoneBtn.addEventListener('click', () => {
          console.log('🎙️ Clic en USAR MICRÓFONO');
          this.toggleRealMicrophone();
        });
      }

      const midiMapBtn = document.getElementById('midiMapBtn');
      if (midiMapBtn) {
        midiMapBtn.addEventListener('click', () => {
          console.log('🎹 Clic en MAPEAR MIDI');
          this.showMIDIModal();
        });
      }

      const randomStyleBtn = document.getElementById('randomStyleBtn');
      if (randomStyleBtn) {
        randomStyleBtn.addEventListener('click', () => {
          console.log('🎲 Clic en shader aleatorio');
          this.randomizeShader();
        });
      }

      const randomModBtn = document.getElementById('randomModBtn');
      if (randomModBtn) {
        randomModBtn.addEventListener('click', () => {
          console.log('🔀 Clic en modulación aleatoria');
          this.randomizeModulation();
        });
      }

      const playBtn = document.getElementById('playBtn');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          console.log('▶️ Clic en PLAY/PAUSE');
          this.togglePlay();
        });
      }

      const screenshotBtn = document.getElementById('screenshotBtn');
      if (screenshotBtn) {
        screenshotBtn.addEventListener('click', () => {
          console.log('📸 Clic en TOMAR FOTO');
          this.takeScreenshot();
        });
      }

      const recordBtn = document.getElementById('recordBtn');
      if (recordBtn) {
        recordBtn.addEventListener('click', () => {
          console.log('📹 Clic en GRABAR VISUAL');
          this.toggleRecording();
        });
      }

      const fullscreenBtn = document.getElementById('fullscreenBtn');
      if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
          console.log('🖥️ Clic en PANTALLA COMPLETA');
          this.toggleFullscreen();
        });
      }

      // Controles del modal MIDI
      const midiCloseBtn = document.getElementById('midiCloseBtn');
      if (midiCloseBtn) {
        midiCloseBtn.addEventListener('click', () => {
          console.log('❌ Cerrando modal MIDI');
          this.hideMIDIModal();
        });
      }

      const clearAllMappingsBtn = document.getElementById('clearAllMappingsBtn');
      if (clearAllMappingsBtn) {
        clearAllMappingsBtn.addEventListener('click', () => {
          console.log('🗑️ Limpiando mappings MIDI');
          this.clearAllMIDIMappings();
        });
      }

      // Selector de idioma
      const languageSelect = document.getElementById('languageSelect');
      if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
          console.log(`🌍 Cambiando idioma a: ${e.target.value}`);
          this.updateLanguage(e.target.value);
        });
      }

      // Teclado shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyS') {
          e.preventDefault();
          console.log('⌨️ Shortcut: S - Shader aleatorio');
          this.randomizeShader();
        } else if (e.code === 'KeyR') {
          e.preventDefault();
          console.log('⌨️ Shortcut: R - Modulación aleatoria');
          this.randomizeModulation();
        } else if (e.code === 'Space') {
          e.preventDefault();
          console.log('⌨️ Shortcut: SPACE - Play/Pause');
          this.togglePlay();
        } else if (e.code === 'KeyC') {
          e.preventDefault();
          console.log('⌨️ Shortcut: C - Screenshot');
          this.takeScreenshot();
        } else if (e.code === 'KeyG') {
          e.preventDefault();
          console.log('⌨️ Shortcut: G - Toggle Recording');
          this.toggleRecording();
        } else if (e.code === 'KeyF') {
          e.preventDefault();
          console.log('⌨️ Shortcut: F - Fullscreen');
          this.toggleFullscreen();
        } else if (e.code === 'KeyV') {
          e.preventDefault();
          console.log('⌨️ Shortcut: V - Toggle Camera');
          this.toggleCamera();
        } else if (e.code === 'KeyI') {
          e.preventDefault();
          console.log('⌨️ Shortcut: I - Load Image');
          const imageFile = document.getElementById('imageFile');
          if (imageFile) {
            imageFile.value = '';
            imageFile.click();
          }
        }
      });

      // ===== V4 EVENT LISTENERS =====

      // Layer opacity controls
      const shaderOpacity = document.getElementById('shaderOpacity');
      if (shaderOpacity) {
        shaderOpacity.addEventListener('input', (e) => {
          this.layerOpacities.shader = parseFloat(e.target.value) / 100;
          this.updateOpacityDisplay('shaderOpacityValue', e.target.value);
          console.log(`🎭 Shader opacity: ${this.layerOpacities.shader}`);
        });
      }

      const cameraOpacity = document.getElementById('cameraOpacity');
      if (cameraOpacity) {
        cameraOpacity.addEventListener('input', (e) => {
          this.layerOpacities.camera = parseFloat(e.target.value) / 100;
          this.updateOpacityDisplay('cameraOpacityValue', e.target.value);
          console.log(`📹 Camera opacity: ${this.layerOpacities.camera}`);
        });
      }

      const imageOpacity = document.getElementById('imageOpacity');
      if (imageOpacity) {
        imageOpacity.addEventListener('input', (e) => {
          this.layerOpacities.image = parseFloat(e.target.value) / 100;
          this.updateOpacityDisplay('imageOpacityValue', e.target.value);
          console.log(`🖼️ Image opacity: ${this.layerOpacities.image}`);
        });
      }

      // Global color control - affects all layers
      const globalColorHue = document.getElementById('globalColorHue');
      if (globalColorHue) {
        globalColorHue.addEventListener('input', (e) => {
          this.globalColorHue = parseFloat(e.target.value) / 360;
          this.updateOpacityDisplay('globalColorHueValue', e.target.value + '°');
          console.log(`🌈 Global color hue: ${e.target.value}° (${this.globalColorHue})`);
        });
      }

      // Camera button
      const cameraBtn = document.getElementById('cameraBtn');
      if (cameraBtn) {
        cameraBtn.addEventListener('click', () => {
          console.log('📹 Clic en ACTIVAR CÁMARA');
          this.toggleCamera();
        });
      }

      // Load image button - VERSIÓN CORREGIDA
      const loadImageBtn = document.getElementById('loadImageBtn');
      if (loadImageBtn) {
        // Remover listeners anteriores si existen
        loadImageBtn.replaceWith(loadImageBtn.cloneNode(true));
        const newLoadImageBtn = document.getElementById('loadImageBtn');
        
        newLoadImageBtn.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('🖼️ Clic en CARGAR IMAGEN/GIF');
          const imageFile = document.getElementById('imageFile');
          if (imageFile) {
            // Resetear el input para permitir recargar el mismo archivo
            imageFile.value = '';
            imageFile.click();
          }
        });
      }

      // Image file input - VERSIÓN CORREGIDA
      const imageFile = document.getElementById('imageFile');
      if (imageFile) {
        // Remover listeners anteriores y configurar nuevo listener robusto
        imageFile.replaceWith(imageFile.cloneNode(true));
        const newImageFile = document.getElementById('imageFile');
        
        newImageFile.addEventListener('change', (e) => {
          e.preventDefault();
          console.log('📁 Evento change activado para imagen, archivos:', e.target.files.length);
          
          if (e.target.files && e.target.files.length > 0) {
            console.log('🖼️ Procesando archivo de imagen inmediatamente...');
            this.handleImageFile(e.target.files[0]);
          } else {
            console.warn('⚠️ No se detectaron archivos de imagen en el input');
          }
        });
        
        // Listener adicional para el evento input como fallback
        newImageFile.addEventListener('input', (e) => {
          if (e.target.files && e.target.files.length > 0) {
            console.log('🖼️ Fallback: Procesando imagen vía input event...');
            this.handleImageFile(e.target.files[0]);
          }
        });
      }

      // ===== V4 EFFECT TARGETING LISTENERS =====

      // Setup effect targeting checkboxes
      this.setupEffectTargetingListeners();

      // Global effect targeting buttons
      const allEffectsToShader = document.getElementById('allEffectsToShader');
      if (allEffectsToShader) {
        allEffectsToShader.addEventListener('click', () => {
          console.log('🎭 Aplicando todos los efectos solo a SHADER');
          this.setAllEffectsToTarget('shader');
        });
      }

      const allEffectsToAll = document.getElementById('allEffectsToAll');
      if (allEffectsToAll) {
        allEffectsToAll.addEventListener('click', () => {
          console.log('🎭 Aplicando todos los efectos a TODAS LAS CAPAS');
          this.setAllEffectsToTarget('all');
        });
      }

      const resetEffectTargeting = document.getElementById('resetEffectTargeting');
      if (resetEffectTargeting) {
        resetEffectTargeting.addEventListener('click', () => {
          console.log('🎭 Reseteando targeting de efectos a default');
          this.resetEffectTargeting();
        });
      }

      // Marcar como configurado
      this.eventListenersSetup = true;
      console.log('✅ Event listeners configurados exitosamente');

    } catch (error) {
      console.error('❌ Error configurando event listeners:', error);
    }
  }

  setupBasicMIDI() {
    if (!navigator.requestMIDIAccess) {
      console.log('ℹ️ MIDI no disponible en este contexto');
      return;
    }

    navigator.requestMIDIAccess()
      .then((midiAccess) => {
        this.midiAccess = midiAccess;
        this.updateMIDIStatus('connected');

        for (let input of midiAccess.inputs.values()) {
          input.addEventListener('midimessage', (e) => this.handleMIDIMessage(e));
        }

        midiAccess.addEventListener('statechange', () => {
          this.updateMIDIStatus(midiAccess.inputs.size > 0 ? 'connected' : 'disconnected');
        });

        console.log('✅ MIDI básico configurado');
      })
      .catch((error) => {
        console.log('ℹ️ MIDI no disponible:', error.message);
        this.updateMIDIStatus('disconnected');
      });
  }

  handleMIDIMessage(e) {
    const [status, cc, value] = e.data;
    const channel = (status & 0x0F) + 1;
    const messageType = status & 0xF0;

    // Solo procesar Control Change (0xB0)
    if (messageType === 0xB0) {
      // Si estamos aprendiendo, mapear el control
      if (this.isLearningMIDI && this.currentLearningControl) {
        this.midiMappings.set(this.currentLearningControl, {
          cc: cc,
          channel: channel
        });

        console.log(`✅ MIDI mapeado: ${this.currentLearningControl} -> CC ${cc}, Canal ${channel}`);

        // Cancelar el modo de aprendizaje
        this.isLearningMIDI = false;
        this.currentLearningControl = null;

        // Regenerar la lista para mostrar el nuevo mapeo
        this.generateMIDIMappingsList();
        this.updateMIDIModalStatus();

        return;
      }

      // Buscar mapeo existente y aplicar valor
      for (const [controlId, mapping] of this.midiMappings) {
        if (mapping.cc === cc && mapping.channel === channel) {
          this.applyMIDIValue(controlId, value);
          break;
        }
      }
    }
  }

  applyMIDIValue(controlId, midiValue) {
    const normalizedValue = midiValue / 127;

    console.log(`🎹 Aplicando MIDI: ${controlId} = ${midiValue} (${normalizedValue})`);

    // Mapear según el tipo de control
    if (controlId.includes('mod')) {
      const modNumber = controlId.replace('mod', '');
      this.uniforms[`mod${modNumber}`] = normalizedValue;

      // Actualizar slider visual
      const slider = document.getElementById(controlId);
      if (slider) {
        slider.value = Math.round(normalizedValue * 100);
        console.log(`🎹 MOD ${modNumber}: ${Math.round(normalizedValue * 100)}%`);
      }

    } else if (controlId === 'colorSlider') {
      this.uniforms.colorHue = normalizedValue;

      const slider = document.getElementById('colorSlider');
      if (slider) {
        slider.value = Math.round(normalizedValue * 360);
        console.log(`🎹🎨 COLOR: ${Math.round(normalizedValue * 360)}°`);
      }

    } else if (controlId === 'saturationSlider') {
      this.uniforms.saturation = normalizedValue * 2; // 0-200% saturación

      const slider = document.getElementById('saturationSlider');
      if (slider) {
        slider.value = Math.round(this.uniforms.saturation * 100);
        console.log(`🎹🎨 SATURACIÓN: ${Math.round(this.uniforms.saturation * 100)}%`);
      }

    } else if (controlId === 'shaderOpacity') {
      this.layerOpacities.shader = normalizedValue;

      const slider = document.getElementById('shaderOpacity');
      if (slider) {
        slider.value = Math.round(normalizedValue * 100);
        this.updateOpacityDisplay('shaderOpacityValue', Math.round(normalizedValue * 100));
        console.log(`🎹🎭 SHADER OPACITY: ${Math.round(normalizedValue * 100)}%`);
      }

    } else if (controlId === 'cameraOpacity') {
      this.layerOpacities.camera = normalizedValue;

      const slider = document.getElementById('cameraOpacity');
      if (slider) {
        slider.value = Math.round(normalizedValue * 100);
        this.updateOpacityDisplay('cameraOpacityValue', Math.round(normalizedValue * 100));
        console.log(`🎹📹 CAMERA OPACITY: ${Math.round(normalizedValue * 100)}%`);
      }

    } else if (controlId === 'imageOpacity') {
      this.layerOpacities.image = normalizedValue;

      const slider = document.getElementById('imageOpacity');
      if (slider) {
        slider.value = Math.round(normalizedValue * 100);
        this.updateOpacityDisplay('imageOpacityValue', Math.round(normalizedValue * 100));
        console.log(`🎹🖼️ IMAGE OPACITY: ${Math.round(normalizedValue * 100)}%`);
      }

    } else if (controlId === 'globalColorHue') {
      this.globalColorHue = normalizedValue;

      const slider = document.getElementById('globalColorHue');
      if (slider) {
        slider.value = Math.round(normalizedValue * 360);
        this.updateOpacityDisplay('globalColorHueValue', Math.round(normalizedValue * 360) + '°');
        console.log(`🎹🌈 GLOBAL COLOR: ${Math.round(normalizedValue * 360)}°`);
      }

    } else if (controlId.includes('fx') && controlId.includes('Slider')) {
      const fxNumber = controlId.replace('fx', '').replace('Slider', '');
      this.effects[`fx${fxNumber}`] = Math.round(normalizedValue * 100);

      const slider = document.getElementById(controlId);
      if (slider) {
        slider.value = Math.round(normalizedValue * 100);
        console.log(`🎹🎭 EFECTO ${fxNumber}: ${Math.round(normalizedValue * 100)}%`);
      }

    } else if (controlId === 'randomStyleBtn') {
      // Activar solo cuando el valor MIDI es alto (> 63, que es > 50%)
      if (midiValue > 63) {
        this.randomizeShader();
        console.log(`🎹🎲 ESTILO ALEATORIO activado via MIDI`);
      }

    } else if (controlId === 'randomModBtn') {
      // Activar solo cuando el valor MIDI es alto (> 63, que es > 50%)
      if (midiValue > 63) {
        this.randomizeModulation();
        console.log(`🎹🔀 MODIFICACIÓN ALEATORIA activada via MIDI`);
      }
    }
  }

  updateSlider(sliderId, value) {
    const slider = document.getElementById(sliderId);
    if (slider) {
      slider.value = value;
    }
  }

  updateMIDIStatus(status) {
    const midiStatus = document.getElementById('midiStatus');
    if (midiStatus) {
      midiStatus.className = `midi-status ${status}`;
      const statusText = document.getElementById('midiStatusText');
      if (statusText) {
        const texts = this.texts[this.currentLanguage];
        statusText.textContent = status === 'connected' ? texts.midiConnected : texts.midiNotDetected;
      }
    }
  }

  setupAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.audioData = new Uint8Array(this.analyser.frequencyBinCount);
      console.log('✅ Audio context inicializado');
    } catch (error) {
      console.error('❌ Error inicializando audio context:', error);
    }
  }

  setupMicrophone() {
    // Intentar capturar audio del sistema usando getDisplayMedia
    navigator.mediaDevices.getDisplayMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      },
      video: {
        displaySurface: "monitor",
        logicalSurface: true,
        cursor: "never"
      }
    })
      .then(stream => {
        this.microphoneStream = stream;
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }

        const source = this.audioContext.createMediaStreamSource(stream);
        source.connect(this.analyser);

        console.log('✅ Audio del sistema conectado');
        this.showSuccessMessage('Audio del sistema activado correctamente');



        // Manejar cuando el usuario detiene la captura
        stream.getVideoTracks().forEach(track => {
          track.addEventListener('ended', () => {
            console.log('🛑 Captura de audio del sistema detenida por el usuario');
            // Función eliminada - audio del sistema ya no está disponible
          });
          // Detener las pistas de video ya que solo queremos audio
          track.stop();
        });
      })
      .catch(error => {
        console.error('❌ Error accediendo al audio del sistema:', error);

        this.showError('Error al acceder al audio del sistema: ' + error.message);
      });
  }

  

  loadAudioFiles(files) {
    if (files.length === 0) return;

    this.songQueue = Array.from(files);
    this.currentSongIndex = 0;
    this.loadCurrentSong();
  }

  loadCurrentSong() {
    if (this.songQueue.length === 0) return;

    const file = this.songQueue[this.currentSongIndex];
    const url = URL.createObjectURL(file);

    if (this.audioElement) {
      this.audioElement.pause();
    }

    this.audioElement = new Audio(url);
    this.audioElement.addEventListener('loadeddata', () => {
      this.setupAudioSource();
      this.updateSongIndicator();
      console.log(`✅ Audio cargado: ${file.name}`);
    });

    this.audioElement.addEventListener('ended', () => {
      this.nextSong();
    });

    this.audioElement.load();
  }

  setupAudioSource() {
    if (this.audioSource) {
      this.audioSource.disconnect();
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
    this.audioSource.connect(this.analyser);
    this.audioSource.connect(this.audioContext.destination);
  }

  nextSong() {
    if (this.songQueue.length > 1) {
      this.currentSongIndex = (this.currentSongIndex + 1) % this.songQueue.length;
      this.loadCurrentSong();
    }
  }

  togglePlay() {
    if (!this.audioElement) {
      this.showError('Carga un archivo de audio primero');
      return;
    }

    if (this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    } else {
      this.audioElement.play();
      this.isPlaying = true;
    }

    this.updatePlayButton();
  }

  updatePlayButton() {
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
      const texts = this.texts[this.currentLanguage];
      playBtn.textContent = this.isPlaying ? 'PAUSE' : texts.play;
    }
  }

  updateSongIndicator() {
    const songIndicator = document.getElementById('songIndicator');
    if (songIndicator && this.songQueue.length > 0) {
      const currentSong = this.songQueue[this.currentSongIndex];
      const songName = currentSong.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const displayText = this.songQueue.length > 1
        ? `${songName} (${this.currentSongIndex + 1}/${this.songQueue.length})`
        : songName;

      songIndicator.textContent = displayText;
      songIndicator.style.display = 'block';
    }
  }

  randomizeStyle() {
    const randomShader = Math.floor(Math.random() * 40);
    this.currentShader = randomShader;
    this.loadShader(randomShader);

    const shaderSelect = document.getElementById('shaderSelect');
    if (shaderSelect) {
      shaderSelect.value = randomShader;
    }
  }

  randomizeModifications() {
    // Randomize modulators
    this.uniforms.mod1 = Math.random();
    this.uniforms.mod2 = Math.random();
    this.uniforms.mod3 = Math.random();
    this.uniforms.mod4 = Math.random();
    this.uniforms.mod5 = Math.random();
    this.uniforms.mod6 = Math.random();
    this.uniforms.colorHue = Math.random();
    this.uniforms.opacity = Math.random();

    // Randomize effects - corregido para usar this.effects
    this.effects.fx1 = Math.round(Math.random() * 100);
    this.effects.fx2 = Math.round(Math.random() * 100);
    this.effects.fx3 = Math.round(Math.random() * 100);
    this.effects.fx4 = Math.round(Math.random() * 100);
    this.effects.fx5 = Math.round(Math.random() * 100);
    this.effects.fx6 = Math.round(Math.random() * 100);
    this.effects.fx7 = Math.round(Math.random() * 100);
    this.effects.fx8 = Math.round(Math.random() * 100);

    // Update modulator sliders
    this.updateSlider('mod1', this.uniforms.mod1 * 100);
    this.updateSlider('mod2', this.uniforms.mod2 * 100);
    this.updateSlider('mod3', this.uniforms.mod3 * 100);
    this.updateSlider('mod4', this.uniforms.mod4 * 100);
    this.updateSlider('mod5', this.uniforms.mod5 * 100);
    this.updateSlider('mod6', this.uniforms.mod6 * 100);
    this.updateSlider('colorSlider', this.uniforms.colorHue * 360);

    // Randomize saturation (0.2 to 1.8 for interesting range)
    this.uniforms.saturation = 0.2 + Math.random() * 1.6;
    this.updateSlider('saturationSlider', this.uniforms.saturation * 100);

    // Update effect sliders - corregido para usar this.effects
    this.updateSlider('fx1Slider', this.effects.fx1);
    this.updateSlider('fx2Slider', this.effects.fx2);
    this.updateSlider('fx3Slider', this.effects.fx3);
    this.updateSlider('fx4Slider', this.effects.fx4);
    this.updateSlider('fx5Slider', this.effects.fx5);
    this.updateSlider('fx6Slider', this.effects.fx6);
    this.updateSlider('fx7Slider', this.effects.fx7);
    this.updateSlider('fx8Slider', this.effects.fx8);
  }

  takeScreenshot() {
    try {
      // Render current frame before capturing
      this.render();

      // Small delay to ensure render is complete
      setTimeout(() => {
        try {
          const link = document.createElement('a');
          link.download = `fantasma-${new Date().getTime()}.png`;

          // Use preserveDrawingBuffer or read pixels directly
          let dataURL;
          if (this.gl && this.canvas) {
            // Force a render and read pixels
            this.gl.finish();
            dataURL = this.canvas.toDataURL('image/png');
          } else {
            dataURL = this.canvas.toDataURL('image/png');
          }

          link.href = dataURL;
          link.click();
          this.showSuccessMessage('Screenshot guardado');
        } catch (innerError) {
          console.error('❌ Error interno al tomar screenshot:', innerError);
          this.showError('Error al capturar imagen');
        }
      }, 100);
    } catch (error) {
      console.error('❌ Error al tomar screenshot:', error);
      this.showError('Error al tomar captura de pantalla');
    }
  }

  toggleRecording() {
    if (!this.isRecording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  startRecording() {
    try {
      // Verificar compatibilidad con MediaRecorder
      if (!this.canvas.captureStream) {
        throw new Error('captureStream no soportado');
      }

      // Create stream from canvas
      const stream = this.canvas.captureStream(30); // 30 FPS

      // Configure MediaRecorder con fallbacks para hosting
      let options = { videoBitsPerSecond: 2500000 }; // 2.5 Mbps para compatibilidad

      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options.mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options.mimeType = 'video/webm;codecs=vp8';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        options.mimeType = 'video/webm';
      } else {
        throw new Error('Formato de video no soportado');
      }

      this.mediaRecorder = new MediaRecorder(stream, options);
      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.saveRecording();
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('❌ Error en MediaRecorder:', event.error);
        this.stopRecording();
        this.showError('Error durante la grabación');
      };

      this.mediaRecorder.start(100); // Capture every 100ms
      this.isRecording = true;

      // Update button text
      const recordBtn = document.getElementById('recordBtn');
      if (recordBtn) {
        const texts = this.texts[this.currentLanguage];
        recordBtn.textContent = this.currentLanguage === 'es' ? 'PARAR GRABACIÓN (G)' : 'STOP RECORDING (G)';
        recordBtn.style.background = '#ff4444';
      }

      this.showSuccessMessage(this.currentLanguage === 'es' ? 'Grabación iniciada' : 'Recording started');
      console.log('📹 Grabación iniciada');

    } catch (error) {
      console.error('❌ Error al iniciar grabación:', error);
      this.showError(this.currentLanguage === 'es' ? 'Error al iniciar grabación' : 'Error starting recording');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      try {
        this.mediaRecorder.stop();
        this.isRecording = false;

        // Reset button
        const recordBtn = document.getElementById('recordBtn');
        if (recordBtn) {
          const texts = this.texts[this.currentLanguage];
          recordBtn.textContent = texts.record || 'GRABAR VISUAL (G)';
          recordBtn.style.background = '#ffffff';
        }

        console.log('⏹️ Grabación detenida');
      } catch (error) {
        console.error('❌ Error al detener grabación:', error);
        this.isRecording = false;
      }
    }
  }

  saveRecording() {
    try {
      if (this.recordedChunks.length === 0) {
        throw new Error('No hay datos para guardar');
      }

      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `fantasma-video-${new Date().getTime()}.webm`;

      // Hosting compatibility: ensure download works
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up after delay to ensure download started
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      this.recordedChunks = [];

      this.showSuccessMessage(this.currentLanguage === 'es' ? 'Video guardado' : 'Video saved');
      console.log('💾 Video guardado exitosamente');

    } catch (error) {
      console.error('❌ Error al guardar video:', error);
      this.showError(this.currentLanguage === 'es' ? 'Error al guardar video' : 'Error saving video');
    }
  }

  changeLanguage(lang) {
    this.currentLanguage = lang;
    const texts = this.texts[lang];

    // Update UI texts
    const elements = {
      'mainTitle': 'title',
      'subtitle': 'subtitle',
      'description': 'description',
      'loadAudioBtn': 'loadAudio',
      
      'controlsTitle': 'controlsTitle',
      'randomStyleBtn': 'randomStyle',
      'randomModBtn': 'randomMod',
      'recordBtn': 'record',
      'screenshotBtn': 'screenshot',
      'fullscreenBtn': 'fullscreen',
      'donateText': 'donateText',
      'effectsTitle': 'effectsTitle',
      'midiMapBtn': 'midiMapBtn',
      'midiModalTitle': 'midiModalTitle',
      'midiInstructions': 'midiInstructions',
      'midiLearningStatus': 'midiLearningStatus',
      'clearAllMappingsBtn': 'clearAllMappings'
    };



    for (const [elementId, textKey] of Object.entries(elements)) {
      const element = document.getElementById(elementId);
      if (element && texts[textKey]) {
        if (elementId === 'description' || elementId === 'donateText') {
          element.innerHTML = texts[textKey];
        } else {
          element.textContent = texts[textKey];
        }
      }
    }


    this.updatePlayButton();
    this.updateMIDIStatus(this.midiAccess && this.midiAccess.inputs.size > 0 ? 'connected' : 'disconnected');

    console.log(`🌍 Idioma cambiado a: ${lang}`);
  }

  showError(message) {
    console.error('🚨 ERROR:', message);
    
    // Intentar mostrar en UI si es posible
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      errorElement.style.backgroundColor = '#ff4444';
      errorElement.style.color = 'white';
      errorElement.style.padding = '10px';
      errorElement.style.borderRadius = '5px';
      errorElement.style.margin = '10px 0';
      errorElement.style.zIndex = '9999';

      setTimeout(() => {
        this.hideError();
      }, 8000); // Más tiempo para leer
    } else {
      // Fallback: crear elemento de error temporal
      console.warn('⚠️ Elemento errorMessage no encontrado, creando fallback');
      this.createTemporaryErrorDisplay(message);
    }
    
    // También mostrar en consola para debugging
    console.trace('Error stack trace:');
  }

  hideError() {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  createTemporaryErrorDisplay(message) {
    // Crear overlay de error temporal si el elemento principal no existe
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px;
      border-radius: 8px;
      max-width: 400px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    overlay.textContent = message;
    
    document.body.appendChild(overlay);
    
    // Auto-remover después de 8 segundos
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 8000);
  }

  showSuccessMessage(message) {
    console.log('✅', message);
    // Simple success indication
  }

  // Basic shader system with 40 shaders
  loadShader(index) {
    // Simplified shader loading - basic WebGL shaders for visual effects
    const shaders = this.getBasicShaders();
    if (index >= 0 && index < shaders.length) {
      this.createShaderProgram(shaders[index]);
    }
  }

  getBasicShaders() {
    // Return array of 40 basic shader fragments
    return Array(40).fill().map((_, i) => this.generateBasicShader(i));
  }

  generateBasicShader(index) {
    // Generate basic shader code based on index
    return {
      vertex: `
                attribute vec2 a_position;
                void main() {
                    gl_Position = vec4(a_position, 0.0, 1.0);
                }
            `,
      fragment: `
                precision mediump float;
                uniform float u_time;
                uniform vec2 u_resolution;
                uniform float u_mod1, u_mod2, u_mod3, u_mod4, u_mod5, u_mod6;
                uniform float u_colorHue, u_opacity, u_saturation;
                uniform float u_globalColorHue; // Global color for all layers
                uniform float u_audioLevel;
                
                // HSV to RGB conversion
                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }
                
                // RGB to HSV conversion
                vec3 rgb2hsv(vec3 c) {
                    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
                    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
                    float d = q.x - min(q.w, q.y);
                    float e = 1.0e-10;
                    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
                }
                

                
                void main() {
                    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                    float time = u_time * 0.001;
                    
                    // Basic shader variations based on index
                    vec3 color = vec3(0.0);
                    
                    ${this.getShaderCode(index)}
                    
                    // Apply shader-specific color hue and saturation transformation
                    vec3 hsv = rgb2hsv(color);
                    hsv.x = fract(hsv.x + u_colorHue); // Shader-specific hue shift
                    hsv.y = hsv.y * u_saturation; // Apply saturation
                    color = hsv2rgb(hsv);
                    
                    // Apply global color hue transformation (affects all layers)
                    hsv = rgb2hsv(color);
                    hsv.x = fract(hsv.x + u_globalColorHue); // Global hue shift
                    color = hsv2rgb(hsv);
                    
                    // Apply opacity
                    color = color * u_opacity;
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `
    };
  }

  getShaderCode(index) {
    // 40 COMPLETELY UNIQUE SHADER PATTERNS - ENHANCED VARIETY & COLORS
    const patterns = [
      // ORGANIC FLOW SERIES (0-4) - Natural, fluid movements
      `float noise1 = sin(uv.x * 8.0 + time * u_mod1 + u_audioLevel * 3.0) * cos(uv.y * 6.0 + time * u_mod2); float noise2 = sin(uv.y * 10.0 + time * u_mod3) * cos(uv.x * 7.0 + time * u_mod4); float organic = noise1 * noise2 + sin(time + u_audioLevel * 4.0); vec3 warm = vec3(0.9, 0.4, 0.1); vec3 cool = vec3(0.1, 0.3, 0.8); color = mix(warm, cool, (organic + 1.0) * 0.5) * (1.0 + u_audioLevel * 1.5);`,

      `vec2 flow = uv + vec2(sin(time * u_mod1 + uv.y * 5.0), cos(time * u_mod2 + uv.x * 4.0)) * (0.1 + u_audioLevel * 0.2); float pattern = sin(flow.x * 12.0 + time * u_mod3) * cos(flow.y * 8.0 + time * u_mod4); vec3 forest = vec3(0.2, 0.8, 0.3); vec3 autumn = vec3(0.9, 0.6, 0.1); color = mix(forest, autumn, pattern * 0.5 + 0.5) * (0.8 + u_audioLevel * 2.0);`,

      `float wave = sin(uv.x * 15.0 + sin(time * u_mod1 + uv.y * 8.0) + u_audioLevel * 5.0); float ripple = cos(uv.y * 12.0 + cos(time * u_mod2 + uv.x * 6.0)); float organic = wave * ripple + sin(time * u_mod3 + distance(uv, vec2(0.5)) * 10.0); vec3 ocean = vec3(0.0, 0.4, 0.8); vec3 coral = vec3(1.0, 0.3, 0.4); color = mix(ocean, coral, smoothstep(-1.0, 1.0, organic)) * (1.2 + u_audioLevel * u_mod4);`,

      `vec2 center = vec2(0.5 + sin(time * u_mod1) * 0.3, 0.5 + cos(time * u_mod2) * 0.2); float dist = distance(uv, center); float breath = sin(dist * 20.0 - time * u_mod3 + u_audioLevel * 6.0) * cos(dist * 15.0 + time * u_mod4); vec3 purple = vec3(0.6, 0.2, 0.9); vec3 gold = vec3(1.0, 0.8, 0.2); color = mix(purple, gold, breath * 0.5 + 0.5) * (0.9 + u_audioLevel * 1.8);`,

      `float spiral = atan(uv.y - 0.5, uv.x - 0.5) + length(uv - 0.5) * 8.0 + time * u_mod1; float petals = sin(spiral * u_mod2 + time) * cos(spiral * 0.5 + time * u_mod3 + u_audioLevel * 4.0); vec3 pink = vec3(1.0, 0.4, 0.7); vec3 violet = vec3(0.4, 0.1, 0.9); color = mix(pink, violet, petals * 0.5 + 0.5) * (1.1 + u_audioLevel * u_mod4 * 2.0);`,

      // NEON CYBER SERIES (5-9) - Futuristic, electric aesthetics
      `vec2 grid = floor(uv * 20.0 * u_mod1); float circuit = mod(grid.x + grid.y, 2.0); float pulse = sin(time * u_mod2 + circuit * 3.14159 + u_audioLevel * 8.0); vec3 cyan = vec3(0.0, 1.0, 1.0); vec3 magenta = vec3(1.0, 0.0, 1.0); color = mix(cyan, magenta, pulse * 0.5 + 0.5) * pow(circuit + 0.3, 2.0) * (0.7 + u_audioLevel * u_mod3 * 2.5);`,

      `float scan = sin(uv.y * 40.0 * u_mod1 + time * u_mod2 + u_audioLevel * 10.0); float glitch = step(0.95, sin(time * u_mod3 + uv.x * 100.0)); vec2 offset = vec2(glitch * 0.1, 0.0); vec2 shifted = uv + offset; float data = sin(shifted.x * 50.0 + time * u_mod4); vec3 green = vec3(0.0, 1.0, 0.2); color = green * (scan + data) * (1.0 + u_audioLevel * 3.0);`,

      `float hologram = sin(uv.x * 30.0 + time * u_mod1) * sin(uv.y * 25.0 + time * u_mod2 + u_audioLevel * 7.0); float interference = cos(uv.x * uv.y * 100.0 + time * u_mod3); vec3 blue = vec3(0.2, 0.4, 1.0); vec3 white = vec3(1.0, 1.0, 1.0); color = mix(blue, white, hologram * interference * 0.5 + 0.5) * (0.8 + u_audioLevel * u_mod4 * 2.0);`,

      `vec2 hex = vec2(uv.x * 2.0, uv.y + uv.x * 0.5) * 15.0 * u_mod1; vec2 hexId = floor(hex); float hexDist = length(hex - hexId - 0.5); float hexPattern = step(0.3, hexDist) * sin(hexId.x + hexId.y + time * u_mod2 + u_audioLevel * 5.0); vec3 neon = vec3(sin(time * u_mod3), cos(time * u_mod4), 1.0); color = neon * hexPattern * (1.2 + u_audioLevel * 2.0);`,

      `float matrix = sin(uv.x * 8.0 + time * u_mod1) * step(0.7, sin(uv.y * 50.0 + time * u_mod2 + u_audioLevel * 6.0)); float code = sin(uv.y * 100.0 + time * u_mod3); vec3 digital = vec3(0.0, matrix * code, 0.0); float flicker = sin(time * u_mod4 * 20.0 + u_audioLevel * 15.0); color = digital * (1.0 + flicker * 0.3) * (0.9 + u_audioLevel * 2.5);`,

      // COSMIC VOID SERIES (10-14) - Deep space, ethereal
      `vec2 space = (uv - 0.5) * 2.0; float nebula = sin(space.x * 5.0 + time * u_mod1) * cos(space.y * 4.0 + time * u_mod2 + u_audioLevel * 3.0); float stars = step(0.98, sin(space.x * 100.0 + time * u_mod3) * cos(space.y * 80.0 + time * u_mod4)); vec3 deep = vec3(0.1, 0.0, 0.3); vec3 bright = vec3(0.9, 0.7, 1.0); color = mix(deep, bright, nebula * 0.3 + stars) * (0.6 + u_audioLevel * 2.0);`,

      `float galaxy = length(uv - 0.5); float arm = atan(uv.y - 0.5, uv.x - 0.5) + galaxy * 3.0 + time * u_mod1; float spiral = sin(arm * u_mod2 + time) * exp(-galaxy * 5.0 * u_mod3); vec3 core = vec3(1.0, 0.8, 0.4); vec3 edge = vec3(0.2, 0.1, 0.6); color = mix(edge, core, spiral + 0.2) * (1.0 + u_audioLevel * u_mod4 * 1.5);`,

      `vec2 cosmic = uv - 0.5; float blackhole = 1.0 / (length(cosmic) + 0.1); float warp = sin(atan(cosmic.y, cosmic.x) * 8.0 + time * u_mod1 + blackhole + u_audioLevel * 4.0); vec3 event = vec3(0.0, 0.0, 0.1); vec3 accretion = vec3(1.0, 0.3, 0.0); color = mix(event, accretion, warp * blackhole * u_mod2) * (0.8 + u_audioLevel * u_mod3 * 2.0);`,

      `float constellation = step(0.95, sin(uv.x * 30.0 + time * u_mod1) * cos(uv.y * 25.0 + time * u_mod2)); float aurora = sin(uv.y * 10.0 + time * u_mod3 + u_audioLevel * 5.0) * cos(uv.x * 8.0 + time); vec3 night = vec3(0.0, 0.1, 0.2); vec3 light = vec3(0.0, 1.0, 0.6); color = mix(night, light, aurora * 0.4) + constellation * vec3(1.0, 1.0, 0.8) * (1.1 + u_audioLevel * u_mod4);`,

      `vec2 void = uv * 3.0 - 1.5; float vortex = atan(void.y, void.x) + length(void) + time * u_mod1; float energy = sin(vortex * u_mod2 + time) * cos(vortex * 0.5 + time * u_mod3 + u_audioLevel * 6.0); vec3 dark = vec3(0.1, 0.0, 0.4); vec3 plasma = vec3(0.8, 0.2, 1.0); color = mix(dark, plasma, energy * 0.5 + 0.3) * (0.9 + u_audioLevel * u_mod4 * 2.2);`,

      // RETRO SYNTH SERIES (15-19) - 80s aesthetic, vaporwave
      `float sunset = 1.0 - uv.y; float grid = sin(uv.x * 20.0 * u_mod1) * sin(uv.y * 15.0 * u_mod2 + time + u_audioLevel * 4.0); vec3 pink = vec3(1.0, 0.2, 0.6); vec3 orange = vec3(1.0, 0.5, 0.0); vec3 purple = vec3(0.5, 0.0, 1.0); color = mix(mix(purple, pink, sunset), orange, grid * 0.3) * (1.0 + u_audioLevel * u_mod3 * 1.8);`,

      `vec2 retro = uv * vec2(10.0 * u_mod1, 5.0 * u_mod2); vec2 retroId = floor(retro); float retroPattern = sin(retroId.x + retroId.y + time * u_mod3 + u_audioLevel * 3.0); vec3 vapor = vec3(sin(time * u_mod4), cos(time * u_mod4 + 2.0), sin(time * u_mod4 + 4.0)) * 0.5 + 0.5; color = vapor * (retroPattern * 0.5 + 0.7) * (0.8 + u_audioLevel * 2.0);`,

      `float wave80s = sin(uv.x * 12.0 + time * u_mod1) + cos(uv.y * 8.0 + time * u_mod2 + u_audioLevel * 5.0); float neon = pow(abs(wave80s), 0.5); vec3 cyan80s = vec3(0.0, 0.8, 1.0); vec3 magenta80s = vec3(1.0, 0.0, 0.8); color = mix(cyan80s, magenta80s, neon) * (1.2 + u_audioLevel * u_mod3 * 1.5);`,

      `vec2 laser = uv - 0.5; float angle = atan(laser.y, laser.x) + time * u_mod1; float beam = sin(angle * 8.0 + time * u_mod2) * cos(length(laser) * 15.0 + time * u_mod3 + u_audioLevel * 4.0); vec3 laser1 = vec3(1.0, 0.0, 0.5); vec3 laser2 = vec3(0.0, 1.0, 0.5); color = mix(laser1, laser2, beam * 0.5 + 0.5) * (0.9 + u_audioLevel * u_mod4 * 2.1);`,

      `float chrome = length(uv - 0.5); float reflection = sin(chrome * 20.0 + time * u_mod1) * cos(atan(uv.y - 0.5, uv.x - 0.5) * 6.0 + time * u_mod2 + u_audioLevel * 6.0); vec3 silver = vec3(0.8, 0.8, 0.9); vec3 rainbow = vec3(sin(time * u_mod3), cos(time * u_mod3 + 2.0), sin(time * u_mod3 + 4.0)) * 0.5 + 0.5; color = mix(silver, rainbow, reflection * 0.4 + 0.3) * (1.1 + u_audioLevel * 2.0);`,

      // PSYCHEDELIC KALEIDOSCOPE SERIES (20-24) - Trippy, consciousness-expanding
      `vec2 psyche = uv - 0.5; psyche = vec2(psyche.x * cos(time * u_mod1) - psyche.y * sin(time * u_mod1), psyche.x * sin(time * u_mod1) + psyche.y * cos(time * u_mod1)); float mandala = sin(length(psyche) * 15.0 + time * u_mod2) * cos(atan(psyche.y, psyche.x) * 7.0 + time * u_mod3 + u_audioLevel * 8.0); vec3 trip = vec3(sin(mandala + time * u_mod4), cos(mandala + time * u_mod4 + 2.0), sin(mandala + time * u_mod4 + 4.0)) * 0.5 + 0.5; color = trip * (1.3 + u_audioLevel * 2.5);`,

      `float fractal = 0.0; vec2 z = uv - 0.5; for(int i = 0; i < 10; i++) { z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + vec2(sin(time * u_mod1 + float(i)), cos(time * u_mod2 + float(i))) * (0.3 + u_audioLevel * 0.5); fractal += exp(-length(z)); } vec3 rainbow = vec3(sin(fractal * u_mod3), cos(fractal * u_mod4), sin(fractal + 3.14159)) * 0.5 + 0.5; color = rainbow * (0.8 + u_audioLevel * 2.0);`,

      `vec2 mirror = abs(uv - 0.5); mirror = fract(mirror * 8.0 * u_mod1); float pattern = sin(mirror.x * 10.0 + time * u_mod2) * cos(mirror.y * 12.0 + time * u_mod3 + u_audioLevel * 6.0); vec3 warm = vec3(1.0, 0.6, 0.2); vec3 cool = vec3(0.2, 0.6, 1.0); vec3 blend = mix(warm, cool, sin(time * u_mod4 + pattern) * 0.5 + 0.5); color = blend * (pattern + 1.0) * (1.0 + u_audioLevel * 1.8);`,

      `vec2 k = uv - 0.5; float r = length(k); float a = atan(k.y, k.x); float kaleid = sin(a * 6.0 + r * 20.0 + time * u_mod1) * cos(a * 4.0 - r * 15.0 + time * u_mod2 + u_audioLevel * 5.0); kaleid = abs(kaleid); vec3 spectrum = vec3(sin(kaleid * u_mod3 + time), cos(kaleid * u_mod4 + time + 2.0), sin(kaleid + time + 4.0)) * 0.5 + 0.5; color = spectrum * (1.2 + u_audioLevel * 2.2);`,

      `float time_warp = time * u_mod1 + u_audioLevel * 3.0; vec2 warped = vec2(uv.x + sin(uv.y * 8.0 + time_warp) * 0.1, uv.y + cos(uv.x * 6.0 + time_warp) * 0.1); float hypno = sin(warped.x * 20.0 + time * u_mod2) * sin(warped.y * 18.0 + time * u_mod3); vec3 hypnotic = vec3(hypno, sin(hypno * u_mod4 + time), cos(hypno - time)) * 0.5 + 0.5; color = hypnotic * (0.9 + u_audioLevel * 2.3);`,

      // NATURAL PHENOMENA SERIES (25-29) - Weather, elements, nature
      `float cloud = sin(uv.x * 6.0 + time * u_mod1) * cos(uv.y * 4.0 + time * u_mod2) + sin(uv.x * 12.0 + time * u_mod3 + u_audioLevel * 3.0) * 0.5; float lightning = step(0.98, sin(uv.x * 100.0 + time * u_mod4 * 10.0 + u_audioLevel * 20.0)); vec3 storm = vec3(0.2, 0.2, 0.4); vec3 flash = vec3(1.0, 1.0, 0.8); color = mix(storm, flash, lightning) + storm * (cloud * 0.3 + 0.7) * (1.0 + u_audioLevel * 2.0);`,

      `float fire = sin(uv.x * 8.0 + sin(time * u_mod1 + uv.y * 12.0) + u_audioLevel * 5.0) * (1.0 - uv.y); fire *= cos(uv.x * 10.0 + time * u_mod2); vec3 flame = mix(vec3(1.0, 0.3, 0.0), vec3(1.0, 1.0, 0.0), fire * u_mod3); vec3 ember = vec3(0.8, 0.1, 0.0); color = mix(ember, flame, fire * 0.8 + 0.2) * (0.8 + u_audioLevel * u_mod4 * 2.0);`,

      `vec2 water = uv + vec2(sin(time * u_mod1 + uv.y * 8.0), cos(time * u_mod2 + uv.x * 6.0)) * (0.05 + u_audioLevel * 0.1); float wave = sin(water.x * 15.0 + time * u_mod3) * cos(water.y * 12.0 + time); vec3 deep_blue = vec3(0.0, 0.2, 0.6); vec3 foam = vec3(0.8, 0.9, 1.0); color = mix(deep_blue, foam, wave * 0.3 + 0.4) * (1.0 + u_audioLevel * u_mod4 * 1.5);`,

      `float wind = sin(uv.x * 5.0 + time * u_mod1 + u_audioLevel * 4.0) + cos(uv.y * 3.0 + time * u_mod2); float leaves = step(0.6, sin(uv.x * 20.0 + wind + time * u_mod3) * cos(uv.y * 15.0 + wind)); vec3 sky = vec3(0.4, 0.7, 1.0); vec3 autumn_leaf = vec3(0.9, 0.7, 0.1); color = mix(sky, autumn_leaf, leaves * wind * 0.5 + 0.3) * (0.9 + u_audioLevel * u_mod4 * 1.8);`,

      `vec2 earth = uv * 8.0; vec2 earthId = floor(earth); float rock = sin(earthId.x * 2.0 + earthId.y * 3.0 + time * u_mod1) * cos(earthId.x + earthId.y * 2.0 + time * u_mod2 + u_audioLevel * 3.0); float moss = smoothstep(0.3, 0.7, rock); vec3 stone = vec3(0.5, 0.4, 0.3); vec3 green = vec3(0.2, 0.6, 0.1); color = mix(stone, green, moss) * (rock * 0.3 + 0.8) * (1.0 + u_audioLevel * u_mod3 * u_mod4);`,

      // ABSTRACT GEOMETRY SERIES (30-34) - Pure mathematical beauty
      `float phi = 1.61803398875; vec2 fib = uv * phi; float fibonacci = sin(fib.x * 8.0 + time * u_mod1) * cos(fib.y * 5.0 + time * u_mod2 + u_audioLevel * 4.0); float golden = sin(fibonacci * phi + time * u_mod3); vec3 gold = vec3(1.0, 0.8, 0.0); vec3 bronze = vec3(0.8, 0.5, 0.2); color = mix(bronze, gold, golden * 0.5 + 0.5) * (fibonacci * 0.3 + 0.9) * (1.0 + u_audioLevel * u_mod4 * 1.7);`,

      `vec2 pent = vec2(cos(2.0 * 3.14159 / 5.0), sin(2.0 * 3.14159 / 5.0)); float pentagon = 0.0; for(int i = 0; i < 5; i++) { float angle = float(i) * 2.0 * 3.14159 / 5.0 + time * u_mod1; vec2 vertex = vec2(cos(angle), sin(angle)) * 0.3 + 0.5; pentagon += 1.0 / (distance(uv, vertex) + 0.1); } pentagon *= sin(time * u_mod2 + u_audioLevel * 5.0); vec3 sacred = vec3(sin(pentagon * u_mod3), cos(pentagon * u_mod4), sin(pentagon + 3.14159)); color = sacred * 0.5 + 0.5;`,

      `float tessellation = 0.0; for(int i = 0; i < 6; i++) { float angle = float(i) * 3.14159 / 3.0; vec2 hex_corner = vec2(cos(angle), sin(angle)) * (0.2 + sin(time * u_mod1 + float(i)) * 0.1) + 0.5; tessellation += sin(distance(uv, hex_corner) * 20.0 + time * u_mod2 + u_audioLevel * 3.0); } vec3 crystal = vec3(tessellation * u_mod3, sin(tessellation * u_mod4 + time), cos(tessellation - time)) * 0.5 + 0.5; color = crystal * (1.0 + u_audioLevel * 2.0);`,

      `vec2 complex = uv - 0.5; float julia = 0.0; for(int i = 0; i < 15; i++) { complex = vec2(complex.x * complex.x - complex.y * complex.y, 2.0 * complex.x * complex.y) + vec2(sin(time * u_mod1), cos(time * u_mod2)) * (0.4 + u_audioLevel * 0.3); julia = length(complex); if(julia > 2.0) break; } vec3 fractal_color = vec3(sin(julia * u_mod3), cos(julia * u_mod4), sin(julia + time)) * 0.5 + 0.5; color = fractal_color * (0.8 + u_audioLevel * 1.8);`,

      `float topology = sin(uv.x * uv.y * 50.0 + time * u_mod1) * cos((uv.x + uv.y) * 25.0 + time * u_mod2 + u_audioLevel * 6.0); float manifold = sin(topology * 3.0 + time * u_mod3); vec3 dimension = vec3(manifold, sin(manifold * u_mod4 + time), cos(manifold - time)) * 0.5 + 0.5; color = dimension * (topology * 0.2 + 0.9) * (1.1 + u_audioLevel * 2.1);`,

      // LIQUID METAL SERIES (35-39) - Metallic, flowing, industrial
      `vec2 metal = uv + vec2(sin(time * u_mod1 + uv.y * 6.0), cos(time * u_mod2 + uv.x * 4.0)) * (0.1 + u_audioLevel * 0.2); float mercury = sin(metal.x * 12.0 + time * u_mod3) * cos(metal.y * 10.0 + time); vec3 silver_base = vec3(0.7, 0.7, 0.8); vec3 chrome = vec3(0.9, 0.9, 1.0); color = mix(silver_base, chrome, mercury * 0.5 + 0.5) * (mercury * 0.3 + 0.8) * (1.0 + u_audioLevel * u_mod4 * 1.9);`,

      `float copper = sin(uv.x * 8.0 + time * u_mod1) * sin(uv.y * 6.0 + time * u_mod2 + u_audioLevel * 4.0); float oxidation = cos(copper * 5.0 + time * u_mod3); vec3 copper_shine = vec3(0.9, 0.4, 0.1); vec3 verdigris = vec3(0.0, 0.5, 0.3); color = mix(copper_shine, verdigris, oxidation * 0.4 + 0.3) * (copper * 0.4 + 0.7) * (1.0 + u_audioLevel * u_mod4 * 2.0);`,

      `vec2 molten = uv - 0.5; float heat = length(molten) + sin(time * u_mod1 + u_audioLevel * 3.0) * 0.2; float flow = sin(atan(molten.y, molten.x) * 4.0 + time * u_mod2) * cos(heat * 8.0 + time * u_mod3); vec3 hot_metal = vec3(1.0, 0.3, 0.0); vec3 white_hot = vec3(1.0, 1.0, 0.8); color = mix(hot_metal, white_hot, flow * 0.6 + 0.4) * (1.2 + u_audioLevel * u_mod4 * 1.5);`,

      `float steel = sin(uv.x * 15.0 + time * u_mod1) + cos(uv.y * 12.0 + time * u_mod2 + u_audioLevel * 5.0); float forge = sin(steel * 4.0 + time * u_mod3); vec3 iron = vec3(0.3, 0.3, 0.4); vec3 spark = vec3(1.0, 0.8, 0.0); color = mix(iron, spark, forge * 0.3 + 0.2) * (steel * 0.2 + 0.9) * (0.8 + u_audioLevel * u_mod4 * 2.2);`,

      `vec2 alloy = uv * 6.0; vec2 alloyId = floor(alloy); float metallic = sin(alloyId.x + alloyId.y + time * u_mod1) * cos(alloyId.x * 2.0 - alloyId.y + time * u_mod2 + u_audioLevel * 4.0); float polish = smoothstep(0.2, 0.8, metallic); vec3 brushed = vec3(0.6, 0.6, 0.7); vec3 mirror = vec3(0.95, 0.95, 1.0); color = mix(brushed, mirror, polish) * (metallic * 0.4 + 0.7) * (1.0 + u_audioLevel * u_mod3 * u_mod4 * 1.8);`
    ];

    return patterns[index % patterns.length];
  }

  createShaderProgram(shaderData) {
    try {
      console.log('🔄 Creando nuevo programa de shader...');

      const vertexShader = this.createShader(this.gl.VERTEX_SHADER, shaderData.vertex);
      const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, shaderData.fragment);

      if (!vertexShader || !fragmentShader) {
        throw new Error('Error compilando shaders');
      }

      // Limpiar programa anterior
      if (this.program) {
        console.log('🧹 Eliminando programa anterior...');
        this.gl.deleteProgram(this.program);
        this.program = null;
      }

      // Crear nuevo programa
      this.program = this.gl.createProgram();
      this.gl.attachShader(this.program, vertexShader);
      this.gl.attachShader(this.program, fragmentShader);
      this.gl.linkProgram(this.program);

      if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        const error = this.gl.getProgramInfoLog(this.program);
        throw new Error('Error linking shader program: ' + error);
      }

      // Activar programa y configurar uniforms
      this.gl.useProgram(this.program);
      this.setupShaderUniforms();

      console.log('✅ Programa de shader creado exitosamente');

    } catch (error) {
      console.error('❌ Error creating shader:', error);
      this.program = null;
    }
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error('Error compiling shader: ' + this.gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  setupShaderUniforms() {
    // Create buffer for quad
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]);

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.render();
  }

  render() {
    if (!this.program) return;

    // Get audio data
    if (this.analyser && this.audioData) {
      this.analyser.getByteFrequencyData(this.audioData);
    }

    const audioLevel = this.getAudioLevel();
    const time = Date.now() - this.startTime;

    // APLICAR EFECTOS DRAMÁTICOS - VERSIÓN ROBUSTA PARA HOSTING
    this.applyEffectsRobust(time, audioLevel);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Set uniforms
    this.setUniform('u_time', time);
    this.setUniform('u_resolution', [this.canvas.width, this.canvas.height]);
    this.setUniform('u_mod1', this.uniforms.mod1);
    this.setUniform('u_mod2', this.uniforms.mod2);
    this.setUniform('u_mod3', this.uniforms.mod3);
    this.setUniform('u_mod4', this.uniforms.mod4);
    this.setUniform('u_mod5', this.uniforms.mod5);
    this.setUniform('u_mod6', this.uniforms.mod6);
    this.setUniform('u_colorHue', this.uniforms.colorHue);
    this.setUniform('u_opacity', this.uniforms.opacity);
    this.setUniform('u_saturation', this.uniforms.saturation);
    this.setUniform('u_globalColorHue', this.globalColorHue);
    this.setUniform('u_audioLevel', audioLevel);

    // Debug log muy ocasional para verificar valores
    if (Math.random() < 0.001) { // Log muy ocasional para no spam
      console.log(`🔧 Uniforms: mod1=${this.uniforms.mod1.toFixed(2)}, mod2=${this.uniforms.mod2.toFixed(2)}, mod5=${this.uniforms.mod5.toFixed(2)}, mod6=${this.uniforms.mod6.toFixed(2)}, colorHue=${this.uniforms.colorHue.toFixed(2)}, opacity=${this.uniforms.opacity.toFixed(2)}, audioLevel=${audioLevel.toFixed(2)}`);

      // Log efectos activos
      const activeEffects = Object.entries(this.effects).filter(([key, value]) => value > 0);
      if (activeEffects.length > 0) {
        console.log(`🎭 Efectos activos:`, activeEffects.map(([key, value]) => `${key}=${value}%`).join(', '));
      }
    }

    // V4 MULTICAPA RENDER: Renderizar shader base con opacidad de capa
    if (this.layerOpacities.shader > 0) {
      // Activar blending para shader también si la opacidad es menor a 1
      if (this.layerOpacities.shader < 1.0) {
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        // Crear un color de fondo transparente
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Aplicar opacidad del shader multiplicando por la opacidad de capa
        const originalOpacity = this.uniforms.opacity;
        this.setUniform('u_opacity', this.uniforms.opacity * this.layerOpacities.shader);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        // Restaurar opacidad original
        this.setUniform('u_opacity', originalOpacity);

        this.gl.disable(this.gl.BLEND);
      } else {
        // Opacidad completa, renderizar normalmente
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
      }
    }

    // V4 MULTICAPA RENDER: Renderizar capas adicionales con blending
    this.renderAdditionalLayers();
  }



  // V4 MULTICAPA: Renderizar capas adicionales (imagen y cámara)
  renderAdditionalLayers() {
    try {
      // Activar blending para capas adicionales
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

      let layersRendered = 0;

      // Renderizar capa de imagen si está cargada y visible
      if (this.isImageLoaded && this.imageTexture && this.layerOpacities.image > 0) {
        // Actualizar textura para GIFs animados
        if (this.isGifAnimated) {
          this.updateImageTexture();
        }
        this.renderImageLayer();
        layersRendered++;
      }

      // Renderizar capa de cámara si está activa y visible
      if (this.isCameraActive && this.cameraVideo && this.layerOpacities.camera > 0) {
        const textureUpdated = this.updateCameraTexture();
        if (textureUpdated) {
          this.renderCameraLayer();
          layersRendered++;
        }
      }

      // Log ocasional para debug
      if (Math.random() < 0.01 && layersRendered > 0) {
        console.log(`🎭 Capas adicionales renderizadas: ${layersRendered}`);
      }

    } catch (error) {
      console.error('❌ Error al renderizar capas adicionales:', error);
    } finally {
      // Siempre desactivar blending
      this.gl.disable(this.gl.BLEND);
    }
  }

  // V4 MULTICAPA: Renderizar capa de imagen
  renderImageLayer() {
    if (!this.textureProgram) {
      this.createTextureProgram();
    }

    if (!this.textureProgram) return;

    // Usar el programa de texturas
    this.gl.useProgram(this.textureProgram);

    // Configurar atributos
    const positionLocation = this.gl.getAttribLocation(this.textureProgram, 'a_position');
    const texCoordLocation = this.gl.getAttribLocation(this.textureProgram, 'a_texCoord');

    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.enableVertexAttribArray(texCoordLocation);

    // Configurar geometría (quad que cubre toda la pantalla)
    this.setupQuadGeometry(positionLocation, texCoordLocation);

    // Configurar uniforms básicos
    const opacityLocation = this.gl.getUniformLocation(this.textureProgram, 'u_opacity');
    const textureLocation = this.gl.getUniformLocation(this.textureProgram, 'u_texture');

    this.gl.uniform1f(opacityLocation, this.layerOpacities.image);

    // Configurar uniforms de efectos V4 para imagen
    this.setTextureEffectUniforms('image');

    // Activar y vincular textura de imagen
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.imageTexture);
    this.gl.uniform1i(textureLocation, 0);

    // Renderizar
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    // Volver al programa principal
    this.gl.useProgram(this.program);
  }

  // V4 MULTICAPA: Renderizar capa de cámara
  renderCameraLayer() {
    if (!this.textureProgram) {
      this.createTextureProgram();
    }

    if (!this.textureProgram || !this.cameraTexture) {
      // Log silencioso para debug sin spam
      if (Math.random() < 0.01) {
        console.log('⚠️ No se puede renderizar cámara - faltan recursos');
      }
      return;
    }

    try {
      // Usar el programa de texturas
      this.gl.useProgram(this.textureProgram);

      // Configurar atributos
      const positionLocation = this.gl.getAttribLocation(this.textureProgram, 'a_position');
      const texCoordLocation = this.gl.getAttribLocation(this.textureProgram, 'a_texCoord');

      if (positionLocation === -1 || texCoordLocation === -1) {
        console.error('❌ No se pudieron obtener atributos del shader de texturas');
        return;
      }

      this.gl.enableVertexAttribArray(positionLocation);
      this.gl.enableVertexAttribArray(texCoordLocation);

      // Configurar geometría (quad que cubre toda la pantalla)
      this.setupQuadGeometry(positionLocation, texCoordLocation);

      // Configurar uniforms
      const opacityLocation = this.gl.getUniformLocation(this.textureProgram, 'u_opacity');
      const textureLocation = this.gl.getUniformLocation(this.textureProgram, 'u_texture');

      if (opacityLocation === null || textureLocation === null) {
        console.error('❌ No se pudieron obtener uniforms del shader de texturas');
        return;
      }

      this.gl.uniform1f(opacityLocation, this.layerOpacities.camera);

      // Configurar uniforms de efectos V4 para cámara
      this.setTextureEffectUniforms('camera');

      // Activar y vincular textura de cámara
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.cameraTexture);
      this.gl.uniform1i(textureLocation, 0);

      // Renderizar
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

      // Log ocasional de éxito para confirmar que está funcionando
      if (Math.random() < 0.001) {
        console.log('📹 Cámara renderizada exitosamente');
      }

    } catch (error) {
      console.error('❌ Error al renderizar capa de cámara:', error);
    } finally {
      // Siempre volver al programa principal
      this.gl.useProgram(this.program);
    }
  }

  // V4 MULTICAPA: Actualizar textura de cámara con frame actual
  updateCameraTexture() {
    if (!this.isCameraActive || !this.cameraVideo) return false;

    // Solo actualizar si hay nuevos datos de video disponibles
    if (this.cameraVideo.readyState >= this.cameraVideo.HAVE_CURRENT_DATA) {
      return this.createCameraTexture();
    }

    return false;
  }

  // V4 MULTICAPA: Crear programa de shaders para texturas con efectos
  createTextureProgram() {
    const vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;

    const fragmentShaderSource = `
            precision mediump float;
            
            uniform sampler2D u_texture;
            uniform float u_opacity;
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform float u_audioLevel;
            uniform float u_globalColorHue; // Global color for all layers
            
            // Effect uniforms
            uniform float u_fx1; // Glitch
            uniform float u_fx2; // Zoom
            uniform float u_fx3; // Mirror
            uniform float u_fx4; // Invert
            uniform float u_fx5; // Rotation
            uniform float u_fx6; // Waves
            uniform float u_fx7; // Pixelation
            uniform float u_fx8; // Teleport
            
            varying vec2 v_texCoord;
            
            // HSV to RGB conversion
            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            // RGB to HSV conversion
            vec3 rgb2hsv(vec3 c) {
                vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
                vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
                float d = q.x - min(q.w, q.y);
                float e = 1.0e-10;
                return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
            }
            
            void main() {
                vec2 uv = v_texCoord;
                float time = u_time * 0.001; // Convert to seconds
                
                // Apply effects to UV coordinates
                
                // FX1 - Glitch Effect
                if (u_fx1 > 0.0) {
                    float intensity = u_fx1 / 100.0;
                    if (sin(time * 50.0 + uv.y * 20.0) > 1.0 - intensity) {
                        uv.x += sin(time * 100.0) * intensity * 0.1;
                    }
                }
                
                // FX2 - Zoom Effect
                if (u_fx2 > 0.0) {
                    float intensity = u_fx2 / 100.0;
                    float zoom = 1.0 + sin(time * 2.0) * intensity * 0.5;
                    uv = (uv - 0.5) * zoom + 0.5;
                }
                
                // FX3 - Mirror Effect
                if (u_fx3 > 0.0) {
                    float intensity = u_fx3 / 100.0;
                    uv = mix(uv, abs(uv - 0.5) + 0.5, intensity);
                }
                
                // FX5 - Rotation Effect
                if (u_fx5 > 0.0) {
                    float intensity = u_fx5 / 100.0;
                    float angle = time * intensity * 2.0;
                    vec2 center = vec2(0.5);
                    uv -= center;
                    float cos_a = cos(angle);
                    float sin_a = sin(angle);
                    uv = vec2(uv.x * cos_a - uv.y * sin_a, uv.x * sin_a + uv.y * cos_a);
                    uv += center;
                }
                
                // FX6 - Wave Effect
                if (u_fx6 > 0.0) {
                    float intensity = u_fx6 / 100.0;
                    uv.x += sin(uv.y * 10.0 + time * 5.0) * intensity * 0.1;
                    uv.y += cos(uv.x * 10.0 + time * 3.0) * intensity * 0.1;
                }
                
                // FX7 - Pixelation Effect
                if (u_fx7 > 0.0) {
                    float intensity = u_fx7 / 100.0;
                    float pixelSize = mix(0.001, 0.05, intensity);
                    uv = floor(uv / pixelSize) * pixelSize;
                }
                
                // FX8 - Teleport Effect
                if (u_fx8 > 0.0) {
                    float intensity = u_fx8 / 100.0;
                    if (sin(time * 10.0 + length(uv - 0.5) * 20.0) > 1.0 - intensity * 0.5) {
                        uv = fract(uv + vec2(sin(time * 17.0), cos(time * 13.0)) * intensity);
                    }
                }
                
                // Sample texture with modified UV
                vec4 texColor = texture2D(u_texture, uv);
                
                // FX4 - Color Invert Effect (applied to color, not UV)
                if (u_fx4 > 0.0) {
                    float intensity = u_fx4 / 100.0;
                    texColor.rgb = mix(texColor.rgb, 1.0 - texColor.rgb, intensity * (sin(time * 8.0) * 0.5 + 0.5));
                }
                
                // Apply global color hue transformation (affects all layers)
                vec3 hsv = rgb2hsv(texColor.rgb);
                hsv.x = fract(hsv.x + u_globalColorHue); // Global hue shift
                texColor.rgb = hsv2rgb(hsv);
                
                gl_FragColor = vec4(texColor.rgb, texColor.a * u_opacity);
            }
        `;

    try {
      // Crear shaders
      const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

      // Crear programa
      this.textureProgram = this.gl.createProgram();
      this.gl.attachShader(this.textureProgram, vertexShader);
      this.gl.attachShader(this.textureProgram, fragmentShader);
      this.gl.linkProgram(this.textureProgram);

      if (!this.gl.getProgramParameter(this.textureProgram, this.gl.LINK_STATUS)) {
        throw new Error('Error linking texture program: ' + this.gl.getProgramInfoLog(this.textureProgram));
      }

      console.log('✅ Programa de texturas V4 con efectos creado exitosamente');

    } catch (error) {
      console.error('❌ Error al crear programa de texturas V4:', error);
      this.textureProgram = null;
    }
  }

  // V4 MULTICAPA: Configurar geometría para quad de pantalla completa
  setupQuadGeometry(positionLocation, texCoordLocation) {
    // Vertices para quad de pantalla completa
    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1
    ]);

    // Coordenadas de textura (volteadas en Y para corregir orientación)
    const texCoords = new Float32Array([
      0, 1,
      1, 1,
      0, 0,
      0, 0,
      1, 1,
      1, 0
    ]);

    // Buffer de posiciones
    if (!this.quadPositionBuffer) {
      this.quadPositionBuffer = this.gl.createBuffer();
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadPositionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Buffer de coordenadas de textura
    if (!this.quadTexCoordBuffer) {
      this.quadTexCoordBuffer = this.gl.createBuffer();
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadTexCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  // Versión robusta de aplicación de efectos para hosting V4
  applyEffectsRobust(time, audioLevel) {
    // Verificar que el objeto effects existe
    if (!this.effects) {
      this.effects = {
        fx1: 0, fx2: 0, fx3: 0, fx4: 0,
        fx5: 0, fx6: 0, fx7: 0, fx8: 0
      };
    }

    // Aplicar efectos solo a la capa de SHADER si está configurado
    this.applyEffectsToShader(time, audioLevel);

    // Los efectos para cámara e imagen se aplicarán durante el renderizado de esas capas
  }

  // Apply effects specifically to shader layer
  applyEffectsToShader(time, audioLevel) {
    // Guardar valores base para shader
    const baseUniforms = {
      mod1: this.uniforms.mod1,
      mod2: this.uniforms.mod2,
      mod3: this.uniforms.mod3,
      mod4: this.uniforms.mod4,
      mod5: this.uniforms.mod5,
      mod6: this.uniforms.mod6,
      colorHue: this.uniforms.colorHue,
      opacity: this.uniforms.opacity
    };

    // FX1 - GLITCH DIGITAL (solo si está configurado para shader)
    if (this.effects.fx1 > 0 && this.shouldApplyEffectToLayer('fx1', 'shader')) {
      const intensity = this.effects.fx1 / 100;

      if (Math.random() < intensity * 0.3) {
        this.uniforms.mod1 = Math.random();
        this.uniforms.mod2 = Math.random();
      }

      const digitalNoise = Math.floor(Math.random() * 8) / 8.0;
      this.uniforms.mod3 = baseUniforms.mod3 + digitalNoise * intensity * (1 + audioLevel * 3);
      this.uniforms.mod4 = baseUniforms.mod4 + (Math.random() < 0.5 ? 1 : -1) * intensity * 0.5;

      // Efecto de velocidad de tiempo variable
      if (Math.random() < intensity * 0.2) {
        this.uniforms.mod5 = Math.random(); // Modifica velocidad de animación
      }
    }

    // FX2 - ZOOM INFINITO (solo si está configurado para shader)
    if (this.effects.fx2 > 0 && this.shouldApplyEffectToLayer('fx2', 'shader')) {
      const intensity = this.effects.fx2 / 100;
      const zoomPulse = Math.sin(time * 0.01 * intensity) * intensity * (2 + audioLevel * 4);

      this.uniforms.mod1 = baseUniforms.mod1 * (1 + zoomPulse);
      this.uniforms.mod2 = baseUniforms.mod2 * (1 + zoomPulse);
      this.uniforms.mod3 = baseUniforms.mod3 + Math.cos(time * 0.02) * intensity * 1.5;
      this.uniforms.mod4 = baseUniforms.mod4 + Math.sin(time * 0.005) * intensity * audioLevel * 2;
    }

    // FX3 - ESPEJO KALEIDOSCOPIO (solo si está configurado para shader)
    if (this.effects.fx3 > 0 && this.shouldApplyEffectToLayer('fx3', 'shader')) {
      const intensity = this.effects.fx3 / 100;
      const mirrorTime = time * 0.003 * intensity;

      this.uniforms.mod1 = Math.abs(Math.sin(baseUniforms.mod1 * 3.14159 * intensity));
      this.uniforms.mod2 = Math.abs(Math.cos(baseUniforms.mod2 * 3.14159 * intensity));

      // Efecto de simetría en patrón en lugar de color
      this.uniforms.mod5 = Math.abs(Math.sin(mirrorTime + audioLevel)) * intensity +
        baseUniforms.mod5 * (1 - intensity);

      this.uniforms.opacity = Math.abs(Math.sin(mirrorTime * 2)) * intensity +
        baseUniforms.opacity * (1 - intensity);
    }

    // FX4 - INVERSIÓN COLORES (solo si está configurado para shader)
    if (this.effects.fx4 > 0 && this.shouldApplyEffectToLayer('fx4', 'shader')) {
      const intensity = this.effects.fx4 / 100;
      const invertPulse = (Math.sin(time * 0.008) + 1) * 0.5;

      // Efecto de inversión de patrones en lugar de color
      this.uniforms.mod5 = (1.0 - baseUniforms.mod5) * intensity * invertPulse +
        baseUniforms.mod5 * (1 - intensity * invertPulse);
      this.uniforms.mod6 = (1.0 - baseUniforms.mod6) * intensity * invertPulse +
        baseUniforms.mod6 * (1 - intensity * invertPulse);

      this.uniforms.mod1 = (1.0 - baseUniforms.mod1) * intensity + baseUniforms.mod1 * (1 - intensity);
      this.uniforms.mod2 = (1.0 - baseUniforms.mod2) * intensity + baseUniforms.mod2 * (1 - intensity);

      this.uniforms.opacity = (1.0 - baseUniforms.opacity) * intensity + baseUniforms.opacity * (1 - intensity);
    }

    // FX5 - ROTACIÓN VÓRTICE (solo si está configurado para shader)
    if (this.effects.fx5 > 0 && this.shouldApplyEffectToLayer('fx5', 'shader')) {
      const intensity = this.effects.fx5 / 100;
      const rotationSpeed = time * 0.01 * intensity * (1 + audioLevel * 2);

      this.uniforms.mod1 = baseUniforms.mod1 + Math.sin(rotationSpeed) * intensity * 1.5;
      this.uniforms.mod2 = baseUniforms.mod2 + Math.cos(rotationSpeed) * intensity * 1.5;

      this.uniforms.mod3 = baseUniforms.mod3 + Math.sin(rotationSpeed * 2) * intensity * audioLevel * 2;
      this.uniforms.mod4 = baseUniforms.mod4 + Math.cos(rotationSpeed * 1.5) * intensity * 1.2;

      // Efecto de rotación en patrones en lugar de color
      this.uniforms.mod5 = (baseUniforms.mod5 + rotationSpeed * 0.1 * intensity) % 1.0;
      this.uniforms.mod6 = (baseUniforms.mod6 + rotationSpeed * 0.15 * intensity) % 1.0;
    }

    // FX6 - ONDAS TSUNAMI (solo si está configurado para shader)
    if (this.effects.fx6 > 0 && this.shouldApplyEffectToLayer('fx6', 'shader')) {
      const intensity = this.effects.fx6 / 100;
      const waveTime = time * 0.005 * intensity;

      this.uniforms.mod1 = baseUniforms.mod1 + Math.sin(waveTime * 2) * intensity * (3 + audioLevel * 5);
      this.uniforms.mod2 = baseUniforms.mod2 + Math.cos(waveTime * 1.5) * intensity * (3 + audioLevel * 5);

      this.uniforms.mod3 = baseUniforms.mod3 + Math.sin(waveTime * 3 + baseUniforms.mod1) * intensity * 2;
      this.uniforms.mod4 = baseUniforms.mod4 + Math.cos(waveTime * 2.5 + baseUniforms.mod2) * intensity * 2;

      this.uniforms.colorHue = baseUniforms.colorHue + Math.sin(waveTime * 0.5) * intensity * 0.3;
    }

    // FX7 - PIXELACIÓN RETRO (solo si está configurado para shader)
    if (this.effects.fx7 > 0 && this.shouldApplyEffectToLayer('fx7', 'shader')) {
      const intensity = this.effects.fx7 / 100;
      const pixelFactor = Math.max(2, 50 * (1 - intensity * 0.9));

      this.uniforms.mod1 = Math.floor(baseUniforms.mod1 * pixelFactor) / pixelFactor;
      this.uniforms.mod2 = Math.floor(baseUniforms.mod2 * pixelFactor) / pixelFactor;
      this.uniforms.mod3 = Math.floor(baseUniforms.mod3 * pixelFactor) / pixelFactor;
      this.uniforms.mod4 = Math.floor(baseUniforms.mod4 * pixelFactor) / pixelFactor;

      if (Math.floor(time / 100) !== Math.floor((time - 16) / 100)) {
        this.uniforms.colorHue = Math.floor(baseUniforms.colorHue * 8) / 8;
        this.uniforms.opacity = Math.floor(baseUniforms.opacity * 4) / 4;
      }
    }

    // FX8 - TELEPORTACIÓN (solo si está configurado para shader)
    if (this.effects.fx8 > 0 && this.shouldApplyEffectToLayer('fx8', 'shader')) {
      const intensity = this.effects.fx8 / 100;

      if (Math.random() < intensity * 0.1 * (1 + audioLevel * 3)) {
        this.uniforms.mod1 = Math.random();
        this.uniforms.mod2 = Math.random();
        this.uniforms.mod3 = Math.random();
        this.uniforms.mod4 = Math.random();

        this.uniforms.colorHue = Math.random();
        this.uniforms.opacity = Math.random();
      }

      this.uniforms.mod1 = baseUniforms.mod1 + (Math.random() - 0.5) * intensity * 0.3 * audioLevel;
      this.uniforms.mod2 = baseUniforms.mod2 + (Math.random() - 0.5) * intensity * 0.3 * audioLevel;
    }

    // Mantener valores en rangos válidos
    this.uniforms.colorHue = ((this.uniforms.colorHue % 1) + 1) % 1;
    this.uniforms.opacity = Math.max(0, Math.min(1, this.uniforms.opacity));
    this.uniforms.mod1 = Math.max(0, Math.min(1, this.uniforms.mod1));
    this.uniforms.mod2 = Math.max(0, Math.min(1, this.uniforms.mod2));
    this.uniforms.mod3 = Math.max(0, Math.min(1, this.uniforms.mod3));
    this.uniforms.mod4 = Math.max(0, Math.min(1, this.uniforms.mod4));
    this.uniforms.mod5 = Math.max(0, Math.min(1, this.uniforms.mod5));
    this.uniforms.mod6 = Math.max(0, Math.min(1, this.uniforms.mod6));
    this.uniforms.opacity = Math.max(0, Math.min(1, this.uniforms.opacity));
  }

  setUniform(name, value) {
    // Verificar que tenemos programa válido
    if (!this.program || !this.gl) {
      return; // Silencioso si no hay programa
    }

    try {
      // Asegurar que el programa está activo
      this.gl.useProgram(this.program);

      const location = this.gl.getUniformLocation(this.program, name);
      if (location === null) {
        // No logear nada - los uniforms faltantes son normales durante la inicialización
        return;
      }

      // Enviar el uniform
      if (Array.isArray(value)) {
        this.gl.uniform2f(location, value[0], value[1]);
      } else {
        this.gl.uniform1f(location, value);
      }
    } catch (error) {
      // Solo logear errores críticos de WebGL, no uniforms faltantes
      if (error.message && !error.message.includes('uniform')) {
        console.error(`❌ Error WebGL setting uniform '${name}':`, error);
      }
    }
  }

  getAudioLevel() {
    // Si no hay audio disponible, generar nivel base con variación matemática
    if (!this.audioData || !this.hasAudioContext) {
      // Generar audio level simulado basado en tiempo para mantener reactividad visual
      const time = Date.now() - this.startTime;
      return 0.3 + Math.sin(time * 0.001) * 0.2 + Math.sin(time * 0.003) * 0.1;
    }

    // Audio normal cuando está disponible
    let sum = 0;
    for (let i = 0; i < this.audioData.length; i++) {
      sum += this.audioData[i];
    }
    return sum / (this.audioData.length * 255);
  }

  // Actualizar intensidad de efecto
  updateEffectIntensity(effectName, intensity) {
    this.effects[effectName] = intensity;
  }

  // ===== SISTEMA MIDI =====

  // Mostrar modal MIDI
  showMIDIModal() {
    console.log('🎹 Intentando abrir modal MIDI...');

    let modal = document.getElementById('midiModal');
    if (!modal) {
      console.error('❌ Modal MIDI no encontrado, creando...');
      this.createMIDIModalDynamic();
      modal = document.getElementById('midiModal');
    }

    if (modal) {
      console.log('✅ Modal MIDI encontrado, abriendo...');
      modal.style.display = 'flex';
      this.generateMIDIMappingsList();
      this.updateMIDIModalStatus();
      console.log('🎹 Modal MIDI abierto exitosamente');

      // Asegurar que los event listeners están configurados
      this.setupMIDIModalEvents();
    } else {
      console.error('❌ No se pudo crear o encontrar el modal MIDI');
    }
  }

  // Configurar eventos del modal MIDI (sin duplicación)
  setupMIDIModalEvents() {
    // Remover listeners existentes primero
    const midiCloseBtn = document.getElementById('midiCloseBtn');
    if (midiCloseBtn && !midiCloseBtn.hasAttribute('data-midi-events-setup')) {
      midiCloseBtn.addEventListener('click', () => {
        console.log('❌ Cerrando modal MIDI');
        this.hideMIDIModal();
      });
      midiCloseBtn.setAttribute('data-midi-events-setup', 'true');
    }

    const clearAllMappingsBtn = document.getElementById('clearAllMappingsBtn');
    if (clearAllMappingsBtn && !clearAllMappingsBtn.hasAttribute('data-midi-events-setup')) {
      clearAllMappingsBtn.addEventListener('click', () => {
        console.log('🗑️ Limpiando mappings MIDI');
        this.clearAllMIDIMappings();
      });
      clearAllMappingsBtn.setAttribute('data-midi-events-setup', 'true');
    }
  }

  // Crear modal MIDI dinámicamente si no existe
  createMIDIModalDynamic() {
    console.log('🔧 Creando modal MIDI dinámicamente...');

    const modalHTML = `
            <div class="midi-modal" id="midiModal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000; justify-content: center; align-items: center;">
                <div class="midi-modal-content" style="background: #000; border: 2px solid #fff; border-radius: 12px; padding: 0; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; color: #fff;">
                    <div class="midi-modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <h3 id="midiModalTitle" style="color: #fff; font-size: 24px; font-weight: 600; margin: 0;">Mapeo MIDI</h3>
                        <button class="midi-close-btn" id="midiCloseBtn" style="background: transparent; border: none; color: #fff; font-size: 32px; cursor: pointer; padding: 0; width: 40px; height: 40px;">×</button>
                    </div>
                    <div class="midi-modal-body" style="padding: 20px;">
                        <p id="midiInstructions" style="color: #fff; margin-bottom: 20px;">Selecciona un control y mueve un fader/knob MIDI para mapearlo</p>
                        <div class="midi-mappings" id="midiMappings" style="margin-bottom: 20px;"></div>
                        <div class="midi-status-modal">
                            <span id="midiLearningStatus" style="color: #00ff00;">Esperando conexión MIDI...</span>
                        </div>
                    </div>
                    <div class="midi-modal-footer" style="padding: 20px; border-top: 1px solid rgba(255,255,255,0.2); text-align: center;">
                        <button class="control-btn" id="clearAllMappingsBtn" style="background: #fff; color: #000; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">Limpiar Todo</button>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    console.log('🎹 Modal MIDI creado dinámicamente');
  }

  // Ocultar modal MIDI
  hideMIDIModal() {
    const modal = document.getElementById('midiModal');
    if (modal) {
      modal.style.display = 'none';
      this.isLearningMIDI = false;
      this.currentLearningControl = null;
    }
  }

  // Generar lista de controles para mapear
  generateMIDIMappingsList() {
    const container = document.getElementById('midiMappings');
    if (!container) return;

    // Definir todos los controles mapeables
    const controls = [
      { id: 'mod1', name: 'MOD. 1' },
      { id: 'mod2', name: 'MOD. 2' },
      { id: 'mod3', name: 'MOD. 3' },
      { id: 'mod4', name: 'MOD. 4' },
      { id: 'mod5', name: 'MOD. 5' },
      { id: 'mod6', name: 'MOD. 6' },
      { id: 'colorSlider', name: 'COLOR' },
      { id: 'saturationSlider', name: 'SATURACIÓN' },
      { id: 'fx1Slider', name: 'GLITCH' },
      { id: 'fx2Slider', name: 'ZOOM' },
      { id: 'fx3Slider', name: 'ESPEJO' },
      { id: 'fx4Slider', name: 'NEGATIVO' },
      { id: 'fx5Slider', name: 'VÓRTICE' },
      { id: 'fx6Slider', name: 'ONDAS' },
      { id: 'fx7Slider', name: 'PIXEL' },
      { id: 'fx8Slider', name: 'TELETRANSPORTE' },
      { id: 'randomStyleBtn', name: 'ESTILO ALEATORIO' },
      { id: 'randomModBtn', name: 'MODIFICACIÓN ALEATORIA' }
    ];

    container.innerHTML = '';

    controls.forEach(control => {
      const item = document.createElement('div');
      item.className = 'midi-mapping-item';
      if (this.isLearningMIDI && this.currentLearningControl === control.id) {
        item.classList.add('learning');
      }
      item.setAttribute('data-control', control.id);

      const mapping = this.midiMappings.get(control.id);
      const mappingText = mapping ?
        `CC ${mapping.cc} - Canal ${mapping.channel}` :
        'Sin mapear';

      const isLearning = this.isLearningMIDI && this.currentLearningControl === control.id;

      item.innerHTML = `
                <div class="midi-mapping-label">${control.name}</div>
                <div class="midi-mapping-value">${mappingText}</div>
                <button class="midi-learn-btn ${isLearning ? 'learning' : ''}" data-control="${control.id}">
                    ${isLearning ? 'Aprendiendo...' : 'Aprender'}
                </button>
            `;

      // Event listener para el botón de aprender
      const learnBtn = item.querySelector('.midi-learn-btn');
      learnBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isLearningMIDI && this.currentLearningControl === control.id) {
          // Cancelar aprendizaje
          this.cancelMIDILearning();
        } else {
          // Iniciar aprendizaje
          this.startLearningMIDI(control.id, control.name);
        }
      });

      container.appendChild(item);
    });
  }

  // Iniciar aprendizaje MIDI
  startLearningMIDI(controlId, controlName) {
    // Cancelar aprendizaje anterior si existe
    this.cancelMIDILearning();

    this.isLearningMIDI = true;
    this.currentLearningControl = controlId;

    // Regenerar lista para mostrar estado de aprendizaje
    this.generateMIDIMappingsList();

    const statusElement = document.getElementById('midiLearningStatus');
    if (statusElement) {
      statusElement.textContent = `Aprendiendo ${controlName}... Mueve un control MIDI`;
      statusElement.style.color = '#000000';
      statusElement.style.fontWeight = 'bold';
    }

    console.log(`🎯 Aprendiendo MIDI para: ${controlName} (${controlId})`);
  }

  // Cancelar aprendizaje MIDI
  cancelMIDILearning() {
    this.isLearningMIDI = false;
    this.currentLearningControl = null;
    this.generateMIDIMappingsList();
    this.updateMIDIModalStatus();
  }

  // Actualizar estado del modal MIDI
  updateMIDIModalStatus() {
    const statusElement = document.getElementById('midiLearningStatus');
    if (statusElement) {
      if (this.isLearningMIDI && this.currentLearningControl) {
        // No cambiar el mensaje si estamos aprendiendo
        return;
      }

      if (this.midiAccess && this.midiAccess.inputs.size > 0) {
        statusElement.textContent = 'MIDI conectado - Haz clic en "Aprender" para mapear controles';
        statusElement.style.color = '#000000';
        statusElement.style.fontWeight = 'normal';
      } else {
        statusElement.textContent = 'MIDI no detectado - Conecta un dispositivo MIDI';
        statusElement.style.color = '#666666';
        statusElement.style.fontWeight = 'normal';
      }
    }
  }

  // Limpiar todos los mapeos MIDI
  clearAllMIDIMappings() {
    this.midiMappings.clear();
    this.generateMIDIMappingsList();

    const statusElement = document.getElementById('midiLearningStatus');
    if (statusElement) {
      statusElement.textContent = 'Todos los mapeos eliminados';
      statusElement.style.color = '#00ff00';
    }

    console.log('🗑️ Todos los mapeos MIDI eliminados');
  }

  // ===== FUNCIONES DE ALEATORIZACIÓN =====

  randomizeShader() {
    // Alias para randomizeStyle
    this.randomizeStyle();
  }

  randomizeModulation() {
    // Alias para randomizeModifications  
    this.randomizeModifications();
  }



  // Función para manejar archivos de audio
  handleAudioFiles(files) {
    try {
      console.log('📁 handleAudioFiles ejecutándose con', files?.length || 0, 'archivos');
      
      if (!files || files.length === 0) {
        console.warn('⚠️ No se proporcionaron archivos en handleAudioFiles');
        this.showError('No se seleccionaron archivos de audio');
        return;
      }
      
      // Verificar que loadAudioFiles esté disponible
      if (typeof this.loadAudioFiles === 'function') {
        this.loadAudioFiles(files);
      } else {
        console.error('❌ loadAudioFiles no está definida');
        this.showError('Función loadAudioFiles no disponible');
      }
    } catch (error) {
      console.error('❌ Error en handleAudioFiles:', error);
      this.showError(`Error manejando archivos: ${error.message}`);
    }
  }

  // Alias para changeLanguage
  updateLanguage(lang) {
    this.changeLanguage(lang);
  }

  // Limpiar mapeo específico
  clearMIDIMapping(controlId) {
    this.midiMappings.delete(controlId);
    this.generateMIDIMappingsList();
    console.log(`🗑️ Mapeo MIDI eliminado para: ${controlId}`);
  }

  // Función de debug para fullscreen
  debugFullscreen() {
    console.log('🔍 === DEBUG FULLSCREEN ===');
    console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
    console.log('Canvas style:', {
      position: this.canvas.style.position,
      top: this.canvas.style.top,
      left: this.canvas.style.left,
      width: this.canvas.style.width,
      height: this.canvas.style.height,
      zIndex: this.canvas.style.zIndex
    });
    console.log('Window dimensions:', window.innerWidth, 'x', window.innerHeight);
    console.log('Screen dimensions:', window.screen.width, 'x', window.screen.height);
    console.log('Body classList:', document.body.classList.toString());

    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement ||
      document.mozFullScreenElement || document.msFullscreenElement;
    console.log('Fullscreen element:', isFullscreen);
    console.log('Fullscreen support:', {
      requestFullscreen: !!document.documentElement.requestFullscreen,
      webkitRequestFullscreen: !!document.documentElement.webkitRequestFullscreen,
      mozRequestFullScreen: !!document.documentElement.mozRequestFullScreen,
      msRequestFullscreen: !!document.documentElement.msRequestFullscreen
    });
    console.log('WebGL viewport:', this.gl.getParameter(this.gl.VIEWPORT));
    console.log('=========================');

    return {
      canvasDimensions: [this.canvas.width, this.canvas.height],
      windowDimensions: [window.innerWidth, window.innerHeight],
      isFullscreen: !!isFullscreen,
      bodyClasses: document.body.classList.toString(),
      webglViewport: this.gl.getParameter(this.gl.VIEWPORT)
    };
  }

  // ===== V4 MULTICAPA FUNCTIONS =====

  // Update opacity display values
  updateOpacityDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = `${value}%`;
    }
  }

  // Toggle camera
  async toggleCamera() {
    try {
      if (!this.isCameraActive) {
        // Start camera
        console.log('📹 Activando cámara...');

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        this.cameraStream = stream;

        // Create video element if it doesn't exist
        if (!this.cameraVideo) {
          this.cameraVideo = document.createElement('video');
          this.cameraVideo.style.display = 'none';
          document.body.appendChild(this.cameraVideo);
        }

        this.cameraVideo.srcObject = stream;
        this.cameraVideo.play();

        // Wait for video to be ready and start playing
        await new Promise((resolve, reject) => {
          this.cameraVideo.onloadedmetadata = () => {
            console.log('📹 Video metadata loaded:', {
              width: this.cameraVideo.videoWidth,
              height: this.cameraVideo.videoHeight
            });
            resolve();
          };

          this.cameraVideo.onerror = () => {
            reject(new Error('Error loading video metadata'));
          };

          // Timeout de seguridad
          setTimeout(() => {
            reject(new Error('Timeout waiting for video metadata'));
          }, 5000);
        });

        // Asegurar que el video esté reproduciéndose
        await this.cameraVideo.play();

        this.isCameraActive = true;

        // Automaticamente activar la capa de cámara
        this.layerOpacities.camera = 0.8;
        this.updateOpacitySlider('cameraOpacity', 80);
        this.updateOpacityDisplay('cameraOpacityValue', '80');

        // Inicializar textura de cámara
        this.initializeCameraTexture();

        // Update button text
        const cameraBtn = document.getElementById('cameraBtn');
        if (cameraBtn) {
          cameraBtn.textContent = 'DESACTIVAR CÁMARA (V)';
        }

        console.log('✅ Cámara activada exitosamente');

      } else {
        // Stop camera
        console.log('📹 Desactivando cámara...');

        if (this.cameraStream) {
          this.cameraStream.getTracks().forEach(track => track.stop());
          this.cameraStream = null;
        }

        if (this.cameraVideo) {
          this.cameraVideo.srcObject = null;
          this.cameraVideo.pause();
        }

        // Limpiar textura de cámara
        if (this.cameraTexture) {
          this.gl.deleteTexture(this.cameraTexture);
          this.cameraTexture = null;
          this.cameraTextureConfigured = false;
        }

        this.isCameraActive = false;

        // Desactivar la capa de cámara
        this.layerOpacities.camera = 0.0;
        this.updateOpacitySlider('cameraOpacity', 0);
        this.updateOpacityDisplay('cameraOpacityValue', '0');

        // Update button text
        const cameraBtn = document.getElementById('cameraBtn');
        if (cameraBtn) {
          cameraBtn.textContent = 'ACTIVAR CÁMARA (V)';
        }

        console.log('✅ Cámara desactivada');
      }
    } catch (error) {
      console.error('❌ Error con la cámara:', error);

      // Manejo específico de diferentes tipos de errores
      let errorMessage = 'Error al acceder a la cámara';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permiso de cámara denegado. Por favor, permite el acceso a la cámara.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No se encontró ninguna cámara en el dispositivo.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'La cámara está siendo usada por otra aplicación.';
      } else if (error.name === 'ConstraintNotSatisfiedError') {
        errorMessage = 'La cámara no soporta la configuración solicitada.';
      }

      this.showError(errorMessage);

      // Limpiar estado si hay error
      this.isCameraActive = false;
      const cameraBtn = document.getElementById('cameraBtn');
      if (cameraBtn) {
        cameraBtn.textContent = 'ACTIVAR CÁMARA (V)';
      }
    }
  }

  // Handle image file - VERSIÓN MEJORADA Y ROBUSTA
  handleImageFile(file) {
    try {
      console.log('🖼️ Iniciando procesamiento de archivo:', file?.name || 'archivo desconocido');

      if (!file) {
        throw new Error('No se proporcionó archivo');
      }

      // Verificar que sea un archivo de imagen válido
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
      const isValidType = validImageTypes.includes(file.type) || 
                         file.name.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);

      if (!isValidType) {
        throw new Error(`Tipo de archivo no soportado: ${file.type}. Usa JPG, PNG, GIF, WebP o BMP.`);
      }

      // Verificar tamaño del archivo (límite de 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        throw new Error(`Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(1)}MB. Máximo permitido: 50MB.`);
      }

      console.log('🖼️ Archivo válido:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(1)}KB`
      });

      // Detectar si es GIF
      const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          if (isGif) {
            console.log('🎞️ Detectado archivo GIF, configurando para animación...');
            this.handleGifFile(e.target.result);
          } else {
            console.log('🖼️ Detectado archivo de imagen estática...');
            this.handleStaticImage(e.target.result);
          }
        } catch (processError) {
          console.error('❌ Error procesando datos de imagen:', processError);
          this.showError(`Error procesando imagen: ${processError.message}`);
        }
      };

      reader.onerror = (e) => {
        console.error('❌ Error leyendo archivo:', e);
        this.showError('Error al leer el archivo de imagen');
      };

      // Iniciar lectura del archivo
      console.log('📖 Iniciando lectura del archivo...');
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('❌ Error al cargar imagen:', error);
      this.showError(`Error al cargar imagen: ${error.message}`);
    }
  }

  // Handle static image files (PNG, JPG, etc.)
  handleStaticImage(dataUrl) {
    // Create image element
    if (!this.imageElement) {
      this.imageElement = document.createElement('img');
      this.imageElement.style.display = 'none';
      this.imageElement.crossOrigin = 'anonymous';
      document.body.appendChild(this.imageElement);
    }

    this.imageElement.onload = () => {
      this.isGifAnimated = false;
      this.createImageTexture();
      this.isImageLoaded = true;

      // Automaticamente activar la capa de imagen al cargar
      this.layerOpacities.image = 0.8;
      this.updateOpacitySlider('imageOpacity', 80);
      this.updateOpacityDisplay('imageOpacityValue', '80');

      console.log('✅ Imagen estática cargada exitosamente:', {
        width: this.imageElement.width,
        height: this.imageElement.height
      });
    };

    this.imageElement.onerror = () => {
      console.error('❌ Error al cargar imagen');
      this.showError('Error al cargar la imagen');
    };

    this.imageElement.src = dataUrl;
  }

  // Handle animated GIF files
  handleGifFile(dataUrl) {
    // Create image element for GIF
    if (!this.imageElement) {
      this.imageElement = document.createElement('img');
      this.imageElement.style.display = 'none';
      this.imageElement.crossOrigin = 'anonymous';
      document.body.appendChild(this.imageElement);
    }

    this.imageElement.onload = () => {
      this.isGifAnimated = true;

      // Crear canvas auxiliar para renderizar frames del GIF
      this.setupGifCanvas();
      this.isImageLoaded = true;

      // Automaticamente activar la capa de imagen al cargar
      this.layerOpacities.image = 0.8;
      this.updateOpacitySlider('imageOpacity', 80);
      this.updateOpacityDisplay('imageOpacityValue', '80');

      console.log('✅ GIF animado cargado exitosamente:', {
        width: this.imageElement.width,
        height: this.imageElement.height,
        animated: true
      });
    };

    this.imageElement.onerror = () => {
      console.error('❌ Error al cargar GIF');
      this.showError('Error al cargar el GIF');
    };

    this.imageElement.src = dataUrl;
  }

  // Setup canvas for GIF animation rendering
  setupGifCanvas() {
    if (!this.gifCanvas) {
      this.gifCanvas = document.createElement('canvas');
      this.gifCanvas.style.display = 'none';
      document.body.appendChild(this.gifCanvas);
      this.gifContext = this.gifCanvas.getContext('2d');
    }

    // Configurar tamaño del canvas igual que la imagen
    this.gifCanvas.width = this.imageElement.width;
    this.gifCanvas.height = this.imageElement.height;

    console.log('✅ Canvas GIF configurado:', {
      width: this.gifCanvas.width,
      height: this.gifCanvas.height
    });
  }

  // Create WebGL texture from image (static or GIF)
  createImageTexture() {
    if (!this.imageElement || !this.gl) return;

    try {
      // Crear textura
      if (this.imageTexture) {
        this.gl.deleteTexture(this.imageTexture);
      }

      this.imageTexture = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.imageTexture);

      // Configurar parámetros de textura
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

      // Para GIFs animados, usar el canvas auxiliar; para imágenes estáticas, usar la imagen directamente
      const sourceElement = this.isGifAnimated ? this.gifCanvas : this.imageElement;

      // Cargar en la textura
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        sourceElement
      );

      console.log(`✅ Textura ${this.isGifAnimated ? 'GIF' : 'imagen'} creada exitosamente`);

    } catch (error) {
      console.error('❌ Error al crear textura de imagen:', error);
    }
  }

  // Update image texture for animated GIFs
  updateImageTexture() {
    if (!this.isGifAnimated || !this.gifCanvas || !this.gifContext || !this.imageElement) return;

    try {
      // Dibujar el frame actual del GIF en el canvas auxiliar
      this.gifContext.clearRect(0, 0, this.gifCanvas.width, this.gifCanvas.height);
      this.gifContext.drawImage(this.imageElement, 0, 0, this.gifCanvas.width, this.gifCanvas.height);

      // Actualizar la textura WebGL con el contenido del canvas
      if (this.imageTexture) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.imageTexture);
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.RGBA,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          this.gifCanvas
        );
      }

    } catch (error) {
      console.error('❌ Error al actualizar textura GIF:', error);
    }
  }

  // Create WebGL texture from camera video
  createCameraTexture() {
    if (!this.cameraVideo || !this.gl || !this.isCameraActive) return false;

    // Verificar que el video tiene datos disponibles
    if (this.cameraVideo.readyState < this.cameraVideo.HAVE_CURRENT_DATA) {
      return false;
    }

    try {
      // Crear textura si no existe
      if (!this.cameraTexture) {
        this.cameraTexture = this.gl.createTexture();
        console.log('📹 Textura de cámara creada');
      }

      this.gl.bindTexture(this.gl.TEXTURE_2D, this.cameraTexture);

      // Configurar parámetros de textura solo la primera vez
      if (!this.cameraTextureConfigured) {
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.cameraTextureConfigured = true;
        console.log('📹 Parámetros de textura configurados');
      }

      // Actualizar la textura con el frame actual del video
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        this.cameraVideo
      );

      return true;

    } catch (error) {
      console.error('❌ Error al crear/actualizar textura de cámara:', error);
      return false;
    }
  }

  // Initialize camera texture setup
  initializeCameraTexture() {
    if (!this.isCameraActive || !this.cameraVideo) return;

    // Crear la textura inicial cuando el video esté listo
    if (this.cameraVideo.readyState >= this.cameraVideo.HAVE_CURRENT_DATA) {
      this.createCameraTexture();
    } else {
      // Esperar a que el video esté listo
      this.cameraVideo.addEventListener('canplay', () => {
        this.createCameraTexture();
      }, { once: true });
    }
  }

  // Update slider value programmatically 
  updateOpacitySlider(sliderId, value) {
    const slider = document.getElementById(sliderId);
    if (slider) {
      slider.value = value;
    }
  }

  // Debug function for camera status
  debugCameraStatus() {
    console.log('🔍 === DEBUG CÁMARA V4 ===');
    console.log('Estado de cámara:', {
      isCameraActive: this.isCameraActive,
      hasStream: !!this.cameraStream,
      hasVideo: !!this.cameraVideo,
      hasTexture: !!this.cameraTexture,
      textureConfigured: this.cameraTextureConfigured,
      opacity: this.layerOpacities.camera
    });

    if (this.cameraVideo) {
      console.log('Estado del video:', {
        readyState: this.cameraVideo.readyState,
        videoWidth: this.cameraVideo.videoWidth,
        videoHeight: this.cameraVideo.videoHeight,
        paused: this.cameraVideo.paused,
        ended: this.cameraVideo.ended,
        currentTime: this.cameraVideo.currentTime
      });
    }

    if (this.cameraStream) {
      console.log('Estado del stream:', {
        active: this.cameraStream.active,
        tracks: this.cameraStream.getTracks().map(track => ({
          kind: track.kind,
          enabled: track.enabled,
          readyState: track.readyState
        }))
      });
    }

    console.log('=========================');
  }











  // ===== V4 EFFECT TARGETING FUNCTIONS =====

  // Setup event listeners for all effect targeting checkboxes
  setupEffectTargetingListeners() {
    const effects = ['fx1', 'fx2', 'fx3', 'fx4', 'fx5', 'fx6', 'fx7', 'fx8'];
    const layers = ['shader', 'camera', 'image'];

    effects.forEach(fx => {
      layers.forEach(layer => {
        const checkboxId = `${fx}_${layer}`;
        const checkbox = document.getElementById(checkboxId);

        if (checkbox) {
          checkbox.addEventListener('change', (e) => {
            this.updateEffectTargeting(fx, layer, e.target.checked);
          });

          // Sincronizar estado inicial
          checkbox.checked = this.effectTargets[fx][layer];
        }
      });
    });

    console.log('✅ Effect targeting listeners configurados');
  }

  // Update effect targeting for specific effect and layer
  updateEffectTargeting(fx, layer, enabled) {
    this.effectTargets[fx][layer] = enabled;

    const enabledLayers = Object.entries(this.effectTargets[fx])
      .filter(([key, value]) => value)
      .map(([key, value]) => key.toUpperCase());

    console.log(`🎭 ${fx.toUpperCase()} ahora aplica a: ${enabledLayers.length > 0 ? enabledLayers.join(', ') : 'NINGUNA CAPA'}`);
  }

  // Set all effects to specific target(s)
  setAllEffectsToTarget(target) {
    const effects = ['fx1', 'fx2', 'fx3', 'fx4', 'fx5', 'fx6', 'fx7', 'fx8'];

    effects.forEach(fx => {
      if (target === 'shader') {
        this.effectTargets[fx] = { shader: true, camera: false, image: false };
      } else if (target === 'all') {
        this.effectTargets[fx] = { shader: true, camera: true, image: true };
      }
    });

    // Actualizar UI
    this.syncEffectTargetingUI();

    console.log(`🎭 Todos los efectos configurados para: ${target === 'all' ? 'TODAS LAS CAPAS' : target.toUpperCase()}`);
  }

  // Reset effect targeting to default (only shader)
  resetEffectTargeting() {
    const effects = ['fx1', 'fx2', 'fx3', 'fx4', 'fx5', 'fx6', 'fx7', 'fx8'];

    effects.forEach(fx => {
      this.effectTargets[fx] = { shader: true, camera: false, image: false };
    });

    // Actualizar UI
    this.syncEffectTargetingUI();

    console.log('🎭 Effect targeting reseteado a configuración default (solo SHADER)');
  }

  // Sync effect targeting UI with internal state
  syncEffectTargetingUI() {
    const effects = ['fx1', 'fx2', 'fx3', 'fx4', 'fx5', 'fx6', 'fx7', 'fx8'];
    const layers = ['shader', 'camera', 'image'];

    effects.forEach(fx => {
      layers.forEach(layer => {
        const checkboxId = `${fx}_${layer}`;
        const checkbox = document.getElementById(checkboxId);

        if (checkbox) {
          checkbox.checked = this.effectTargets[fx][layer];
        }
      });
    });
  }

  // Check if a specific effect should be applied to a specific layer
  shouldApplyEffectToLayer(fx, layer) {
    return this.effectTargets[fx] && this.effectTargets[fx][layer] === true;
  }

  // Get effects that should be applied to a specific layer
  getEffectsForLayer(layer) {
    const effects = ['fx1', 'fx2', 'fx3', 'fx4', 'fx5', 'fx6', 'fx7', 'fx8'];
    return effects.filter(fx => this.shouldApplyEffectToLayer(fx, layer));
  }

  // Set texture effect uniforms based on targeting configuration
  setTextureEffectUniforms(layer) {
    if (!this.textureProgram) return;

    const time = Date.now() - this.startTime;
    const audioLevel = this.getAudioLevel();

    // Set time and audio uniforms
    const timeLocation = this.gl.getUniformLocation(this.textureProgram, 'u_time');
    const audioLevelLocation = this.gl.getUniformLocation(this.textureProgram, 'u_audioLevel');
    const resolutionLocation = this.gl.getUniformLocation(this.textureProgram, 'u_resolution');
    const globalColorLocation = this.gl.getUniformLocation(this.textureProgram, 'u_globalColorHue');

    if (timeLocation !== null) {
      this.gl.uniform1f(timeLocation, time);
    }
    if (audioLevelLocation !== null) {
      this.gl.uniform1f(audioLevelLocation, audioLevel);
    }
    if (resolutionLocation !== null) {
      this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
    }
    if (globalColorLocation !== null) {
      this.gl.uniform1f(globalColorLocation, this.globalColorHue);
    }

    // Set effect uniforms based on targeting
    const effects = ['fx1', 'fx2', 'fx3', 'fx4', 'fx5', 'fx6', 'fx7', 'fx8'];

    effects.forEach(fx => {
      const uniformLocation = this.gl.getUniformLocation(this.textureProgram, `u_${fx}`);

      if (uniformLocation !== null) {
        // Check if this effect should be applied to this layer
        const shouldApply = this.shouldApplyEffectToLayer(fx, layer);
        const effectValue = shouldApply ? (this.effects[fx] || 0) : 0;

        this.gl.uniform1f(uniformLocation, effectValue);
      }
    });

    // Debug log ocasional para ver qué efectos se están aplicando
    if (Math.random() < 0.01) {
      const activeEffects = effects.filter(fx =>
        this.shouldApplyEffectToLayer(fx, layer) && this.effects[fx] > 0
      );

      if (activeEffects.length > 0) {
        console.log(`🎭 Efectos aplicados a ${layer}:`, activeEffects.map(fx =>
          `${fx}=${this.effects[fx]}%`
        ).join(', '));
      }
    }
  }
}

// Inicializar la aplicación
let ghostVisualizer;
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🚀 Iniciando aplicación...');
    ghostVisualizer = new GhostVisualizer();
    await ghostVisualizer.init();
    
    // Validar que todas las funciones críticas estén disponibles
    setTimeout(() => {
      if (ghostVisualizer && typeof ghostVisualizer.validateFunctions === 'function') {
        ghostVisualizer.validateFunctions();
      } else {
        console.error('❌ validateFunctions no está disponible');
      }
    }, 1000);
    
    console.log('✅ Aplicación inicializada exitosamente');
  } catch (error) {
    console.error('❌ Error fatal en inicialización:', error);
  }
});

// Función global para verificar versión desde consola
window.checkVersion = () => {
  console.log('=================================');
  console.log('🎭 GENERADOR DE FANTASMAS V4');
  console.log('🚀 Versión: 4.0 - COMPLETA');
  console.log('=================================');
  console.log('✅ Funcionalidad 1: Controles de opacidad por capa');
  console.log('✅ Funcionalidad 2: Carga y animación de imágenes/GIFs');
  console.log('✅ Funcionalidad 3: Renderizado de cámara en tiempo real');
  console.log('✅ Funcionalidad 4: Targeting de efectos por capa');
  console.log('=================================');
  console.log('🎯 Todas las funcionalidades implementadas y funcionales');
  console.log('=================================');

  if (ghostVisualizer) {
    return {
      version: '4.0 COMPLETA',
      features: [
        'Controles de opacidad por capa',
        'Carga y animación de imágenes/GIFs',
        'Renderizado de cámara en tiempo real',
        'Targeting de efectos por capa'
      ],
      status: 'Todas las funcionalidades implementadas'
    };
  } else {
    console.log('❌ GhostVisualizer no está inicializado aún');
    return 'Error: Aplicación no inicializada';
  }
};

// Función global para debug de fullscreen
window.debugFullscreen = () => {
  if (ghostVisualizer) {
    return ghostVisualizer.debugFullscreen();
  } else {
    console.log('❌ GhostVisualizer no está inicializado aún');
    return 'Error: Aplicación no inicializada';
  }
};

// Función global para forzar re-render
window.forceRender = () => {
  if (ghostVisualizer) {
    ghostVisualizer.render();
    console.log('🔄 Render forzado ejecutado');
    return 'Render ejecutado';
  } else {
    console.log('❌ GhostVisualizer no está inicializado aún');
    return 'Error: Aplicación no inicializada';
  }
};

// Función global para debug de cámara V4
window.debugCamera = () => {
  if (ghostVisualizer) {
    return ghostVisualizer.debugCameraStatus();
  } else {
    console.log('❌ GhostVisualizer no está inicializado aún');
    return 'Error: Aplicación no inicializada';
  }
};

// Función global para debug de targeting de efectos V4
window.debugEffectTargeting = () => {
  if (ghostVisualizer) {
    console.log('🎭 === DEBUG EFFECT TARGETING V4 ===');
    console.log('Configuración actual de targeting:');

    const effects = ['fx1', 'fx2', 'fx3', 'fx4', 'fx5', 'fx6', 'fx7', 'fx8'];
    const layers = ['shader', 'camera', 'image'];

    effects.forEach(fx => {
      const config = ghostVisualizer.effectTargets[fx];
      const enabledLayers = layers.filter(layer => config[layer]);
      const effectValue = ghostVisualizer.effects[fx];

      console.log(`${fx.toUpperCase()}: ${effectValue}% → [${enabledLayers.join(', ') || 'NINGUNA'}]`);
    });

    console.log('=====================================');

    return {
      targeting: ghostVisualizer.effectTargets,
      effects: ghostVisualizer.effects,
      summary: effects.map(fx => ({
        effect: fx,
        value: ghostVisualizer.effects[fx],
        targets: layers.filter(layer => ghostVisualizer.effectTargets[fx][layer])
      }))
    };
  } else {
    console.log('❌ GhostVisualizer no está inicializado aún');
    return 'Error: Aplicación no inicializada';
  }
};

// ===== FUNCIONES FALTANTES - CORRECCIÓN DE BUGS =====

// Agregar las funciones que faltaban al prototipo de GhostVisualizer
Object.assign(GhostVisualizer.prototype, {
  
  // ===== FUNCIONES DE AUDIO =====
  
  // Función para cargar archivos de audio (CORRECCIÓN ROBUSTA: Sin doble clic)
  loadAudioFiles(files) {
    console.log('🎵 Iniciando carga de archivos de audio:', files?.length || 0);
    
    if (!files || files.length === 0) {
      console.warn('⚠️ No se proporcionaron archivos');
      this.showError('No se seleccionaron archivos de audio');
      return;
    }
    
    try {
      // Limpiar lista de canciones anterior
      this.songQueue = [];
      this.currentSongIndex = 0;
      
      // Detener audio anterior si existe
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.src = '';
      }
      
      let validFilesCount = 0;
      
      // Procesar todos los archivos de forma síncrona
      Array.from(files).forEach((file, index) => {
        console.log(`📁 Analizando archivo ${index + 1}:`, file.name, 'Tipo:', file.type);
        
        if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
          console.log(`🎵 ✅ Archivo válido ${index + 1}: ${file.name}`);
          
          try {
            const audioURL = URL.createObjectURL(file);
            this.songQueue.push({
              name: file.name,
              url: audioURL,
              file: file,
              type: file.type,
              size: file.size
            });
            validFilesCount++;
            
            console.log(`🎵 Archivo agregado a la cola: ${file.name}`);
            
          } catch (urlError) {
            console.error(`❌ Error creando URL para ${file.name}:`, urlError);
          }
        } else {
          console.warn(`⚠️ Archivo ignorado (no es audio): ${file.name} (tipo: ${file.type})`);
        }
      });
      
      if (validFilesCount === 0) {
        this.showError('No se encontraron archivos de audio válidos');
        return;
      }
      
      // Cargar el primer archivo automáticamente
      console.log(`🎵 Cargando primer archivo de ${validFilesCount} archivos válidos...`);
      this.loadSong(0);
      this.updateSongIndicator();
      
      console.log(`✅ ${validFilesCount} archivos de audio cargados exitosamente de ${files.length} archivos seleccionados`);
      
      // Mostrar mensaje de éxito
      setTimeout(() => {
        console.log(`🎶 Audio listo: ${this.songQueue[0].name}`);
      }, 500);
      
    } catch (error) {
      console.error('❌ Error general cargando archivos de audio:', error);
      this.showError(`Error al cargar archivos: ${error.message}`);
    }
  },
  
  // Cargar una canción específica
  loadSong(index) {
    if (index < 0 || index >= this.songQueue.length) {
      console.warn('⚠️ Índice de canción inválido:', index);
      return;
    }
    
    const song = this.songQueue[index];
    console.log('🎵 Cargando canción:', song.name);
    
    try {
      // Limpiar audio anterior de forma más completa
      if (this.audioElement) {
        console.log('🧹 Limpiando audio anterior...');
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.src = '';
        this.audioElement.removeAttribute('src');
        this.audioElement.load(); // Forzar descarga de memoria
        this.audioElement = null;
      }
      
      // Limpiar conexión de audio anterior
      if (this.audioSource) {
        console.log('🧹 Desconectando fuente de audio anterior...');
        try {
          this.audioSource.disconnect();
        } catch (e) {
          console.warn('⚠️ Error al desconectar fuente anterior:', e);
        }
        this.audioSource = null;
      }
      
      // Crear nuevo elemento de audio
      console.log('🆕 Creando nuevo elemento de audio...');
      this.audioElement = new Audio();
      
      // Configuración para evitar problemas de CORS
      this.audioElement.crossOrigin = 'anonymous';
      this.audioElement.preload = 'auto';
      
      // Event listeners mejorados
      this.audioElement.addEventListener('loadeddata', () => {
        console.log('✅ Audio cargado exitosamente:', song.name);
        console.log('📊 Duración:', this.audioElement.duration, 'segundos');
        this.connectAudioToAnalyser();
      });
      
      this.audioElement.addEventListener('canplaythrough', () => {
        console.log('▶️ Audio listo para reproducir:', song.name);
      });
      
      this.audioElement.addEventListener('error', (e) => {
        console.error('❌ Error detallado al cargar audio:', {
          error: e,
          target: e.target,
          networkState: this.audioElement?.networkState,
          readyState: this.audioElement?.readyState
        });
        
        let errorMsg = `No se pudo cargar: ${song.name}`;
        if (this.audioElement.error) {
          switch (this.audioElement.error.code) {
            case 1:
              errorMsg += ' - Carga abortada por el usuario';
              break;
            case 2:
              errorMsg += ' - Error de red';
              break;
            case 3:
              errorMsg += ' - Error de decodificación';
              break;
            case 4:
              errorMsg += ' - Formato no soportado';
              break;
            default:
              errorMsg += ' - Error desconocido';
          }
        }
        
        this.showError(errorMsg);
      });
      
      this.audioElement.addEventListener('ended', () => {
        console.log('🎵 Canción terminada, pasando a la siguiente...');
        this.nextSong();
      });
      
      // Asignar source y cargar
      console.log('📂 Asignando source:', song.url);
      this.audioElement.src = song.url;
      this.audioElement.load();
      this.currentSongIndex = index;
      
      console.log('🎵 Proceso de carga iniciado para:', song.name);
      
    } catch (error) {
      console.error('❌ Error crítico al cargar canción:', error);
      this.showError(`Error crítico cargando archivo: ${error.message}`);
    }
  },
  
  // Conectar audio al analizador
  connectAudioToAnalyser() {
    console.log('🔗 Iniciando conexión de audio al analizador...');
    
    if (!this.audioContext || !this.audioElement) {
      console.warn('⚠️ No hay contexto de audio o elemento de audio disponible');
      return;
    }
    
    try {
      // Asegurar que el contexto esté activo
      if (this.audioContext.state === 'suspended') {
        console.log('▶️ Reanudando contexto de audio...');
        this.audioContext.resume();
      }
      
      // Verificar que el analizador esté disponible
      if (!this.analyser) {
        console.warn('⚠️ No hay analizador disponible, creando uno nuevo...');
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.audioData = new Uint8Array(this.analyser.frequencyBinCount);
      }
      
      // Desconectar fuente anterior si existe
      if (this.audioSource) {
        console.log('🔌 Desconectando fuente anterior...');
        try {
          this.audioSource.disconnect();
        } catch (e) {
          console.warn('⚠️ Error al desconectar fuente anterior:', e);
        }
        this.audioSource = null;
      }
      
      // Verificar que el elemento de audio esté listo
      if (this.audioElement.readyState < 2) {
        console.log('⏳ Esperando que el audio esté listo...');
        this.audioElement.addEventListener('loadeddata', () => {
          console.log('🔄 Audio listo, reintentando conexión...');
          this.connectAudioToAnalyser();
        }, { once: true });
        return;
      }
      
      // Crear nueva fuente y conectar al analizador
      console.log('🆕 Creando MediaElementSource...');
      this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
      
      console.log('🔗 Conectando al analizador...');
      this.audioSource.connect(this.analyser);
      
      console.log('🔗 Conectando a destino de audio...');
      this.audioSource.connect(this.audioContext.destination);
      
      console.log('✅ Audio conectado exitosamente al analizador');
      console.log('📊 Analizador configurado - FFT Size:', this.analyser.fftSize);
      
      // NUEVA FUNCIONALIDAD: Reproducir automáticamente cuando se carga
      if (this.audioElement && this.audioElement.readyState >= 3) {
        console.log('▶️ Iniciando reproducción automática...');
        setTimeout(() => {
          this.audioElement.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
            console.log('✅ Reproducción automática iniciada');
          }).catch(playError => {
            console.warn('⚠️ No se pudo iniciar reproducción automática (requiere interacción del usuario):', playError);
            console.log('💡 Haz clic en PLAY para iniciar la reproducción');
          });
        }, 500);
      }
      
    } catch (error) {
      console.error('❌ Error detallado al conectar audio:', error);
      
      // Análisis específico del error
      if (error.name === 'InvalidStateError') {
        console.error('💡 Posible causa: El elemento de audio ya tiene una fuente MediaElement');
        this.showError('Error de estado de audio. Intenta cargar el archivo nuevamente.');
      } else if (error.name === 'NotSupportedError') {
        console.error('💡 Posible causa: Formato de audio no soportado');
        this.showError('Formato de audio no soportado. Prueba con MP3, WAV o OGG.');
      } else {
        this.showError(`Error conectando audio: ${error.message}`);
      }
    }
  },
  
  // ===== FUNCIONES DE MICRÓFONO Y AUDIO DEL SISTEMA =====
  
  // CORRECCIÓN: Implementar setupMicrophone para audio del sistema CON VERIFICACIONES
  async setupMicrophone() {
    try {
      console.log('🎤 Intentando acceder al audio del sistema...');
      
      // VERIFICACIÓN 1: Contexto seguro (HTTPS)
      if (!window.isSecureContext) {
        console.warn('⚠️ No hay contexto HTTPS - Esta función requiere HTTPS');
        this.showError('Audio del sistema requiere HTTPS. Usar en servidor seguro (GitHub Pages, Netlify, etc.) o usar el botón "USAR MICRÓFONO" como alternativa.');
        return;
      }
      
      // VERIFICACIÓN 2: Soporte de getDisplayMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        console.warn('⚠️ getDisplayMedia no soportado');
        this.showError('Tu navegador no soporta captura de audio del sistema. Usa Chrome, Edge o Firefox actualizados, o usa el botón "USAR MICRÓFONO".');
        return;
      }
      
      // VERIFICACIÓN 3: Asegurar que el contexto de audio esté activo
      console.log('🔊 Verificando contexto de audio...');
      if (!this.audioContext) {
        console.log('🔊 Inicializando contexto de audio...');
        await this.initializeAudio();
      }
      
      if (!this.audioContext) {
        throw new Error('No se pudo inicializar el contexto de audio');
      }
      
      if (this.audioContext.state === 'suspended') {
        console.log('🔊 Resumiendo contexto de audio...');
        await this.audioContext.resume();
      }
      
      // VERIFICACIÓN 3: Informar al usuario sobre los requisitos
      console.log('ℹ️ Asegúrate de:', 
        '\n1. Seleccionar una pestaña que esté reproduciendo audio',
        '\n2. Marcar la casilla "Compartir audio" en el diálogo',
        '\n3. Tener audio reproduciéndose en la pestaña seleccionada'
      );
      
      // Intentar obtener audio del sistema usando getDisplayMedia
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: false,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000
        }
      });
      
      console.log('✅ Audio del sistema obtenido exitosamente');
      
      // Verificar que el stream tiene pistas de audio
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('NO_AUDIO_TRACK: No se detectó audio en la pestaña seleccionada. Asegúrate de marcar "Compartir audio" y que haya audio reproduciéndose.');
      }
      
      console.log('🔊 Pistas de audio encontradas:', audioTracks.length);
      
      // Desconectar micrófono anterior si existe
      if (this.microphoneStream) {
        this.microphoneStream.getTracks().forEach(track => track.stop());
      }
      
      // Desconectar fuente de audio anterior
      if (this.audioSource) {
        this.audioSource.disconnect();
      }
      
      this.microphoneStream = stream;
      
      // Crear fuente de audio desde el stream y conectar al analizador
      this.audioSource = this.audioContext.createMediaStreamSource(stream);
      this.audioSource.connect(this.analyser);
      

      
      console.log('✅ Audio del sistema conectado al visualizador');
      
    } catch (error) {
      console.error('❌ Error al acceder al audio del sistema:', error);
      
      let errorMessage = 'Error al acceder al audio del sistema';
      
      if (error.message.includes('SECURITY_ERROR')) {
        errorMessage = 'Esta función requiere HTTPS. Sube la app a un servidor seguro (GitHub Pages, Netlify, etc.) para usar audio del sistema.';
      } else if (error.message.includes('FEATURE_NOT_SUPPORTED')) {
        errorMessage = 'Tu navegador no soporta captura de audio del sistema. Usa Chrome, Edge o Firefox actualizados.';
      } else if (error.message.includes('NO_AUDIO_TRACK')) {
        errorMessage = 'No se detectó audio. Asegúrate de:\n1. Marcar "Compartir audio" en el diálogo\n2. Seleccionar una pestaña con audio reproduciéndose\n3. Que el audio esté activo (no en silencio)';
      } else if (error.name === 'NotAllowedError') {
        errorMessage = 'Permiso denegado. Permite compartir la pantalla y marca la opción "Compartir audio".';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No se encontró audio en la pestaña seleccionada. Reproduce algo de audio primero.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Operación cancelada por el usuario.';
      }
      
      this.showError(errorMessage);
      
      // Sugerir alternativa
      setTimeout(() => {
        console.log('💡 ALTERNATIVA: Usa el botón "USAR MICRÓFONO" que funciona en cualquier contexto.');
      }, 2000);
    }
  },
  
  // NUEVA FUNCIÓN: Acceso al micrófono real
  async setupRealMicrophone() {
    try {
      console.log('🎙️ Accediendo al micrófono...');
      
      // Asegurar que el contexto de audio esté activo
      if (!this.audioContext) {
        await this.initializeAudio();
      }
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Obtener acceso al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000
        }
      });
      
      console.log('✅ Micrófono obtenido exitosamente');
      
      // Desconectar fuente anterior si existe
      if (this.audioSource) {
        this.audioSource.disconnect();
      }
      
      // Detener stream anterior del micrófono si existe
      if (this.microphoneStream && this.microphoneStream !== stream) {
        this.microphoneStream.getTracks().forEach(track => track.stop());
      }
      
      this.microphoneStream = stream;
      
      // Crear fuente de audio desde el micrófono y conectar al analizador
      this.audioSource = this.audioContext.createMediaStreamSource(stream);
      this.audioSource.connect(this.analyser);
      
      // Actualizar botón de micrófono
      const realMicBtn = document.getElementById('realMicrophoneBtn');
      if (realMicBtn) {
        realMicBtn.textContent = 'DETENER MICRÓFONO';
      }
      
      console.log('✅ Micrófono conectado al visualizador');
      
    } catch (error) {
      console.error('❌ Error al acceder al micrófono:', error);
      
      let errorMessage = 'Error al acceder al micrófono';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permiso de micrófono denegado. Permite el acceso al micrófono.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No se encontró ningún micrófono en el dispositivo.';
      }
      
      this.showError(errorMessage);
    }
  },
  
  // ===== FUNCIONES DE GRABACIÓN =====
  
  // CORRECCIÓN: Implementar toggleRecording optimizado
  async toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  },
  
  // Iniciar grabación optimizada
  async startRecording() {
    try {
      console.log('📹 Iniciando grabación...');
      
      // Configuración optimizada para equipos básicos pero con buena calidad
      const stream = this.canvas.captureStream(30); // 30 FPS para equipos básicos
      
      // Configuración optimizada del MediaRecorder
      const options = {
        mimeType: 'video/webm;codecs=vp8,opus', // VP8 es más compatible y eficiente
        videoBitsPerSecond: 2500000, // 2.5 Mbps - buena calidad sin sobrecargar
        audioBitsPerSecond: 128000   // 128 kbps de audio
      };
      
      // Verificar soporte y ajustar configuración si es necesario
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn('⚠️ VP8 no soportado, usando configuración por defecto');
        delete options.mimeType;
        options.videoBitsPerSecond = 2000000; // Reducir un poco más
      }
      
      this.mediaRecorder = new MediaRecorder(stream, options);
      this.recordedChunks = [];
      
      // Event listeners para grabación
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
          console.log(`📹 Chunk grabado: ${event.data.size} bytes`);
        }
      };
      
      this.mediaRecorder.onstop = () => {
        console.log('📹 Grabación detenida, procesando video...');
        this.processRecording();
      };
      
      this.mediaRecorder.onerror = (event) => {
        console.error('❌ Error en grabación:', event.error);
        this.showError('Error durante la grabación');
        this.resetRecordingState();
      };
      
      // Iniciar grabación
      this.mediaRecorder.start(1000); // Guardar datos cada segundo
      this.isRecording = true;
      
      // Actualizar botón
      const recordBtn = document.getElementById('recordBtn');
      if (recordBtn) {
        recordBtn.textContent = 'DETENER GRABACIÓN (G)';
        recordBtn.style.backgroundColor = '#ff4444';
      }
      
      console.log('✅ Grabación iniciada exitosamente');
      
    } catch (error) {
      console.error('❌ Error al iniciar grabación:', error);
      this.showError('Error al iniciar la grabación');
      this.resetRecordingState();
    }
  },
  
  // Detener grabación
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      console.log('📹 Deteniendo grabación...');
      this.mediaRecorder.stop();
      this.isRecording = false;
      
      // Actualizar botón
      const recordBtn = document.getElementById('recordBtn');
      if (recordBtn) {
        recordBtn.textContent = 'GRABAR VISUAL (G)';
        recordBtn.style.backgroundColor = '#007bff';
      }
    }
  },
  
  // Procesar grabación y descargar
  processRecording() {
    if (this.recordedChunks.length === 0) {
      console.warn('⚠️ No hay datos de grabación para procesar');
      return;
    }
    
    try {
      console.log('📹 Procesando grabación...');
      
      // Crear blob del video
      const blob = new Blob(this.recordedChunks, {
        type: 'video/webm'
      });
      
      console.log(`📹 Video procesado: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
      
      // Crear URL y descargar
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fantasma_visual_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      console.log('✅ Grabación descargada exitosamente');
      
    } catch (error) {
      console.error('❌ Error al procesar grabación:', error);
      this.showError('Error al procesar la grabación');
    } finally {
      this.resetRecordingState();
    }
  },
  
  // Resetear estado de grabación
  resetRecordingState() {
    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    
    const recordBtn = document.getElementById('recordBtn');
    if (recordBtn) {
      recordBtn.textContent = 'GRABAR VISUAL (G)';
      recordBtn.style.backgroundColor = '#007bff';
    }
  },
  
  // ===== FUNCIONES DE REPRODUCCIÓN =====
  
  // Toggle play/pause
  togglePlay() {
    if (!this.audioElement) {
      console.warn('⚠️ No hay audio cargado');
      this.showError('Carga un archivo de audio primero');
      return;
    }
    
    try {
      if (this.isPlaying) {
        this.audioElement.pause();
        this.isPlaying = false;
        console.log('⏸️ Audio pausado');
      } else {
        // Reanudar contexto de audio si está suspendido
        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
        
        this.audioElement.play();
        this.isPlaying = true;
        console.log('▶️ Audio reproduciéndose');
      }
      
      this.updatePlayButton();
      
    } catch (error) {
      console.error('❌ Error al reproducir audio:', error);
      this.showError('Error al reproducir audio');
    }
  },
  
  // Actualizar botón de play
  updatePlayButton() {
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
      playBtn.textContent = this.isPlaying ? 'PAUSA (BARRA ESP.)' : 'PLAY (BARRA ESP.)';
    }
  },
  
  // ===== FUNCIONES DE NAVEGACIÓN DE CANCIONES =====
  
  // Siguiente canción
  nextSong() {
    if (this.songQueue.length === 0) return;
    
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songQueue.length;
    this.loadSong(this.currentSongIndex);
    this.updateSongIndicator();
  },
  
  // Canción anterior
  previousSong() {
    if (this.songQueue.length === 0) return;
    
    this.currentSongIndex = this.currentSongIndex === 0 ? 
      this.songQueue.length - 1 : 
      this.currentSongIndex - 1;
    this.loadSong(this.currentSongIndex);
    this.updateSongIndicator();
  },
  
  // Actualizar indicador de canción
  updateSongIndicator() {
    const indicator = document.getElementById('songIndicator');
    if (!indicator) return;
    
    if (this.songQueue.length > 0) {
      const current = this.songQueue[this.currentSongIndex];
      indicator.textContent = `🎵 ${current.name} (${this.currentSongIndex + 1}/${this.songQueue.length})`;
      indicator.style.display = 'block';
    } else {
      indicator.style.display = 'none';
    }
  },
  
  // ===== FUNCIONES DE SCREENSHOT =====
  
  // Tomar screenshot optimizado
  takeScreenshot() {
    try {
      console.log('📸 Tomando screenshot...');
      
      // Crear canvas temporal para captura de alta calidad
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      // Usar dimensiones del canvas original o más altas para mejor calidad
      tempCanvas.width = this.canvas.width;
      tempCanvas.height = this.canvas.height;
      
      // Dibujar el contenido actual del canvas WebGL
      tempCtx.drawImage(this.canvas, 0, 0);
      
      // Convertir a blob y descargar
      tempCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fantasma_screenshot_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        console.log('✅ Screenshot descargado exitosamente');
        
      }, 'image/png', 1.0); // Máxima calidad
      
    } catch (error) {
      console.error('❌ Error al tomar screenshot:', error);
      this.showError('Error al tomar screenshot');
    }
  },
  
  // ===== FUNCIONES DE TOGGLE PARA BOTONES =====
  
  // Toggle para micrófono real
  toggleRealMicrophone() {
    try {
      console.log('🎙️ toggleRealMicrophone ejecutándose...');
      
      if (this.microphoneStream && this.microphoneStream.getAudioTracks().some(track => track.kind === 'audio')) {
        console.log('🎙️ Deteniendo micrófono...');
        this.stopRealMicrophone();
      } else {
        console.log('🎙️ Iniciando micrófono...');
        
        // Verificar que setupRealMicrophone esté disponible
        if (typeof this.setupRealMicrophone === 'function') {
          this.setupRealMicrophone();
        } else {
          console.error('❌ setupRealMicrophone no está definida');
          this.showError('Función setupRealMicrophone no disponible');
        }
      }
    } catch (error) {
      console.error('❌ Error en toggleRealMicrophone:', error);
      this.showError(`Error en micrófono real: ${error.message}`);
    }
  },
  
  // Detener micrófono real
  stopRealMicrophone() {
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(track => track.stop());
      this.microphoneStream = null;
      console.log('🎙️ Micrófono desactivado');

      // Actualizar botón
      const realMicBtn = document.getElementById('realMicrophoneBtn');
      if (realMicBtn) {
        realMicBtn.textContent = 'USAR MICRÓFONO';
      }
    }
  },
  
  // ===== FUNCIONES AUXILIARES =====
  
  // Obtener nivel de audio actual
  getAudioLevel() {
    if (!this.analyser || !this.audioData) {
      return 0;
    }
    
    this.analyser.getByteFrequencyData(this.audioData);
    
    // Calcular nivel promedio
    let sum = 0;
    for (let i = 0; i < this.audioData.length; i++) {
      sum += this.audioData[i];
    }
    
    return (sum / this.audioData.length) / 255.0;
  },
  
  // ===== FUNCIONES ADICIONALES PARA COMPLETAR CORRECCIONES =====
  
  // Actualizar textos bilingües
  updateTexts() {
    const texts = this.texts[this.currentLanguage];
    
    // Actualizar botones
    const loadAudioBtn = document.getElementById('loadAudioBtn');
    if (loadAudioBtn) loadAudioBtn.textContent = texts.loadAudio;
    

    
    const realMicrophoneBtn = document.getElementById('realMicrophoneBtn');
    if (realMicrophoneBtn && !this.microphoneStream) {
      realMicrophoneBtn.textContent = 'USAR MICRÓFONO';
    }
    
    const playBtn = document.getElementById('playBtn');
    if (playBtn) playBtn.textContent = texts.play;
    
    const recordBtn = document.getElementById('recordBtn');
    if (recordBtn && !this.isRecording) {
      recordBtn.textContent = texts.record;
    }
    
    const screenshotBtn = document.getElementById('screenshotBtn');
    if (screenshotBtn) screenshotBtn.textContent = texts.screenshot;
    
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) fullscreenBtn.textContent = texts.fullscreen;
  },
  
  // Función para cambiar idioma
  changeLanguage(lang) {
    this.currentLanguage = lang;
    this.updateTexts();
    console.log(`🌍 Idioma cambiado a: ${lang}`);
  },
  
  // Aplicar efectos de forma robusta
  applyEffectsRobust(time, audioLevel) {
    // Asegurar que mod5 y mod6 tengan valores válidos
    if (typeof this.uniforms.mod5 === 'undefined') this.uniforms.mod5 = 0.5;
    if (typeof this.uniforms.mod6 === 'undefined') this.uniforms.mod6 = 0.5;
    
    // Implementación básica de efectos que funciona en cualquier ambiente
    if (this.effects.fx1 > 0) {
      // Aplicar efecto glitch basado en audio
      this.uniforms.mod1 += Math.sin(time * 0.01 + audioLevel * 10) * 0.1 * (this.effects.fx1 / 100);
    }
    
    if (this.effects.fx2 > 0) {
      // Aplicar efecto zoom basado en audio
      this.uniforms.mod2 += Math.cos(time * 0.008 + audioLevel * 8) * 0.15 * (this.effects.fx2 / 100);
    }
    
    if (this.effects.fx3 > 0) {
      // Aplicar efecto ondas
      this.uniforms.mod3 += Math.sin(time * 0.012 + audioLevel * 6) * 0.12 * (this.effects.fx3 / 100);
    }
    
    if (this.effects.fx4 > 0) {
      // Aplicar efecto espejo
      this.uniforms.mod4 += Math.cos(time * 0.015 + audioLevel * 5) * 0.18 * (this.effects.fx4 / 100);
    }
    
    if (this.effects.fx5 > 0) {
      // Aplicar efecto cromático con mod5 y mod6
      this.uniforms.colorHue += Math.sin(time * 0.005 + audioLevel * 12) * 0.2 * (this.effects.fx5 / 100);
      this.uniforms.mod5 += Math.sin(time * 0.003 + audioLevel * 8) * 0.1 * (this.effects.fx5 / 100);
      this.uniforms.mod6 += Math.cos(time * 0.004 + audioLevel * 7) * 0.1 * (this.effects.fx5 / 100);
    }
    
    if (this.effects.fx6 > 0) {
      // Aplicar efecto de saturación dinámica
      this.uniforms.saturation += Math.cos(time * 0.007 + audioLevel * 9) * 0.5 * (this.effects.fx6 / 100);
    }
    
    // Normalizar valores para evitar overflow
    this.uniforms.mod1 = Math.max(0, Math.min(1, this.uniforms.mod1));
    this.uniforms.mod2 = Math.max(0, Math.min(1, this.uniforms.mod2));
    this.uniforms.mod3 = Math.max(0, Math.min(1, this.uniforms.mod3));
    this.uniforms.mod4 = Math.max(0, Math.min(1, this.uniforms.mod4));
    this.uniforms.mod5 = Math.max(0, Math.min(1, this.uniforms.mod5));
    this.uniforms.mod6 = Math.max(0, Math.min(1, this.uniforms.mod6));
    this.uniforms.colorHue = ((this.uniforms.colorHue % 1) + 1) % 1; // Mantener entre 0-1
    this.uniforms.saturation = Math.max(0, Math.min(2, this.uniforms.saturation)); // 0-200%
  },
  
  // Funciones de aleatorización
  randomizeStyle() {
    const newShader = Math.floor(Math.random() * 40);
    this.currentShader = newShader;
    this.loadShader(newShader);
    
    const shaderSelect = document.getElementById('shaderSelect');
    if (shaderSelect) {
      shaderSelect.value = newShader;
    }
    
    console.log(`🎲 Shader aleatorio: ${newShader}`);
  },
  
  randomizeModifications() {
    // Aleatorizar moduladores
    for (let i = 1; i <= 6; i++) {
      this.uniforms[`mod${i}`] = Math.random();
      const slider = document.getElementById(`mod${i}`);
      if (slider) {
        slider.value = Math.round(this.uniforms[`mod${i}`] * 100);
      }
    }
    
    // Aleatorizar color y saturación
    this.uniforms.colorHue = Math.random();
    this.uniforms.saturation = 0.5 + Math.random() * 1.5; // 50-200%
    
    const colorSlider = document.getElementById('colorSlider');
    if (colorSlider) {
      colorSlider.value = Math.round(this.uniforms.colorHue * 360);
    }
    
    const saturationSlider = document.getElementById('saturationSlider');
    if (saturationSlider) {
      saturationSlider.value = Math.round(this.uniforms.saturation * 100);
    }
    
    console.log('🔀 Modulaciones aleatorizadas');
  },
  
  // ===== FUNCIÓN DE VALIDACIÓN =====
  validateFunctions() {
    console.log('🔍 Validando funciones críticas...');
    
    const criticalFunctions = [
      'loadAudioFiles',
      'setupMicrophone', 
      'setupRealMicrophone',
      'toggleRecording',
      'takeScreenshot',
      'handleImageFile'
    ];
    
    const missingFunctions = [];
    
    criticalFunctions.forEach(funcName => {
      if (typeof this[funcName] === 'function') {
        console.log(`✅ ${funcName}: OK`);
      } else {
        console.error(`❌ ${funcName}: FALTANTE`);
        missingFunctions.push(funcName);
      }
    });
    
    if (missingFunctions.length > 0) {
      console.error('❌ Funciones faltantes:', missingFunctions);
      this.showError(`Funciones críticas no disponibles: ${missingFunctions.join(', ')}`);
      return false;
    } else {
      console.log('✅ Todas las funciones críticas están disponibles');
      console.log('🎯 Sistema completamente operativo - Audio, micrófono, grabación y efectos listos');
      console.log('🔇 Warnings de uniforms WebGL silenciados para evitar spam en consola');
      console.log('🔧 Funciones de audio mejoradas con diagnóstico detallado');
      console.log('📋 Errores ahora se muestran claramente en pantalla y consola');
      return true;
    }
  },
  
  // ===== FUNCIÓN DE PRUEBA =====
  testFunction() {
    console.log('✅ Las funciones están correctamente cargadas');
    return true;
  }
});

