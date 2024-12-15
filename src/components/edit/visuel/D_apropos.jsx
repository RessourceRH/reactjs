import Nav from "../../Nav";
import CV from "./cv";

export default function D_apropos({id}) {
 
    return (
      <div className="container-fluid page-body-wrapper m-0 p-0">
        <Nav/>
     <CV id={{id}} />
      </div>
    );
  }
  