export interface transaccionInicial{
    trans_id: string,
    trans_tpo: string,
    trans_desc: string,
    trans_cant: number,
    trans_tipo: string,
    trans_cat_ing?:  String,
    trans_metodo_cobro?: String,
    trans_cat_per?: String
    trans_cta_id: string
}
