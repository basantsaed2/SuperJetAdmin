// src/components/ui/custom/DeleteConfirmDialog.jsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading = false
}) => {
  const { t } = useTranslation();

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <DialogPrimitive.Title className="text-xl font-bold text-slate-900">
                {t('confirm_delete')}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-slate-500 text-sm">
                {t('delete_item_warning', { name: itemName })}
              </DialogPrimitive.Description>
            </div>

            <div className="flex items-center gap-3 w-full pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 h-11 border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-600/20"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t('delete_now')}
              </Button>
            </div>
          </div>

          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1 opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default DeleteConfirmDialog;
