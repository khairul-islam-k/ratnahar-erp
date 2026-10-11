import { DollarSign, Users, ShoppingCart, Activity } from "lucide-react"
import { StatCard } from "./_components/stat-card"
import { RecentOrders } from "./_components/recent-orders"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Revenue" value="$45,231" change="+20.1% from last month" icon={DollarSign} />
        <StatCard title="Users" value="2,350" change="+180 this month" icon={Users} />
        <StatCard title="Orders" value="12,234" change="+19% from last month" icon={ShoppingCart} />
        <StatCard title="Active Now" value="573" change="+201 since last hour" icon={Activity} />
      </div>

      <RecentOrders />
    </div>
  )
}