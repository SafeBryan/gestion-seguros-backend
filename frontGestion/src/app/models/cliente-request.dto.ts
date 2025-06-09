export interface ClienteRequestDTO {
  usuarioId: number;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  fechaNacimiento: string; // Formato ISO: 'yyyy-MM-dd'
  nacionalidad: string;
  estadoCivil: string;
  sexo: string;
  lugarNacimiento: string;
  estatura: number;
  peso: number;
  direccion: string;
}
