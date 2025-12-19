
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full w-full min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col h-full bg-slate-900 text-white p-10 hidden lg:flex">
         <div className="flex items-center gap-2 text-2xl font-bold mb-auto">
             <div className="h-8 w-8 bg-primary rounded-lg"></div> Financeira
         </div>
         <div className="mt-auto max-w-lg">
             <h1 className="text-4xl font-bold mb-6">Controle total sobre suas finanças</h1>
             <p className="text-slate-300 text-lg">
                 Gerencie receitas, despesas, cartões, dívidas e metas em um único lugar. 
                 Sua liberdade financeira começa com organização.
             </p>
         </div>
      </div>
      <div className="flex flex-col items-center justify-center p-8 h-full bg-background">
          <div className="w-full max-w-sm flex items-center mb-8 lg:hidden">
            <div className="h-8 w-8 bg-primary rounded-lg mr-2"></div> 
            <span className="text-2xl font-bold">Financeira</span>
          </div>
          {children}
      </div>
    </div>
  )
}
