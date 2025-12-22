'use client'
import { useActionState, useState, useEffect } from "react"
import Form from "next/form"
import { Loader2 as SpinnerIcon } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { alerts } from "@/lib/alerts"

interface LoginState {
  error?: string
  success?: boolean
}

async function handlerFuncionarioLogin(prevState: LoginState | null, formData: FormData): Promise<LoginState> {
  const email = formData.get('email') as string
  const senha = formData.get('senha') as string

  try {
    const result = await signIn("credentials", {
      email,
      senha,
      type: "funcionario",
      redirect: false,
    });

    if (result?.ok) {
      return { success: true }
    } else {
      return { error: "Email ou senha incorreta" }
    }
  } catch (error) {
    return { error: "Email ou senha incorreta" }
  }
}

export default function FuncionarioLoginForm() {
  const [state, formAction, isPending] = useActionState(handlerFuncionarioLogin, null)
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)
  const [wasPending, setWasPending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<string | null>(null)

  const isFormValid = email.trim() !== "" && senha.trim() !== ""

  useEffect(() => {
    if (wasPending && !isPending) {
      if (state?.success) {
        alerts.success("Login realizado com sucesso!")
        console.log('Redirecionando para /dashboard');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else if (state?.error) {
        setFieldErrors(state.error)
        setLastError(state.error)
      }
    }
    setWasPending(isPending)
    if (!state?.error && lastError) {
      setLastError(null)
    }
  }, [state, isPending, wasPending, lastError, email, senha, router])

  function validateFields(): string | null {
    if (!email.trim() || !senha.trim()) return 'Email ou senha incorreta'
    return null
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    setFieldErrors(null)
    const error = validateFields()
    setFieldErrors(error)
    if (error) {
      e.preventDefault()
    }
  }

  function handleInputChange(field: string, value: string, setter: (v: string) => void) {
    setter(value)
    if (fieldErrors) {
      setFieldErrors(null)
    }
  }

  return (
    <div className="flex flex-col items-center justify-start bg-gray-900 pt-10 pb-10"> 
      <div className="bg-white rounded-full p-4 shadow-md"> 
        <img
          src="/logo2.png"
          alt="Logo comunica"
          className="w-65"
        />
      </div>
      <div className="bg-gray-800 shadow-md rounded-xl p-8 w-full max-w-md mt-6">
        <h1 className="text-2xl font-semibold text-center mb-6 text-yellow-400">
          Área Administrativa
        </h1>
        
        <Form action={formAction} onSubmit={handleFormSubmit}>
          <input type="hidden" name="type" value="funcionario" />
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-base font-medium text-gray-300"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-gray-700 border border-gray-600 text-white text-base rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 transition-colors"
              placeholder="seuemail@exemplo.com"
              required
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
            />
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="senha"
              className="block mb-2 text-base font-medium text-gray-300"
            >
              Senha
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="senha"
              name="senha"
              className="bg-gray-700 border border-gray-600 text-white text-base rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 transition-colors"
              placeholder="********"
              required
              value={senha}
              onChange={(e) => handleInputChange('senha', e.target.value, setSenha)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-yellow-500 mt-8 transition-colors"
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
            {fieldErrors && <span className="text-red-500 text-xs mt-1 block">{fieldErrors}</span>}
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={!isFormValid || isPending}
              className={`w-full font-medium rounded-lg text-base px-5 py-2.5 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-colors ${
                isFormValid && !isPending
                  ? "bg-yellow-500 text-black hover:bg-yellow-600"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <SpinnerIcon className="animate-spin h-5 w-5 mr-2" />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}