'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Fuel, DollarSign, Users, Settings, LogOut, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

const Navigation = () => {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/manager/dashboard',
      active: pathname === '/manager/dashboard',
    },
    {
      label: 'Fuel Management',
      icon: Fuel,
      href: '/manager/fuel',
      active: pathname === '/manager/fuel',
    },
    {
      label: 'Sales',
      icon: DollarSign,
      href: '/manager/sales',
      active: pathname === '/manager/sales',
    },
    {
      label: 'HR',
      icon: Users,
      href: '/manager/hr',
      active: pathname === '/manager/hr',
    },
    {
      label: 'Customers',
      icon: UserCircle,
      href: '/manager/customers',
      active: pathname === '/manager/customers',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/manager/settings',
      active: pathname === '/manager/settings',
    },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-background-secondary border-b border-ui-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'text-sm group flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200',
                  route.active 
                    ? 'text-text-accent bg-brand-primary/20' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-accent'
                )}
              >
                <route.icon className={cn(
                  'w-5 h-5 transition-colors duration-200',
                  route.active ? 'text-brand-primary' : 'text-text-secondary group-hover:text-text-primary'
                )} />
                <span className="font-medium">{route.label}</span>
              </Link>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-text-primary hover:bg-background-accent transition-colors duration-200"
            onClick={() => signOut()}
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 