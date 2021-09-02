export class Prodymat {
    clveProduc:    string;
    tipProd:       string;  
    indVis:        string;
    descCorta:     string;
    descLarga:     string;
    descCorIng:    string;
    descLarIng:    string;
    uM:            string;
    empresa:       string;
    recinto:       string;
    fechaAlta:     string;
    fechaMod:      string;
    hora:          string;
    userMod:       string;
    tip_Mat:       string


    constructor(prodymat) {
        this.clveProduc    = prodymat.clveProduc,
        this.tipProd       = prodymat.tipProd,  
        this.indVis        = prodymat.indVis, 
        this.descCorta     = prodymat.descCorta, 
        this.descLarga     = prodymat.descLarga, 
        this.descCorIng    = prodymat.descCorIng, 
        this.descLarIng    = prodymat.descLarIng, 
        this.uM            = prodymat.uM, 
        this.empresa	   = prodymat.empresa,
        this.recinto       = prodymat.recinto,
        this.fechaAlta     = prodymat.fechaAlta, 
        this.fechaMod      = prodymat.fechaMod, 
        this.hora          = prodymat.hora, 
        this.userMod       = prodymat.userMod, 
        this.tip_Mat       = prodymat.tip_Mat
    }
}