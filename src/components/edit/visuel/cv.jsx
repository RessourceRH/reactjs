import { startTransition, useEffect, useState } from 'react';
import axios from 'axios';
import Lien from '../../../config';
import { useParams } from 'react-router-dom';
import M_info_perso from '../modification/M_info_perso';
import Enfants from './Enfants';
import Conjoint_P from './Conjoint_P';
import Salaire_P from './Salaire_P';
import A_info_perso from './Affichage/A_info_perso';
import H_cv from './h_cv';
import Conge_perso from './activite/Conge_perso';
import Promo_perso from './activite/promo_perso';
import A_plus_info_perso from './Affichage/A_plus_info_perso';

export default function CV({id}) {
  
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [contrats, setcontrats] = useState([]);
  const [conjoints, setconjoint] = useState([]);
  const [conges, setconge] = useState([]);
  const [fonction, setFonction] = useState([]);
  const [direction, setDirection] = useState([]);
  const [service, setService] = useState([]);
  const [versements, setversements] = useState(null);
  const [promotions, setpromotion] = useState([]);
  const idP = id.id.id;
  
  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/personnelles/${idP}`);
      if (response) {
        setData(response.data);
        const [fonction, contrat, versement, promotion] = await Promise.all([
          axios.get(`${Lien}/fonction/${response.data.id_Fon}`),
          axios.get(`${Lien}/typeC/${response.data.id_TC}`),
          axios.get(`${Lien}/versement/personnelle/${idP}`),
          axios.get(`${Lien}/avoir_promo/personnelle/${idP}`),
        ]);
    
        const fonctionData = fonction.data;
        const contratData = contrat.data;
        const versementData = versement.data;
        const Promodata = promotion.data;
        setFonction(fonctionData)
        setpromotion(Promodata);
        setcontrats(contratData);
        setversements(versementData);
        if (fonctionData) {
          const [direction, service] = await Promise.all([
            axios.get(`${Lien}/direction/${fonctionData.Id_Dir}`),
            axios.get(`${Lien}/service/${fonctionData.Id_Ser}`),
          ]);
          const directionData = direction.data;
          const serviceData = service.data;
          setDirection(directionData)
          setService(serviceData)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const isWithinLast12Months = (date) => {
    const maintenant = new Date();
    const dateDebut = new Date(date);
    const unAnPlusTard = new Date(dateDebut);
    unAnPlusTard.setFullYear(dateDebut.getFullYear() + 1);
  
    return maintenant >= unAnPlusTard;
  };
  const handleRefresh = () => {
    fetchData();
  }; 

  return (
    <div className="main-panel">
      <div className="container">
        <div className="cover shadow-lg bg-white">
          <div className="cover-bg p-3 p-lg-4 text-white ">
            <div className="row">
              <H_cv data={data}  />
              <div className="col-lg-8 col-md-7 text-center text-md-start">
                <h2 className="h1 mt-2" data-aos="fade-left" data-aos-delay="0">{data.nom} {data.prenom}</h2>
                {fonction?(
                  <p>
                    <p data-aos="fade-left" data-aos-delay="100">Fonction: {fonction.nom_Fon}</p>
                <p data-aos="fade-left" data-aos-delay="100"> Service: {service.nom_Ser}</p>
                <p data-aos="fade-left" data-aos-delay="100">Direction: {direction.nom_Di}</p>
                  </p>
                ):(
                  <p>
                    
                  </p>
                )}
                
                <M_info_perso pers={data} contrat={contrats} versement={versements} promotion={promotions} fonction={fonction.nom_Fon} service={service.nom_Ser} direction={direction.nom_Di} onrefresh={handleRefresh} />
              </div>
            </div>
          </div>
          <A_info_perso data={data} contrat={contrats}/>
          <hr className="d-print-none"/>
          <div className="work-experience-section px-3 px-lg-4">
            <h2 className="h3 mb-4">Plus d'information</h2>
            <A_plus_info_perso data={data} contrat={contrats} onrefresh={handleRefresh}/>
            <Conjoint_P id={data} onrefresh={handleRefresh}/>
          </div>
          <hr className="d-print-none"/>
          <div className="page-break"></div>
          <div className="education-section px-3 px-lg-4 pb-4">
            <Enfants data={data}/>
            <Salaire_P id={data}/>
            {(data.id_TC != null && contrats.abreviation === 'CDI' && isWithinLast12Months(data.date_DF)) ? (
  <Conge_perso idP={data} conge={conges} />
) : (
  <div></div>
)}

            <Promo_perso idP={data} promo={promotions}/>
          </div>
        </div>
      </div>
    </div>
  );
}
