import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import './App.css';

function App() {
  const [photo, setPhoto] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const takePhoto = async () => {
    try {
      setIsCapturing(true);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, // Esto evita la pantalla negra
        source: CameraSource.Camera
      });
      setPhoto(image.webPath);
      setIsCapturing(false);
    } catch (e) {
      console.error("Error:", e);
      setIsCapturing(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header con Vidrio */}
      <motion.header 
        initial={{ y: -100 }} 
        animate={{ y: 0 }}
        className="glass-header"
      >
        <h1 className="logo-text">Tatifestt</h1>
      </motion.header>

      {/* Visor de Foto (Estilo Polaroid) */}
      <main className="viewer">
        <AnimatePresence>
          {photo ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="polaroid"
            >
              <img src={photo} alt="Capture" />
              <div className="polaroid-label">Momentos Tatifestt</div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.5 }}
              className="placeholder-text"
            >
              Tocá el obturador para capturar
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Controles DSLR de Cristal */}
      <motion.footer 
        initial={{ y: 100 }} 
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="glass-footer"
      >
        <div className="controls-row">
          <button className="icon-btn">FLASH</button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={takePhoto}
            className="main-shutter"
            disabled={isCapturing}
          >
            <div className="shutter-center"></div>
          </motion.button>

          <button className="icon-btn">ISO</button>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;
