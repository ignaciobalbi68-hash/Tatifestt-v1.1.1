import React, { useState, useEffect, useRef } from 'react';

const theme = {
  bg: '#010a14',
  accent: '#00d2ff',
  glass: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(0, 210, 255, 0.3)',
};

export default function App() {
  const [view, setView] = useState('home');
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filter, setFilter] = useState('none');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('tPhotos');
    if (saved) setPhotos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('tPhotos', JSON.stringify(photos));
  }, [photos]);

  const handleCamera = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const newPhotos = [event.target.result, ...photos].slice(0, 24);
      setPhotos(newPhotos);
      setView('gallery');
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const clearStorage = () => {
    if(window.confirm("¿Borrar todas las fotos?")) {
      setPhotos([]);
      localStorage.removeItem('tPhotos');
      alert("Memoria limpia");
    }
  };

  // --- VISTAS ---

  const HomeView = () => (
    <div style={{ padding: '60px 25px' }}>
      <header style={{ marginBottom: '40px' }}>
        <p style={{ color: theme.accent, fontSize: '0.7rem', letterSpacing: '3px', fontWeight: 'bold', margin: 0 }}>TATTYFEST ULTIMATE</p>
        <h1 style={{ fontSize: '4.5rem', margin: 0, letterSpacing: '-3px', fontWeight: '900' }}>Nacho</h1>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <MenuCard title="Galería" sub="Tus fotos guardadas" icon="🖼️" onClick={() => setView('gallery')} />
        <MenuCard title="Estudio" sub="Edición y Filtros" icon="🪄" onClick={() => setView('gallery')} />
        <MenuCard title="Ajustes" sub="Configuración" icon="⚙️" onClick={() => setView('settings')} />
      </div>
    </div>
  );

  const SettingsView = () => (
    <div style={{ padding: '40px 25px' }}>
      <button onClick={() => setView('home')} style={backBtn}>← Volver</button>
      <h2 style={{ fontSize: '2.5rem', marginTop: '20px' }}>Ajustes</h2>
      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={settingItem}>
          <p style={{margin:0}}><b>Almacenamiento</b></p>
          <small style={{color:'#64748b'}}>{photos.length} fotos guardadas</small>
          <button onClick={clearStorage} style={dangerBtn}>BORRAR GALERÍA</button>
        </div>
        <div style={settingItem}>
          <p style={{margin:0}}><b>Versión</b></p>
          <small style={{color: theme.accent}}>Tattyfest App v2.0.4 - Pro</small>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', margin: 0 }}>
      <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleCamera} style={{ display: 'none' }} />

      {view === 'home' && <HomeView />}
      {view === 'settings' && <SettingsView />}
      {view === 'gallery' && (
        <div style={{ padding: '40px 20px 150px' }}>
          <button onClick={() => setView('home')} style={backBtn}>←</button>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '30px' }}>
            {photos.map((p, i) => (
              <img key={i} src={p} style={thumbStyle} onClick={() => { setSelectedPhoto(p); setView('studio'); setFilter('none'); }} />
            ))}
          </div>
        </div>
      )}

      {view === 'studio' && (
        <div style={{ padding: '40px 20px 100px', display:'flex', flexDirection:'column', minHeight:'100vh'}}>
          <button onClick={() => setView('gallery')} style={backBtn}>← Cancelar</button>
          <div style={previewFrame}>
            <img src={selectedPhoto} style={{ width: '100%', filter: filter }} />
          </div>
          <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '20px 0' }}>
            {filters.map(f => (
              <div key={f.name} onClick={() => setFilter(f.value)} style={{ ...filterCircle, border: filter === f.value ? `2px solid ${theme.accent}` : '2px solid #333' }}>
                <img src={selectedPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: f.value }} />
              </div>
            ))}
          </div>
          <button style={saveBtn} onClick={() => setView('gallery')}>ACEPTAR</button>
        </div>
      )}

      {/* ELEMENTOS GLOBALES (OCULTOS EN ESTUDIO Y AJUSTES) */}
      {(view !== 'studio' && view !== 'settings') && (
        <>
          <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
            <div onClick={() => fileInputRef.current.click()} style={shutterRing}>
              <div style={{ width: '50px', height: '50px', background: 'white', borderRadius: '50%' }} />
            </div>
          </div>
          <nav style={navBar}>
            <span onClick={() => setView('home')} style={{ fontSize: '1.6rem', opacity: view === 'home' ? 1 : 0.3 }}>🏠</span>
            <span onClick={() => setView('gallery')} style={{ fontSize: '1.6rem', opacity: view === 'gallery' ? 1 : 0.3 }}>🖼️</span>
            <div style={{ width: '60px' }} />
            <span onClick={() => setView('settings')} style={{ fontSize: '1.6rem', opacity: view === 'settings' ? 1 : 0.3 }}>⚙️</span>
            <span style={{ fontSize: '1.6rem', opacity: 0.3 }}>👤</span>
          </nav>
        </>
      )}
    </div>
  );
}

const MenuCard = ({ title, sub, icon, onClick }) => (
  <div onClick={onClick} style={{ background: theme.glass, padding: '20px', borderRadius: '22px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '15px' }}>
    <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '12px', borderRadius: '15px', fontSize: '1.5rem' }}>{icon}</div>
    <div><b>{title}</b><br/><small style={{ color: '#64748b' }}>{sub}</small></div>
  </div>
);

const filters = [
  { name: 'Normal', value: 'none' }, { name: 'B&N', value: 'grayscale(1)' }, { name: 'Sepia', value: 'sepia(1)' },
  { name: 'Frío', value: 'hue-rotate(180deg)' }, { name: 'Cálido', value: 'saturate(2) sepia(0.2)' }, { name: 'Brillo', value: 'brightness(1.4)' }
];

const shutterRing = { width: '65px', height: '65px', borderRadius: '50%', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' };
const navBar = { position: 'fixed', bottom: 0, left: 0, right: 0, height: '85px', background: '#020d1a', borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 900, borderRadius: '25px 25px 0 0' };
const backBtn = { background: 'none', border: `1px solid ${theme.accent}`, color: theme.accent, padding: '10px 18px', borderRadius: '12px', fontWeight: 'bold' };
const thumbStyle = { width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '12px' };
const filterCircle = { minWidth: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 };
const saveBtn = { width: '100%', padding: '18px', background: theme.accent, border: 'none', borderRadius: '18px', fontWeight: 'bold', color: '#000' };
const previewFrame = { marginTop: '20px', borderRadius: '25px', overflow: 'hidden', border: `2px solid ${theme.accent}` };
const settingItem = { background: theme.glass, padding: '20px', borderRadius: '20px', border: `1px solid ${theme.border}` };
const dangerBtn = { width: '100%', marginTop: '15px', padding: '12px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' };
