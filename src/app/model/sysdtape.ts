export class Sysdtape {
    clvap:      string;
    id1:        string;
    id2:        string;
    indVis:    string;
    desCorta: string;
    desLarga: string;

    constructor(sysdtape) {
        this.clvap      = sysdtape.clvap,
        this.id1        = sysdtape.id1,
        this.id2        = sysdtape.id2,
        this.indVis     = sysdtape.indVis,
        this.desCorta   = sysdtape.desCorta,
        this.desLarga   = sysdtape.desLarga
    }
        
}