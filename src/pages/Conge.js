import Contrat from "../components/Contrat";
import D_conjoint from "../components/edit/D_conjoint";
import Header from "../components/Header";
import Main from "../components/Main";
import D_contrat from "../components/edit/D_contrat";
import D_sexe from "../components/edit/D_sexe";
import D_conge from "../components/edit/D_conge";

export default function Conge() {
   return(
    <div className="container-scroller">
<Header/>

<D_conge/>
    </div>
   ) 
}