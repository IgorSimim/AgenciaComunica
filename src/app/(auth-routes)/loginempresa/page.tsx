'use client'
import EmpresaLoginForm from "./form-login"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"

export default function LoginEmpresaPage() {
  return (
    <>
      <Header />
      <main>
        <EmpresaLoginForm />
      </main>
      <Footer />
    </>
  )
}