import axios from "axios";
import { useState, useEffect } from "react";
import Lien from "../../../config";

export default function Nom_TC({ id }) {
  const [contrat, setContrat] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/typeC/${id}`);
      setContrat(response.data);
      
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
      {contrat ? contrat.abreviation : 'Loading...'}
    </div>
  );
}
