import { useState } from "react";

export default function Enfants({ data }) {
    const [nb_enf_fille, setNb_enf_fille] = useState('');
    const [nb_enf_garçon, setNb_enf_garçon] = useState('');

    return (
        <div className="timeline-card timeline-card-primary card shadow-sm">
            <div className="card-body">
                <div className="h5 mb-1">Ses enfants</div>
                
                {data.nb_enf_fille == null && data.nb_enf_garçon == null ? (
                     <div>
                     <p>Il(elle) n'a aucun(e)  enfant</p>

                 </div>
                ) : (
                   
                     <div>
                     <p>Il(elle) a {data.nb_enf_fille + data.nb_enf_garçon} enfants dont {data.nb_enf_fille} fille(s) et {data.nb_enf_garçon} garçon(s)</p>
                 </div>
                )}
            </div>
        </div>
    );
}
