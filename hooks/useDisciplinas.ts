import { useEffect, useState } from "react";
import axios from "axios";

export type Disciplina = {
  id: number;
  nome: string;
  codigo: string;
  obrigatoria: string;
  periodo: string;
};

const API_URL = "http://192.168.1.24:8000"; // seu IP local

export function useDisciplinas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/disciplinas`)
      .then(res => setDisciplinas(res.data))
      .catch(err => console.error("Erro ao buscar disciplinas:", err))
      .finally(() => setLoading(false));
  }, []);

  return { disciplinas, loading };
}
