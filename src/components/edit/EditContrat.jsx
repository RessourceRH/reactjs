// Composant Modal
import React from 'react';

const EditContrat = ({ editData }) => {
  return (
    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modifier le contrat</h5>
            <button type="button" className="close" onClick={handleClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {editData && (
              <form>
                <div className="form-group">
                  <label htmlFor="edit_nom">Nom du contrat</label>
                  <input
                    type="text"
                    className="form-control"
                    id="edit_nom"
                    defaultValue={editData.nom} // Utilisez defaultValue pour pré-remplir le champ
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_date_nom">Date du contrat</label>
                  <input
                    type="date"
                    className="form-control"
                    id="edit_date_nom"
                    defaultValue={editData.date_nom} // Utilisez defaultValue pour pré-remplir le champ
                  />
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Fermer
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditContrat;
