import {Parameter} from '../model/common/parameter';

export class CuotaConst {
  static MAX_LONG_DESCRIPCION = 50;
  static MIN_LONG_DESCRIPCION = 5;
  static TOTAL_REGISTROS_CUOTA = 5;

  static ESTADOS_CUOTA: Parameter[] = [
    {value: 1, label: "Finalizado"},
    {value: 0, label: "No Finalizado"},
  ]
}
