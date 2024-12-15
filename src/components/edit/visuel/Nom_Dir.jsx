import axios from "axios";
import { useState, useEffect } from "react";
import Lien from "../../../config";

export default function Nom_Di({ id }) {
  const [contrat, setContrat] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/direction/${id}`);
      setContrat(response.data);
      console.log(response.data);
      console.log(contrat.nom_Di);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div>
      {contrat ? contrat.nom_Di : 'Loading...'}
    </div>
  );
}
