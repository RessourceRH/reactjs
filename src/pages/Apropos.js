
import Header from "../components/Header";
import D_apropos from "../components/edit/visuel/D_apropos";
import { useParams } from "react-router-dom";

export default function Apropos() {
    const { id } = useParams();
   return(
    <div className="container-scroller">
<Header/>
<D_apropos id={{id}} />
    </div>
   ) 
}