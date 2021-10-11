export class Aduanal {
    numPat		: string;
    nomAgAdu    : string;
    rFC         : string;
    cURP        : string;
    pais        : string;
    calle       : string;
    numExt      : string;
    numINT      : string;
    cP          : string;
    colonia     : string;
    estado      : string;
    municipio   : string;
    localidad   : string;
    eMail       : string;
    tel         : string;
    idAct       : string;
    empresa     : string;
    recinto     : string;
    fechaAlta   : string;
    fechaMod    : string;
    hora        : string;
    userMod     : string;
    

    constructor(aduanal) {
        this.numPat		  = aduanal.numPat    ,
        this.nomAgAdu     = aduanal.nomAgAdu  ,
        this.rFC          = aduanal.rFC       ,
        this.cURP         = aduanal.cURP      ,
        this.pais         = aduanal.pais      ,
        this.calle        = aduanal.calle     ,
        this.numExt       = aduanal.numExt    ,
        this.numINT       = aduanal.numINT    ,
        this.cP           = aduanal.cP        ,
        this.colonia      = aduanal.colonia   ,
        this.estado       = aduanal.estado    ,
        this.municipio    = aduanal.municipio ,
        this.localidad    = aduanal.localidad ,
        this.eMail        = aduanal.eMail     ,
        this.tel          = aduanal.tel       ,
        this.idAct        = aduanal.idAct     ,
        this.empresa      = aduanal.empresa   ,
        this.recinto      = aduanal.recinto   ,
        this.fechaAlta    = aduanal.fechaAlta ,
        this.fechaMod     = aduanal.fechaMod  ,
        this.hora         = aduanal.hora      ,
        this.userMod      = aduanal.userMod   
    }
}