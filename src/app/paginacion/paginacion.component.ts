import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  templateUrl: './paginacion.component.html',
})
export class PaginacionComponent implements OnInit {
  @Input('page') page: number;
  //@Input('total') total: number;
  totalPages: number;
  qtdPaginacao = 10;
  arrayPages: number[];
  @Output() mudouPagina = new EventEmitter();
  linkNulo = 'javascript:void(0)';

  constructor() { }

  ngOnInit() {
  }

  listaPaginas() {
    this.arrayPages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.arrayPages.push(i);
    }
  }

  @Input('totalPages')
  set updateTotalPagesValue(totalPages: number) {
    this.totalPages = totalPages;
    this.listaPaginas();
  }

  mudaPag(pag: number) {
    this.mudouPagina.emit({valor: pag});
  }

  proxPagina() {
    if (this.page < this.totalPages) {
      this.mudaPag(this.page + 1);
    }
  }

  paginaAnt() {
    if (this.page > 1) {
      this.mudaPag(this.page - 1);
    }
  }

  primerPag() {
    this.mudaPag(1);
  }

  ultimaPag() {
    this.mudaPag(this.totalPages);
  }

  diminuiPaginacao(pags) {
    const metadePgs = Math.ceil(this.qtdPaginacao / 2);
    let i = this.page - metadePgs;
    if (i < 0) {
      i = 0;
    }
    let f = i + this.qtdPaginacao;
    if (f > pags.length) {
      f = pags.length;
      i = f - this.qtdPaginacao;
      if (i < 0) {
        i = 0;
      }
    }
    return pags.slice(i, f);
  }
}
