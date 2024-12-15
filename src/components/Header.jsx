import React, { useEffect, useState } from 'react';
import Logo from '../assets/images/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faEnvelopeOpenText, faUser, faCog, faLock, faSignOutAlt, faCalendar, faWrench, faLink, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import RecuperationCookie from './cryptages/RécupérationCookie';
import Logout from './cryptages/logout';
import Lien from '../config';
import axios from 'axios';

export default function Header() {
    const secretKey = 'your-secret-key';
    const [entreprise, setEntreprise] = useState([]);
    const user = RecuperationCookie(secretKey, 'usename');
    const id = RecuperationCookie(secretKey, 'ID');
    const image = RecuperationCookie(secretKey, 'image');
    const { handleLogout } = Logout('usename', 'ID', 'image');
    
    const fetchCompanyInfo = async () => {
        try {
            const response = await axios.get(`${Lien}/entreprise`);
            setEntreprise(response.data[0]);
        } catch (error) {
            console.error("Erreur lors de la récupération des données de l'entreprise :", error);
        }
    };

    useEffect(() => {
        fetchCompanyInfo();
    }, []);

    return (
        <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
            {entreprise ? (
                <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                    <a className="navbar-brand brand-logo" href="/acceuil">
                        <img src={`${Lien}/${entreprise.image}`} alt="logo" style={{ width: '50px', height: '25px' }} />
                        <span style={{ color: 'white', fontWeight: 'bolder', size: '15px' }}>{entreprise.nom}</span>
                    </a>
                    <a className="navbar-brand brand-logo-mini" href="/acceuil">
                        <img src={`${Lien}/${entreprise.image}`} alt="logo" />
                    </a>
                </div>
            ) : (
                <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                    <a className="navbar-brand brand-logo" href="/acceuil" style={{ color: 'white' }}>Aucun nom</a>
                    <a className="navbar-brand brand-logo-mini" href="/acceuil"></a>
                </div>
            )}

            <div className="navbar-menu-wrapper d-flex align-items-stretch">
                <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <ul className="navbar-nav navbar-nav-right">
                    <li className="nav-item nav-profile dropdown">
                        <a className="nav-link dropdown-toggle" id="profileDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                            <div className="nav-profile-img">
                                <img src={`${Lien}/${image}`} alt="image" />
                            </div>
                            <div className="nav-profile-text">
                                <p className="mb-1 text-black">
                                    {user ? user : 'Invité'} <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '10px' }} />
                                </p>
                            </div>
                        </a>
                        <div className="dropdown-menu navbar-dropdown dropdown-menu-right p-0 border-0 font-size-sm" aria-labelledby="profileDropdown" data-x-placement="bottom-end">
                            <div className="p-3 text-center bg-primary">
                                <img className="img-avatar img-avatar48 img-avatar-thumb" src={`${Lien}/${image}`} alt="" />
                            </div>
                            <div className="p-2">
                                <h5 className="dropdown-header text-uppercase pl-2 text-dark">Options utilisateur</h5>
                                <a className="dropdown-item py-1 d-flex align-items-center justify-content-between" href="/notification">
                                    <span>Boîte de réception</span>
                                    <span className="p-0">
                                        <span className="badge badge-primary">3</span>
                                        <FontAwesomeIcon icon={faEnvelopeOpenText} className="ml-1" />
                                    </span>
                                </a>
                                <a className="dropdown-item py-1 d-flex align-items-center justify-content-between" href="/profil">
                                    <span>Profil</span>
                                    <span className="p-0">
                                        <span className="badge badge-success">1</span>
                                        <FontAwesomeIcon icon={faUser} className="ml-1" />
                                    </span>
                                </a>
                                <a className="dropdown-item py-1 d-flex align-items-center justify-content-between" href="/parametres">
                                    <span>Paramètres</span>
                                    <FontAwesomeIcon icon={faCog} />
                                </a>
                                <div role="separator" className="dropdown-divider"></div>
                                <h5 className="dropdown-header text-uppercase pl-2 text-dark mt-2">Actions</h5>
                                
                                <a 
                                    className="dropdown-item py-1 d-flex align-items-center justify-content-between"
                                    onClick={handleLogout} // Attach the logout handler to the onClick event
                                    
                                >
                                    <span>Déconnexion</span>
                                    <FontAwesomeIcon icon={faSignOutAlt} className="ml-1" />
                                </a>
                            </div>
                        </div>
                    </li>
                </ul>
                <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
        </nav>
    );
}
