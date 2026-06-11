export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      fichas: {
        Row: {
          id: number;
          orden: number;
          slug: string;
          sector: string;
          pregunta: string;
          lo_que_dice: string;
          traduccion: string;
          impacto: string;
          fuentes: Json;
          icono: string;
          created_at: string;
        };
        Insert: {
          id?: never;
          orden: number;
          slug: string;
          sector: string;
          pregunta: string;
          lo_que_dice: string;
          traduccion: string;
          impacto: string;
          fuentes?: Json;
          icono?: string;
          created_at?: string;
        };
        Update: {
          id?: never;
          orden?: number;
          slug?: string;
          sector?: string;
          pregunta?: string;
          lo_que_dice?: string;
          traduccion?: string;
          impacto?: string;
          fuentes?: Json;
          icono?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      noticias: {
        Row: {
          id: number;
          slug: string;
          titular: string;
          resumen: string;
          fecha: string | null;
          periodista: string | null;
          medio: string | null;
          region: string | null;
          tema: string | null;
          link: string;
          created_at: string;
        };
        Insert: {
          id?: never;
          slug: string;
          titular: string;
          resumen: string;
          fecha?: string | null;
          periodista?: string | null;
          medio?: string | null;
          region?: string | null;
          tema?: string | null;
          link: string;
          created_at?: string;
        };
        Update: {
          id?: never;
          slug?: string;
          titular?: string;
          resumen?: string;
          fecha?: string | null;
          periodista?: string | null;
          medio?: string | null;
          region?: string | null;
          tema?: string | null;
          link?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      enlaces: {
        Row: {
          id: number;
          tema: string;
          fecha: string | null;
          titulo: string;
          url: string;
          tipo: string | null;
          observacion: string | null;
          fuente: string;
          orden: number;
          created_at: string;
        };
        Insert: {
          id?: never;
          tema: string;
          fecha?: string | null;
          titulo: string;
          url: string;
          tipo?: string | null;
          observacion?: string | null;
          fuente?: string;
          orden?: number;
          created_at?: string;
        };
        Update: {
          id?: never;
          tema?: string;
          fecha?: string | null;
          titulo?: string;
          url?: string;
          tipo?: string | null;
          observacion?: string | null;
          fuente?: string;
          orden?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
