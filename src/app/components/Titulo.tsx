function Titulo() {
  return (
    <nav className="bg-yellow-400 sticky top-0 z-50">
      <div className="container mx-auto flex items-center p-4">
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png"
            className="h-20 w-auto"
            alt="Logo da Agência Comunica"
          />
          <span className="text-black text-2xl font-semibold">
            Setor Administrativo: Agência Comunica Mkt. Digital
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Titulo