import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type ConfirmDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "secondary" | "destructive" | "outline"
  loading?: boolean
  loadingText?: string
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirmation",
  description = "Are you sure?",
  confirmText = "Yes",
  cancelText = "Cancel",
  variant = "destructive",
  loading = false,
  loadingText = "Processing..."
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="p-4">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="bg-muted/50 border-t p-4 overflow-hidden">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button 
            variant={variant} 
            onClick={() => { 
              onConfirm(); 
              onClose(); 
            }} 
            disabled={loading}
          >
            {loading ? loadingText : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}