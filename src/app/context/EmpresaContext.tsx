'use client'
import { ReactNode, createContext, useState, useEffect } from "react";

interface EmpresaProps {
  cod: number | null;
  nome: string;
  logotipo: string;
}

type EmpresaContextData = {
  codEmpresaLogado: number | null;
  nomeEmpresaLogado: string;
  logotipoEmpresaLogado: string;
  mudaLogin: ({ cod, nome, logotipo }: EmpresaProps) => void;
};

export const EmpresaContext = createContext({} as EmpresaContextData);

function EmpresaProvider({ children }: { children: ReactNode }) {
  const [codEmpresaLogado, setCodEmpresaLogado] = useState<number | null>(null);
  const [nomeEmpresaLogado, setNomeEmpresaLogado] = useState<string>("");
  const [logotipoEmpresaLogado, setLogotipoEmpresaLogado] = useState<string>("");

  useEffect(() => {
    const cod = localStorage.getItem("codEmpresaLogado");
    const nome = localStorage.getItem("nomeEmpresaLogado");
    const logotipo = localStorage.getItem("logotipoEmpresaLogado");

    if (cod && nome && logotipo) {
      setCodEmpresaLogado(Number(cod));
      setNomeEmpresaLogado(nome);
      setLogotipoEmpresaLogado(logotipo);
    }
  }, []);

  useEffect(() => {
    if (codEmpresaLogado && nomeEmpresaLogado && logotipoEmpresaLogado) {
      console.log("Login realizado:", { codEmpresaLogado, nomeEmpresaLogado, logotipoEmpresaLogado });
    }
  }, [codEmpresaLogado, nomeEmpresaLogado, logotipoEmpresaLogado]);

  function mudaLogin({ cod, nome, logotipo }: EmpresaProps) {
    setCodEmpresaLogado(cod);
    setNomeEmpresaLogado(nome);
    setLogotipoEmpresaLogado(logotipo);

    localStorage.setItem("codEmpresaLogado", String(cod));
    localStorage.setItem("nomeEmpresaLogado", nome);
    localStorage.setItem("logotipoEmpresaLogado", logotipo);
  }

  return (
    <EmpresaContext.Provider value={{ codEmpresaLogado, nomeEmpresaLogado, logotipoEmpresaLogado, mudaLogin }}>
      {children}
    </EmpresaContext.Provider>
  );
}

export default EmpresaProvider;
