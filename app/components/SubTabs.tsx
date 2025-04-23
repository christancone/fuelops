'use client'

interface Tab {
  value: string
  label: string
  icon?: React.ReactNode
}

interface SubTabsProps {
  tabs: Tab[]
  defaultValue: string
  onChange: (value: string) => void
}

const SubTabs = ({ tabs, defaultValue, onChange }: SubTabsProps) => {
  return (
    <div className="border-b border-ui-border bg-background-secondary">
      <nav className="flex space-x-4 px-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`
              flex items-center space-x-2 py-4 px-2 text-sm font-medium border-b-2 transition-colors duration-200
              ${
                defaultValue === tab.value
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-ui-border'
              }
            `}
          >
            {tab.icon && <span className="text-current">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default SubTabs 