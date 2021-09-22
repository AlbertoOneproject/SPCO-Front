export class Partes {
    idCliProv	  : string;
    numPart       : string;
    numPedimento  : string;
    fechaAlta     : string;
    fechaEntrada  : string;
    producto      : string;
    paisOrigen    : string;
    cantidad      : number;
    costounitdls  : number;
    costoTotaldls : number;
    costounitMXP  : number;
    costototalMXP : number;
    tipCambio     : number;
    uMC           : string;
    uMT           : string;
    fraccAranc    : string;
    nico          : string;
    netoOriginal  : number;
    brutoOriginal : number;
    netoConv      : number;
    brutoConv     : number;
    fechaVenc     : string;
    empresa       : string;
    recinto       : string;
    fechaRegistro : string;
    fechaMod      : string;
    hora          : string;
    userMod       : string;

    constructor(partes) {
        this.idCliProv       = partes.idCliProv    ,
        this.numPart         = partes.numPart      ,
        this.numPedimento    = partes.numPedimento ,
        this.fechaAlta       = partes.fechaAlta    ,
        this.fechaEntrada    = partes.fechaEntrada ,
        this.producto        = partes.producto     ,
        this.paisOrigen      = partes.paisOrigen   ,
        this.cantidad        = partes.cantidad     ,
        this.costounitdls    = partes.costounitdls ,
        this.costoTotaldls   = partes.costoTotaldls,
        this.costounitMXP    = partes.costounitMXP ,
        this.costototalMXP   = partes.costototalMXP,
        this.tipCambio       = partes.tipCambio    ,
        this.uMC             = partes.uMC          ,
        this.uMT             = partes.uMT          ,
        this.fraccAranc      = partes.fraccAranc   ,
        this.nico            = partes.nico         ,
        this.netoOriginal    = partes.netoOriginal ,
        this.brutoOriginal   = partes.brutoOriginal,
        this.netoConv        = partes.netoConv     ,
        this.brutoConv       = partes.brutoConv    ,
        this.fechaVenc       = partes.fechaVenc    ,
        this.empresa         = partes.empresa      ,
        this.recinto         = partes.recinto      ,
        this.fechaRegistro   = partes.fechaRegistro,
        this.fechaMod        = partes.fechaMod     ,
        this.hora            = partes.hora         ,
        this.userMod         = partes.userMod      
    }
}