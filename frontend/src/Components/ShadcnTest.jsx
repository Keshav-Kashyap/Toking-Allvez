import { Button } from "@/components/ui/button"

export default function ShadcnTest() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">shadcn/ui Test</h2>
      <div className="space-x-2">
        <Button>Default Button</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </div>
  )
}