import React from "react";
import Lien from "../../../config";

export default function H_cv({ data }) {
 

  return (
    <div className="col-lg-4 col-md-5">
      <div className="avatar hover-effect bg-white shadow-sm p-1" >
        {data.image ? (
          <img src={`${Lien}/${data.image}`} width="200" height="200" alt="Avatar" />
        ) : (
          <div>Image non disponible</div>
        )}
      </div>
    </div>
  );
}
