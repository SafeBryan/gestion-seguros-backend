import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  /**
   * Calcula el alto aproximado del texto basado en el número de líneas
   */
  private calcularAltoTexto(texto: string, anchoMaximo: number = 180): number {
    const palabras = texto.split(' ');
    let lineas = 1;
    let lineaActual = '';
    
    palabras.forEach(palabra => {
      const lineaTest = lineaActual + (lineaActual ? ' ' : '') + palabra;
      if (lineaTest.length * 2.5 > anchoMaximo) { // Aproximación del ancho de caracteres
        lineas++;
        lineaActual = palabra;
      } else {
        lineaActual = lineaTest;
      }
    });
    
    return lineas * 5; // Aproximadamente 5mm por línea
  }

  /**
   * Genera un PDF con tabla de datos
   */
  generarPdfConTabla(
    titulo: string,
    subtitulo: string,
    datos: any[],
    columnas: string[],
    nombreArchivo: string
  ): void {
    const doc = new jsPDF();
    
    // Configurar fuente y colores
    doc.setFont('helvetica');
    doc.setFontSize(20);
    doc.setTextColor(33, 33, 33);
    
    // Título
    doc.text(titulo, 14, 22);
    
    // Subtítulo
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitulo, 14, 32);
    
    // Fecha de generación
    const fecha = new Date().toLocaleDateString('es-ES');
    doc.text(`Generado el: ${fecha}`, 14, 42);
    
    // Agregar tabla
    if (datos.length > 0) {
      autoTable(doc, {
        head: [columnas],
        body: datos,
        startY: 50,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 50 },
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('No hay datos para mostrar', 14, 60);
    }
    
    // Guardar PDF
    doc.save(`${nombreArchivo}_${fecha.replace(/\//g, '-')}.pdf`);
  }

  /**
   * Genera un PDF con resumen y tabla
   */
  generarPdfCompleto(
    titulo: string,
    subtitulo: string,
    resumen: any,
    datos: any[],
    columnas: string[],
    nombreArchivo: string
  ): void {
    const doc = new jsPDF();
    
    // Configurar fuente y colores
    doc.setFont('helvetica');
    doc.setFontSize(20);
    doc.setTextColor(33, 33, 33);
    
    // Título
    doc.text(titulo, 14, 22);
    
    // Subtítulo
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitulo, 14, 32);
    
    // Fecha de generación
    const fecha = new Date().toLocaleDateString('es-ES');
    doc.text(`Generado el: ${fecha}`, 14, 42);
    
    // Calcular posición inicial para la tabla
    let startY = 50; // Posición base
    
    // Resumen
    if (resumen) {
      doc.setFontSize(14);
      doc.setTextColor(33, 33, 33);
      doc.text('Resumen', 14, 55);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      let yPos = 65;
      
      Object.keys(resumen).forEach(key => {
        const valor = resumen[key];
        const texto = `${key}: ${valor}`;
        doc.text(texto, 14, yPos);
        
        // Calcular el alto del texto para el siguiente elemento
        const altoTexto = this.calcularAltoTexto(texto);
        yPos += Math.max(8, altoTexto); // Mínimo 8mm, o el alto calculado si es mayor
      });
      
      // Calcular la nueva posición para la tabla basada en el final del resumen
      startY = yPos + 20; // Agregar espacio adicional después del resumen
    }
    
    // Agregar tabla
    if (datos.length > 0) {
      autoTable(doc, {
        head: [columnas],
        body: datos,
        startY: startY,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: startY },
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('No hay datos para mostrar', 14, startY + 10);
    }
    
    // Guardar PDF
    doc.save(`${nombreArchivo}_${fecha.replace(/\//g, '-')}.pdf`);
  }

  /**
   * Genera un PDF capturando un elemento HTML
   */
  async generarPdfDesdeElemento(
    elementoId: string,
    nombreArchivo: string
  ): Promise<void> {
    const elemento = document.getElementById(elementoId);
    if (!elemento) {
      console.error('Elemento no encontrado');
      return;
    }

    try {
      const canvas = await html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fecha = new Date().toLocaleDateString('es-ES');
      pdf.save(`${nombreArchivo}_${fecha.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  }
} 