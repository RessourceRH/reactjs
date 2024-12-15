import axios from "axios";
import { useState, useEffect } from "react";
import Lien from "../../../config";

export default function Perso({ id }) {
    console.log('aaa')
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
