import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'

export default function ConfirmationModal({
                                              open,
                                              onOpenChange,
                                              onConfirm,
                                              title = "Confirm Deletion",
                                              description = "Are you sure you want to delete this task?"
                                          }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    title?: string
    description?: string
}) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg focus:outline-none">
                    <Dialog.Title className="text-lg font-medium mb-2">
                        {title}
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-600 mb-4">
                        {description}
                    </Dialog.Description>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                onConfirm()
                                onOpenChange(false)
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}