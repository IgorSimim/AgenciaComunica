'use client'

import { useActionState, useState, useEffect, useContext } from "react"
import Form from "next/form"
import { Loader2 as SpinnerIcon } from "lucide-react"
import { EmpresaContext } from "@/app/context/EmpresaContext"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "sonner"

interface LoginState {
  error?: string
  success?: boolean
}

async function handlerEmpresaLogin(prevState: LoginState | null, formData: FormData): Promise<LoginState> {
  const email = formData.get('email') as string
  const senha = formData.get('senha') as string

  try {
    const response = await fetch("http://localhost:3004/loginempresa", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, senha }),
    })

    const dados = await response.json()

    if (response.ok && dados.token) {
      return { success: true }
    } else {
      return { error: dados.msg || "Erro! Login ou senha incorreta." }
    }
  } catch (error) {
    return { error: "Erro de conexão. Tente novamente." }
  }
}

export default function EmpresaLoginForm() {
  const [state, formAction, isPending] = useActionState(handlerEmpresaLogin, null)
  const { mudaLogin } = useContext(EmpresaContext)
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)
  const [wasPending, setWasPending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})

  const isFormValid = email.trim() !== "" && senha.trim() !== ""

  useEffect(() => {
    if (wasPending && !isPending) {
      if (state?.success) {
        // Login bem-sucedido - processar no cliente
        fetch("http://localhost:3004/loginempresa", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ email, senha }),
        })
          .then(response => response.json())
          .then(dados => {
            if (dados.token) {
              localStorage.setItem('isLoggedIn', 'true')
              localStorage.setItem('token', dados.token)
              localStorage.setItem('codEmpresaLogado', String(dados.empresa.cod))
              localStorage.setItem('nomeEmpresaLogado', dados.empresa.nome)
              localStorage.setItem('logotipoEmpresaLogado', dados.empresa.logotipo)

              mudaLogin({
                cod: dados.empresa.cod,
                nome: dados.empresa.nome,
                logotipo: dados.empresa.logotipo
              })

              toast.success("Login realizado com sucesso")
              router.push("/")
            }
          })
      } else if (state?.error) {
        // Tratar erros
        if (state.error.toLowerCase().includes("email")) {
          setFieldErrors((prev) => ({ ...prev, email: state.error! }))
        } else if (state.error.toLowerCase().includes("senha")) {
          setFieldErrors((prev) => ({ ...prev, senha: state.error! }))
        }
        setLastError(state.error)
        toast.error(state.error)
      }
    }
    setWasPending(isPending)
    if (!state?.error && lastError) {
      setLastError(null)
    }
  }, [state, isPending, wasPending, lastError, email, senha, mudaLogin, router])

  function validateFields() {
    const errors: { [key: string]: string } = {}
    if (!email.trim()) errors.email = 'O campo de Email é obrigatório.'
    if (!senha.trim()) errors.senha = 'O campo de senha é obrigatório.'
    return errors
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    setFieldErrors({})
    const errors = validateFields()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      e.preventDefault()
    }
  }

  function handleInputChange(field: string, value: string, setter: (v: string) => void) {
    setter(value)
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const { [field]: _, ...rest } = prev
      return rest
    })
  }

  return (
    <div className="flex h-screen">
      {/* Seção de imagem à esquerda */}
      <div className="w-1/2 h-full bg-cover bg-center" style={{ backgroundImage: 'url("/login/img-login.jpg")' }}></div>

      {/* Seção do formulário de login à direita */}
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
        <div className="max-w-lg w-full p-10 bg-gray-100 rounded-lg shadow-xl">
          <img src="/logo2.png" className="mx-auto mb-6" alt="Logo de login" />

          <Form action={formAction} onSubmit={handleFormSubmit}>
            <div className="mb-6">
              <input
                type="text"
                id="email"
                name="email"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300 text-black"
                placeholder="Digite o email da sua empresa"
                required
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
              />
              {fieldErrors.email && <span className="text-red-500 text-xs mt-1 block">{fieldErrors.email}</span>}
            </div>

            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="senha"
                name="senha"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300 text-black focus:text-black"
                placeholder="Digite sua senha"
                required
                value={senha}
                onChange={(e) => handleInputChange('senha', e.target.value, setSenha)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-yellow-500 mb-7"
              >
                {showPassword ? (
                  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                    <path d="M12.01 20c-5.065 0-9.586-4.211-12.01-8.424 2.418-4.103 6.943-7.576 12.01-7.576 5.135 0 9.635 3.453 11.999 7.564-2.241 4.43-6.726 8.436-11.999 8.436zm-10.842-8.416c.843 1.331 5.018 7.416 10.842 7.416 6.305 0 10.112-6.103 10.851-7.405-.772-1.198-4.606-6.595-10.851-6.595-6.116 0-10.025 5.355-10.842 6.584zm10.832-4.584c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 1c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4z" />
                  </svg>
                ) : (
                  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                    <path d="M8.137 15.147c-.71-.857-1.146-1.947-1.146-3.147 0-2.76 2.241-5 5-5 1.201 0 2.291.435 3.148 1.145l1.897-1.897c-1.441-.738-3.122-1.248-5.035-1.248-6.115 0-10.025 5.355-10.842 6.584.529.834 2.379 3.527 5.113 5.428l1.865-1.865zm6.294-6.294c-.673-.53-1.515-.853-2.44-.853-2.207 0-4 1.792-4 4 0 .923.324 1.765.854 2.439l5.586-5.586zm7.56-6.146l-19.292 19.293-.708-.707 3.548-3.548c-2.298-1.612-4.234-3.885-5.548-6.169 2.418-4.103 6.943-7.576 12.01-7.576 2.065 0 4.021.566 5.782 1.501l3.501-3.501.707.707zm-2.465 3.879l-.734.734c2.236 1.619 3.628 3.604 4.061 4.274-.739 1.303-4.546 7.406-10.852 7.406-1.425 0-2.749-.368-3.951-.938l-.748.748c1.475.742 3.057 1.19 4.699 1.19 5.274 0 9.758-4.006 11.999-8.436-1.087-1.891-2.63-3.637-4.474-4.978zm-3.535 5.414c0-.554-.113-1.082-.317-1.562l.734-.734c.361.69.583 1.464.583 2.296 0 2.759-2.24 5-5 5-.832 0-1.604-.223-2.295-.583l.734-.735c.48.204 1.007.318 1.561.318 2.208 0 4-1.792 4-4z" />
                  </svg>
                )}
              </button>
              {fieldErrors.senha && <span className="text-red-500 text-xs mt-1 block">{fieldErrors.senha}</span>}
              <div className="text-right mt-2">
                <p className="text-blue-700 underline cursor-pointer">Esqueceu a senha?</p>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={!isFormValid || isPending}
                className={`w-3/4 py-3 text-white text-lg font-semibold rounded-full transition duration-300 ${isFormValid && !isPending
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-gray-400 cursor-not-allowed"
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

      <Toaster position="top-right" richColors />
    </div>
  )
}