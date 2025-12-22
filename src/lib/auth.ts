import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuthRedirect(requiredUserType: "empresa" | "funcionario") {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      const redirectPath = requiredUserType === "empresa" ? "/loginempresa" : "/loginfuncionario";
      router.push(redirectPath);
      return;
    }

    const hasRequiredAuth = requiredUserType === "empresa" 
      ? (session as any)?.empresa 
      : (session as any)?.funcionario;

    if (!hasRequiredAuth) {
      const redirectPath = requiredUserType === "empresa" ? "/loginempresa" : "/loginfuncionario";
      router.push(redirectPath);
    }
  }, [session, status, requiredUserType, router]);

  return { session, status, isAuthenticated: !!session };
}

export function useAuth() {
  const { data: session } = useSession();
  
  return {
    session,
    empresa: (session as any)?.empresa,
    funcionario: (session as any)?.funcionario,
    isEmpresa: !!(session as any)?.empresa,
    isFuncionario: !!(session as any)?.funcionario,
    isAuthenticated: !!session
  };
}