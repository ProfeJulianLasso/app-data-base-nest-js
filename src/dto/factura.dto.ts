import { IsEmail, IsOptional, IsString } from 'class-validator';
import { FacturaDetalleDto } from './factura-detalle.dto';

export class FacturaDto {
  @IsString()
  clienteNombre: string;

  @IsEmail()
  @IsOptional()
  clienteCorreo?: string;

  @IsOptional()
  detalleFactura?: FacturaDetalleDto[];
}
