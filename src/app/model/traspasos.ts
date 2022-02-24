export class Traspasos {

    empresa                     : string;
    recinto                     : string;
    idCliProv 	    		    : string;
    recintoDest                 : string;
    idCliProvDest    		    : string;
    numPart		    		    : string;
    numFact                     : string;
    numPedimentoEntrada         : string;
    estatus                     : string;
    producto                    : string;
    cantidad                    : string;
    fechaAlta                   : string;
    fechaMod                    : string;
    hora                        : string;
    userMod                     : string;
    entSal                      : string;
    numFactEnt                  : string;

    constructor(traspasos) {
        this.empresa             		   = traspasos.empresa             ,
        this.recinto                       = traspasos.recinto             ,
        this.idCliProv	    		       = traspasos.idCliProv	       ,
        this.recintoDest                   = traspasos.recintoDest         ,
        this.idCliProvDest   		       = traspasos.idCliProvDest       ,
        this.numPart		    		   = traspasos.numPart		       ,
        this.numFact                       = traspasos.numFact             ,
        this.numPedimentoEntrada           = traspasos.numPedimentoEntrada ,
        this.estatus                       = traspasos.estatus             ,
        this.producto                      = traspasos.producto            ,
        this.cantidad                      = traspasos.cantidad            ,
        this.fechaAlta                     = traspasos.fechaAlta           ,
        this.fechaMod                      = traspasos.fechaMod            ,
        this.hora                          = traspasos.hora                ,
        this.userMod                       = traspasos.userMod             ,
        this.entSal                        = traspasos.entSal              ,
        this.numFactEnt                    = traspasos.numFactEnt                  
    }
}