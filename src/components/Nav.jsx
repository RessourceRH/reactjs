import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faFileAlt, faLeaf, faArchive, faArrowRight, faVenusMars, faMoneyBill, faBuilding, faClipboardCheck, faFolderOpen, faCog, faTachometerAlt, faSignOutAlt, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Logout from './cryptages/logout';

export default function Nav() {
    const [isCongesOpen, setIsCongesOpen] = useState(false);
    const [isPromotionsOpen, setIsPromotionsOpen] = useState(false);
    const { handleLogout } = Logout('usename', 'ID','image');
    useEffect(() => {
        const handleToggle = () => {
            $('.sidebar-offcanvas').toggleClass('active');
        };
    
        $('[data-toggle="offcanvas"]').on("click", handleToggle);
    
        return () => {
            $('[data-toggle="offcanvas"]').off("click", handleToggle);
        };
        
    }, []);
    
    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
                <li className="nav-item nav-category">Principal</li>
                <li className="nav-item">
                    <a className="nav-link" href="/acceuil">
                        <span className="icon-bg"><FontAwesomeIcon icon={faUser} className="menu-icon custom-icon-size" /></span>
                        <span className="menu-title">Personnelles</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/conjoint">
                        <span className="icon-bg"><FontAwesomeIcon icon={faUsers} className="menu-icon custom-icon-size" /></span>
                        <span className="menu-title">Conjoints</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/contrat">
                        <span className="icon-bg"><FontAwesomeIcon icon={faFileAlt} className="menu-icon custom-icon-size" /></span>
                        <span className="menu-title">Types de Contrats</span>
                    </a>
                </li>
                <li className={`nav-item ${isCongesOpen ? 'dropdown-active' : ''}`}>
                    <a 
                        className="nav-link" 
                        data-toggle="collapse" 
                        href="#ui-conges" 
                        aria-expanded={isCongesOpen} 
                        aria-controls="ui-conges"
                        onClick={() => setIsCongesOpen(!isCongesOpen)}
                    >
                        <span className="icon-bg"><FontAwesomeIcon icon={faLeaf} className="menu-icon custom-icon-size" /></span>
                        <span className='row'>
                            <span className="menu-title col-md-8">Les congés</span>
                            <FontAwesomeIcon icon={isCongesOpen ? faChevronUp : faChevronDown} className="menu-arrow custom-icon-size col-md-2" />
                        </span>
                    </a>
                    <div className="collapse" id="ui-conges">
                        <ul className="nav flex-column drop">
                            <li className="nav-item">
                                <a className="nav-link" href="/conge">
                                    <FontAwesomeIcon icon={faArrowRight} className="menu-icon" />
                                    <span className="menu-title">Liste des congés</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/av_conge">
                                    <FontAwesomeIcon icon={faArrowRight} className="menu-icon" />
                                    <span className="menu-title">Liste des personnels ayant eu un congé</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className={`nav-item ${isPromotionsOpen ? 'dropdown-active' : ''}`}>
                    <a 
                        className="nav-link" 
                        data-toggle="collapse" 
                        href="#ui-promotions" 
                        aria-expanded={isPromotionsOpen} 
                        aria-controls="ui-promotions"
                        onClick={() => setIsPromotionsOpen(!isPromotionsOpen)}
                    >
                        <span className="icon-bg"><FontAwesomeIcon icon={faArchive} className="menu-icon custom-icon-size" /></span>
                        <span className='row'>
                            <span className="menu-title col-md-8">Promotions</span>
                            <FontAwesomeIcon icon={isPromotionsOpen ? faChevronUp : faChevronDown} className="menu-arrow custom-icon-size col-md-2" />
                        </span>
                    </a>
                    <div className="collapse" id="ui-promotions">
                        <ul className="nav flex-column ">
                            <li className="nav-item">
                                <a className="nav-link" href="/promotion">
                                    <FontAwesomeIcon icon={faArrowRight} className="menu-icon custom-icon-size" />
                                    <span className="menu-title">Liste des promotions</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/av_promo">
                                    <FontAwesomeIcon icon={faArrowRight} className="menu-icon custom-icon-size" />
                                    <span className="menu-title">Liste des personnels ayant eu une promotion</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/sexe">
                        <span className="icon-bg"><FontAwesomeIcon icon={faVenusMars} className="menu-icon custom-icon-size" /></span>
                        <span className="menu-title">Genre</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/indemnites">
                        <span className="icon-bg"><FontAwesomeIcon icon={faMoneyBill} className="menu-icon custom-icon-size" /></span>
                        <span className="menu-title">Indemnité</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/salaire">
                        <span className="icon-bg"><FontAwesomeIcon icon={faMoneyBill} className="menu-icon custom-icon-size" /></span>
                        <span className="menu-title">Salaire</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/versement">
                        <span className="icon-bg"><FontAwesomeIcon icon={faMoneyBill} className="menu-icon" /></span>
                        <span className="menu-title">Versement</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/direction">
                        <span className="icon-bg"><FontAwesomeIcon icon={faBuilding} className="menu-icon custom-icon-size" /></span>
                        <span className="menu-title">Direction</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/service">
                        <span className="icon-bg"><FontAwesomeIcon icon={faClipboardCheck} className="menu-icon custom-icon-size" /></span>
                        <span className="menu-title">Service</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/fonction">
                        <span className="icon-bg"><FontAwesomeIcon icon={faFolderOpen} className="menu-icon custom-icon-size" /></span>
                        <span className="menu-title">Fonction</span>
                    </a>
                </li>
                <hr style={{ color: 'white' }} />
                <li className="nav-item sidebar-user-actions">
                    <div className="sidebar-user-menu">
                        <a className="nav-link" href='/parametres' style={{ cursor: 'pointer' }}><FontAwesomeIcon icon={faCog} className="menu-icon custom-icon-size" />
                            <span className="menu-title">Paramètres</span>
                        </a>
                    </div>
                </li>
              
                <li className="nav-item sidebar-user-actions">
                    <div className="sidebar-user-menu">
                        <a className="nav-link" style={{ cursor: 'pointer' }} onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} className="menu-icon custom-icon-size" />
                            <span className="menu-title">Se Déconnecter</span></a>
                    </div>
                </li>
            </ul>
        </nav>
    );
}
