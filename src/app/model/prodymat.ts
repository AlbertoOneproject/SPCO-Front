export class Prodymat {
    clveProduc:    string;
    tipProd:       string;  
    indVis:        string;
    descCorta:     string;
    descLarga:     string;
    descCorIng:    string;
    descLarIng:    string;
    uMC:           string;
    uMT:           string;
    tipMat:        string;
    empresa:       string;
    recinto:       string;
    fechaAlta:     string;
    fechaMod:      string;
    hora:          string;
    userMod:       string;
    convers:       number; 
    costoUnitDLS:  number;
    costoUnitMXP:  number;
    fraccAranc:    string;
    nico:          string;

    constructor(prodymat) {
        this.clveProduc    = prodymat.clveProduc,
        this.tipProd       = prodymat.tipProd,  
        this.indVis        = prodymat.indVis, 
        this.descCorta     = prodymat.descCorta, 
        this.descLarga     = prodymat.descLarga, 
        this.descCorIng    = prodymat.descCorIng, 
        this.descLarIng    = prodymat.descLarIng, 
        this.uMC           = prodymat.uMC, 
        this.uMT           = prodymat.uMT, 
        this.tipMat        = prodymat.tipMat
        this.empresa	   = prodymat.empresa,
        this.recinto       = prodymat.recinto,
        this.fechaAlta     = prodymat.fechaAlta, 
        this.fechaMod      = prodymat.fechaMod, 
        this.hora          = prodymat.hora, 
        this.userMod       = prodymat.userMod, 
        this.convers       = prodymat.convers, 
        this.costoUnitDLS  = prodymat.costoUnitDLS, 
        this.costoUnitMXP  = prodymat.costoUnitMXP, 
        this.fraccAranc    = prodymat.fraccAranc, 
        this.nico          = prodymat.nico 
    }
}