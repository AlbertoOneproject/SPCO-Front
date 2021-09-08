export class Cteyprov {
    recinto				: string;
    empresa				: string;
    nomDenov			: string;
    idCliProv			: string;
    rfc					: string;
    immexCveRec		    : number;
    nomContacto		    : string;
    nal					: string;
    idTax				: string;
    país				: string;
    colonia				: string;
    curp				: string;
    estado				: string;
    numExt				: string;
    numInte				: string;
    cp					: string;
    calle				: string;
    localidad			: string;
    municipio			: string;
    email				: string;
    userMod				: string;
    tel					: number;
    tipo				: string;
    indAct				: string;
    fechaMod			: string;
    hora				: string;
    fechaAlta			: string;

    constructor(cteyprov) {
        this.recinto		= cteyprov.recinto		,										
        this.empresa		= cteyprov.empresa		,										
        this.nomDenov		= cteyprov.nomDenov		,  											
        this.idCliProv	  	= cteyprov.idCliProv	,										
        this.rfc			= cteyprov.rfc			,										
        this.immexCveRec 	= cteyprov.immexCveRec  ,											
        this.nomContacto 	= cteyprov.nomContacto  ,											
        this.nal			= cteyprov.nal			,										
        this.idTax			= cteyprov.idTax		,										
        this.país			= cteyprov.país			,  											
        this.colonia		= cteyprov.colonia		,										
        this.curp			= cteyprov.curp			,  											
        this.estado			= cteyprov.estado		,  											
        this.numExt			= cteyprov.numExt		,  											
        this.numInte		= cteyprov.numInte		,										
        this.cp				= cteyprov.cp			,  								      
        this.calle			= cteyprov.calle		,										
        this.localidad	  	= cteyprov.localidad	,										
        this.municipio	  	= cteyprov.municipio	,										
        this.email			= cteyprov.email		,										
        this.userMod		= cteyprov.userMod		,										
        this.tel			= cteyprov.tel			,										
        this.tipo			= cteyprov.tipo			,  											
        this.indAct			= cteyprov.indAct		,  											
        this.fechaMod		= cteyprov.fechaMod		,  											
        this.hora			= cteyprov.hora			,  											
        this.fechaAlta	  	= cteyprov.fechaAlta											
    }
}