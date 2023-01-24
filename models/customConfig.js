const USER_CLIENT = 0;
const USER_ATELIER = 1;
const USER_FINANCIER = 2;

const VOITURE_ETAT_DEMANDE = 0;
const VOITURE_ETAT_ACCEPTER = 1;
const VOITURE_ETAT_SORTIE = 2;

const VISITE_ENCOURS = 0;
const VISITE_TERMINER_NON_PAYE = 1;
const VISITE_PAYE = 2;

const REPARATION_NON_COMMENCE = 0;
const REPARATION_ENCOURS = 1;
const REPARATION_TERMINER = 2;

const BON_DE_SORTIE_NON_PAYE = 0;
const BON_DE_SORTIE_PAYE = 1;

class CustomConfig {
    // user
    static get USER_CLIENT() {
        return USER_CLIENT;
    }
    static get USER_ATELIER() {
        return USER_ATELIER;
    }
    static get USER_FINANCIER() {
        return USER_FINANCIER;
    }

    // voiture
    static get VOITURE_ETAT_DEMANDE() {
        return VOITURE_ETAT_DEMANDE;
    }
    static get VOITURE_ETAT_ACCEPTER() {
        return VOITURE_ETAT_ACCEPTER;
    }
    static get VOITURE_ETAT_SORTIE() {
        return VOITURE_ETAT_SORTIE;
    }

    // visite
    static get VISITE_ENCOURS() {
        return VISITE_ENCOURS;
    }
    static get VISITE_TERMINER_NON_PAYE() {
        return VISITE_TERMINER_NON_PAYE;
    }
    static get VISITE_PAYE() {
        return VISITE_PAYE;
    }

    // reparation
    static get REPARATION_NON_COMMENCE() {
        return REPARATION_NON_COMMENCE;
    }
    static get REPARATION_ENCOURS() {
        return REPARATION_ENCOURS;
    }
    static get REPARATION_TERMINER() {
        return REPARATION_TERMINER;
    }
    
    // bon de sortie
    static get BON_DE_SORTIE_NON_PAYE() {
        return BON_DE_SORTIE_NON_PAYE;
    }
    static get BON_DE_SORTIE_PAYE() {
        return BON_DE_SORTIE_PAYE;
    }
}

module.exports = CustomConfig;