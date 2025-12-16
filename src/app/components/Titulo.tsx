function Titulo() {
  return (
    <nav className="bg-yellow-400 sticky top-0 z-50">
      <div className="max-w-screen-xl flex items-center mx-auto p-4">
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png"
            className="h-16 sm:h-20"
            alt="Logo Agência Comunica"
          />
          <span className="self-center text-3xl font-semibold text-black">
            Setor Administrativo: Agência Comunica Mkt. Digital
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Titulo