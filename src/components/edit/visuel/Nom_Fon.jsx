import axios from "axios";
import { useState, useEffect } from "react";
import Lien from "../../../config";

export default function Nom_Fon({ id }) {
  const [contrat, setContrat] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/fonction/${id}`);
      setContrat(response.data);
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
      console.log(id)
    }
    console.log('response.data',contrat,id);
  }, [id]);

  return (
    <div>
      {contrat ? ' salaire du '+contrat.nom_Fon : 'Loading...'}
    </div>
  );
}
