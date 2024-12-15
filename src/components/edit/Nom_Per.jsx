import axios from "axios";
import { useState, useEffect } from "react";
import Lien from '../../config'

export default function Nom({ id }) {
  
  const [contrat, setContrat] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/personnelles/${id}`);
      setContrat(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
console.log(contrat.nom +" et "+ contrat.prenom)
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div>
      {contrat ? contrat.nom +"  "+ contrat.prenom : 'Loading...'}
    </div>
  );
}
