'use client'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'

type Inputs = {
  email: string
  senha: string
}

export default function ContratadoLoginForm() {
  const { register, handleSubmit, setFocus } = useForm<Inputs>()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  async function verificaLogin(data: Inputs) {
    try {
      const response = await fetch("/api/logincontratado", {
        method: "POST",
        headers: { "Content-type": "Application/json" },
        body: JSON.stringify({ email: data.email, senha: data.senha }),
      })

      const result = await response.json()

      if (response.status === 200) {
        Cookies.set("contr_logado_id", result.id)
        Cookies.set("contr_logado_nome", result.nome)
        Cookies.set("contr_logado_token", result.token)

        toast.success("Login realizado com sucesso!")
        router.push("/principal")
      } else {
        switch (result.id) {
          case 1:
            toast.error("Por favor, informe o e-mail e a senha.")
            break
          case 2:
            toast.error("Funcionário não encontrado.")
            break
          case 4:
            toast.error("Login ou senha inválidos.")
            break
          default:
            toast.error("Erro desconhecido. Tente novamente.")
        }
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error)
      toast.error("Ocorreu um problema ao conectar com o servidor.")
    }
  }

  useEffect(() => {
    setFocus("email")
  }, [])

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-900">
      <div className="bg-white rounded-full p-4 mt-10 shadow-md">
        <img
          src="./logo2.png"
          alt="Logo Agência Comunica"
          className="w-65"
        />
      </div>
      <div className="bg-gray-800 shadow-md rounded-xl p-8 w-full max-w-md mt-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-yellow-400">
          Área Administrativa
        </h1>
        <form onSubmit={handleSubmit(verificaLogin)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-base font-medium text-gray-300"
            >
              E-mail de Acesso
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-700 border border-gray-600 text-white text-base rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
              placeholder="seuemail@exemplo.com"
              required
              {...register("email")}
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-2 text-base font-medium text-gray-300"
            >
              Senha
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="bg-gray-700 border border-gray-600 text-white text-base rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
              placeholder="********"
              required
              {...register("senha")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-yellow-500 mt-8"
            >
              {showPassword ? (
                <svg
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  fillRule="evenodd"
                  clipRule="evenodd"
                >
                  <path d="M12.01 20c-5.065 0-9.586-4.211-12.01-8.424 2.418-4.103 6.943-7.576 12.01-7.576 5.135 0 9.635 3.453 11.999 7.564-2.241 4.43-6.726 8.436-11.999 8.436zm-10.842-8.416c.843 1.331 5.018 7.416 10.842 7.416 6.305 0 10.112-6.103 10.851-7.405-.772-1.198-4.606-6.595-10.851-6.595-6.116 0-10.025 5.355-10.842 6.584zm10.832-4.584c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 1c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4z" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  fillRule="evenodd"
                  clipRule="evenodd"
                >
                  <path d="M8.137 15.147c-.71-.857-1.146-1.947-1.146-3.147 0-2.76 2.241-5 5-5 1.201 0 2.291.435 3.148 1.145l1.897-1.897c-1.441-.738-3.122-1.248-5.035-1.248-6.115 0-10.025 5.355-10.842 6.584.529.834 2.379 3.527 5.113 5.428l1.865-1.865zm6.294-6.294c-.673-.53-1.515-.853-2.44-.853-2.207 0-4 1.792-4 4 0 .923.324 1.765.854 2.439l5.586-5.586zm7.56-6.146l-19.292 19.293-.708-.707 3.548-3.548c-2.298-1.612-4.234-3.885-5.548-6.169 2.418-4.103 6.943-7.576 12.01-7.576 2.065 0 4.021.566 5.782 1.501l3.501-3.501.707.707zm-2.465 3.879l-.734.734c2.236 1.619 3.628 3.604 4.061 4.274-.739 1.303-4.546 7.406-10.852 7.406-1.425 0-2.749-.368-3.951-.938l-.748.748c1.475.742 3.057 1.19 4.699 1.19 5.274 0 9.758-4.006 11.999-8.436-1.087-1.891-2.63-3.637-4.474-4.978zm-3.535 5.414c0-.554-.113-1.082-.317-1.562l.734-.734c.361.69.583 1.464.583 2.296 0 2.759-2.24 5-5 5-.832 0-1.604-.223-2.295-.583l.734-.735c.48.204 1.007.318 1.561.318 2.208 0 4-1.792 4-4z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-medium rounded-lg text-base px-5 py-2.5 hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
