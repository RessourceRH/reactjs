import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';
import 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js';
import './css/main.css';
import './css/site.css';
import './css/print.css';
import './assets/css/style.css';
import './assets/vendors/flag-icon-css/css/flag-icon.min.css';
import ProtectedRoutes from './components/ProtectedRoutes';

window.$ = $;

const Apropos = React.lazy(() => import('./pages/Apropos'));
const Av_promo = React.lazy(() => import('./pages/Avoir_Promo'));
const Av_conge = React.lazy(() => import('./pages/Avoir_conge'));
const Contrat = React.lazy(() => import('./pages/Type_contrat'));
const Login = React.lazy(() => import('./pages/login'));
const Conjoint = React.lazy(() => import('./pages/Conjoint'));
const Acceuil = React.lazy(() => import('./pages/Acceuil'));
const Sexe = React.lazy(() => import('./pages/Sexe'));
const Promotion = React.lazy(() => import('./pages/promotion'));
const Avoir = React.lazy(() => import('./pages/Avoir'));
const Conge = React.lazy(() => import('./pages/Conge'));
const Salaire = React.lazy(() => import('./pages/Salaire'));
const Direction = React.lazy(() => import('./pages/Direction'));
const Service = React.lazy(() => import('./pages/Service'));
const Fonction = React.lazy(() => import('./pages/Fonction'));
const Versement = React.lazy(() => import('./pages/Versement'));
const Modi_cv = React.lazy(() => import('./pages/Modification_cv'));
const Chargement = React.lazy(() => import('./pages/chargement'));
const Inscription = React.lazy(() => import('./pages/Register'));
const Crypto = React.lazy(() => import('./pages/Crypto'));
const Profil = React.lazy(() => import('./pages/Profil'));
const Parametres = React.lazy(() => import('./pages/Parametres'));
const Notification = React.lazy(() => import('./pages/Notification'));
const Indemnites = React.lazy(() => import('./pages/Indemnites'));

function App() {
  return (
    <Suspense fallback={<Chargement />}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoutes cookieNames={['usename', 'ID','image']} />}>
            <Route path="/contrat" element={<Contrat />} />
            <Route path="/acceuil" element={<Acceuil />} />
            <Route path="/conjoint" element={<Conjoint />} />
            <Route path="/sexe" element={<Sexe />} />
            <Route path="/conge" element={<Conge />} />
            <Route path="/avoir" element={<Avoir />} />
            <Route path="/fonction" element={<Fonction />} />
            <Route path="/promotion" element={<Promotion />} />
            <Route path="/direction" element={<Direction />} />
            <Route path="/salaire" element={<Salaire />} />
            <Route path="/service" element={<Service />} />
            <Route path="/versement" element={<Versement />} />
            <Route path="/modification/:id" element={<Modi_cv />} />
            <Route path="/apropos/:id" element={<Apropos />} />
            <Route path="/av_conge" element={<Av_conge />} />
            <Route path="/av_promo" element={<Av_promo />} />
            <Route path="/crypto" element={<Crypto />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/indemnites" element={<Indemnites />} />
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
