export class Facturas {

    idCliProv			: string;
    numPart				: string;
    numFact             : string;
    iDImpoEexpo         : string;
    fechaEntrada        : string;
    tipoCambio          : number;
    paisFact            : string;
    numPedimentoEntrada : string;
    numPedimentoSalida  : string;
    cLVPedi             : string;
    numPate             : string;
    aduana              : string;
    producto            : string;
    cantidad            : number;
    costounitdls        : number;
    costoTotaldls       : number;
    costounitMXP        : number;
    costototalMXP       : number;
    unidadDeMedida      : string;
    fraccAranc          : string;
    netoOriginal        : number;
    brutoOriginal       : number;
    netoConv            : number;
    brutoConv           : number;
    transport           : string;
    clieOrig            : string;
    clieDest            : string;
    iNCOTERM            : string;
    nUMPlacaTr          : string;
    nUMGuia             : string;
    contCaja            : string;
    selloCand1          : string;
    selloCand2          : string;
    selloCand3          : string;
    nombChofTr          : string;
    pO                  : string;
    empresa             : string;
    recinto             : string;
    observaciones       : string;
    fechaAlta           : string;
    fechaMod            : string;
    hora                : string;
    userMod             : string;
    estatus             : string;
    entSal              : string;

    constructor(facturas) {

        this.idCliProv            = facturas.idCliProv            ,
        this.numPart              = facturas.numPart              ,
        this.numFact              = facturas.numFact              ,
        this.iDImpoEexpo          = facturas.iDImpoEexpo          ,
        this.fechaEntrada         = facturas.fechaEntrada         ,
        this.tipoCambio           = facturas.tipoCambio           ,
        this.paisFact             = facturas.paisFact             ,
        this.numPedimentoEntrada  = facturas.numPedimentoEntrada  ,
        this.numPedimentoSalida   = facturas.numPedimentoSalida   ,
        this.cLVPedi              = facturas.cLVPedi              ,
        this.numPate              = facturas.numPate              ,
        this.aduana               = facturas.aduana               ,
        this.producto             = facturas.producto             ,
        this.cantidad             = facturas.cantidad             ,
        this.costounitdls         = facturas.costounitdls         ,
        this.costoTotaldls        = facturas.costoTotaldls        ,
        this.costounitMXP         = facturas.costounitMXP         ,
        this.costototalMXP        = facturas.costototalMXP        ,
        this.unidadDeMedida       = facturas.unidadDeMedida       ,
        this.fraccAranc           = facturas.fraccAranc           ,
        this.netoOriginal         = facturas.netoOriginal         ,
        this.brutoOriginal        = facturas.brutoOriginal        ,
        this.netoConv             = facturas.netoConv             ,
        this.brutoConv            = facturas.brutoConv            ,
        this.transport            = facturas.transport            ,
        this.clieOrig             = facturas.clieOrig             ,
        this.clieDest             = facturas.clieDest             ,
        this.iNCOTERM             = facturas.iNCOTERM             ,
        this.nUMPlacaTr           = facturas.nUMPlacaTr           ,
        this.nUMGuia              = facturas.nUMGuia              ,
        this.contCaja             = facturas.contCaja             ,
        this.selloCand1           = facturas.selloCand1           ,
        this.selloCand2           = facturas.selloCand2           ,
        this.selloCand3           = facturas.selloCand3           ,
        this.nombChofTr           = facturas.nombChofTr           ,
        this.pO                   = facturas.pO                   ,
        this.empresa              = facturas.empresa              ,
        this.recinto              = facturas.recinto              ,
        this.observaciones        = facturas.observaciones        ,
        this.fechaAlta            = facturas.fechaAlta            ,
        this.fechaMod             = facturas.fechaMod             ,
        this.hora                 = facturas.hora                 ,
        this.userMod              = facturas.userMod              ,
        this.estatus              = facturas.estatus              ,
        this.entSal               = facturas.entSal              
    }
}