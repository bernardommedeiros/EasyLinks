type LinkSectionProps = {
  title: string
  description?: string
  children: React.ReactNode
}

export function LinkSection({ title, description, children }: LinkSectionProps) {
  return (
    <section className="p-6 max-w-5xl mx-auto bg-slate-100">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      <div className="p-3 max-w-5xl mx-auto overflow-x-auto">
        <div className="border rounded-lg">{children}</div>
      </div>
    </section>
  )
}
