export interface ClienteResponseDTO {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;

  tipoIdentificacion: string;
  numeroIdentificacion: string;
  fechaNacimiento: string;
  nacionalidad: string;
  estadoCivil: string;
  sexo: string;
  lugarNacimiento: string;
  estatura: number;
  peso: number;
  direccion: string;
}
