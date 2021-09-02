import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Catprod, Prodymat } from '../model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProdymatService {
  auth: String;
  prodymat: Prodymat

  constructor(private http: HttpClient) { 
  }

  //  Consulta de todos los Tipos de Productos
  catProdMat(){
    //return this.http.get<Sysdtapl>(`${environment.SERVER_URL}/CatProd`, {})
    return this.http.get<any>(`${environment.SERVER_URL}/CatProd/TiposProd`, {})
      .pipe(map(listprod => {
        if(listprod){
        } 
      return listprod;
      }));
    } //Cierre del método catProdMat

  Prodymatid(prod, page, perPage, perName ){
  //return this.http.get<any>(`${environment.SERVER_URL}/Users`, {})
      //let constPagLike = 'ProdPag?'
      let constPagLike = 'ProdPagUm?'
      let consRecinto = '&tipo='
      let constPag = 'pag?'
      let constPage = 'page='
      let constPerPage = '&perpage='
      this.auth = JSON.parse(localStorage.getItem('autorizacion'));
      return this.http.get<any>(`${environment.SERVER_URL}/CatProd/`+constPagLike+constPage+page+constPerPage+perPage+consRecinto+prod, {})
        .pipe(map(listprods => {
          if(listprods){
             }       
          return listprods;
        }));      
    }    // Cierre del método Prodymatid

  altaprodymat(prodymat: Prodymat){
      return this.http.post<Prodymat>(`${environment.SERVER_URL}/CatProd`,prodymat)
          .pipe(map(datapost => {
      return datapost;
        }));
      }
  prodymatUnico(clveProduc ){
  //return this.http.get<any>(`${environment.SERVER_URL}/Users`, {})
      let constPagLike = 'ProdUnicoUm?'
      let consRecinto = '&clave='

      this.auth = JSON.parse(localStorage.getItem('autorizacion'));
      return this.http.get<any>(`${environment.SERVER_URL}/CatProd/`+constPagLike+consRecinto+clveProduc, {})
        .pipe(map(listprods => {
          if(listprods){
            // store user details and jwt token in local storage to keep user logged in between page refreshes
             }       
          return listprods;
        }));      
    }    // Cierre del método Prodymatid
    editprodymat(prodymat: Prodymat){
      return this.http.put<Prodymat>(`${environment.SERVER_URL}/CatProd`,prodymat)
            .pipe(map(dataput => {
          return dataput;
        }));
    }  

    deleteprodymat(clveProduc: string){
      let params = new HttpParams();
      let constPagLike = 'ProdUnico?'
      let consClave = '&clave='

      params = params.append('id',clveProduc);
      return this.http.delete<any>(`${environment.SERVER_URL}/CatProd/`+constPagLike+consClave+clveProduc, {})
            .pipe(map(datadel => {
          return datadel;
  
        }));
    }

      
}
