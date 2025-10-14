import { EmpresaLogin } from "@/app/types";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function handlerLogin(
    _prevState: any,
    formData: FormData
) {
    const entries = Array.from(formData.entries());
    const data = Object.fromEntries(entries) as EmpresaLogin;

    if (!data.email) {
        return {
            error: "O campo de email é obrigatório.",
            success: false,
        };
    }
    if (!data.senha) {
        return {
            error: "O campo de senha é obrigatório.",
            success: false,
        };
    }

    const result = await signIn("credentials", {
        email: data.email,
        senha: data.senha,
        redirect: false,
    });

    if (result?.error) {
        let errorMessage = result.error;

        if (errorMessage.toLowerCase().includes("email") || errorMessage.toLowerCase().includes("senha")) {
            errorMessage = "Email ou senha incorretos. Por favor, tente novamente.";
        } else if (errorMessage.includes("Erro ao conectar com o servidor")) {
            errorMessage = "Não foi possível conectar ao servidor. Tente novamente mais tarde.";
        }

        return {
            error: errorMessage,
            success: false,
        };
    }

    return redirect("/home-empresa");
}