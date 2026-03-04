// d:/SuperJetAdmin/src/components/ui/custom/RolePermissionsDialog.jsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ShieldCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const RolePermissionsDialog = ({ 
  isOpen, 
  onClose, 
  role
}) => {
  const { t } = useTranslation();

  // Normalize permissions to always be an array of objects
  // Some roles might have ["perm1", "perm2"] while others have [{module: "X", actions: []}]
  const permissions = React.useMemo(() => {
    if (!role?.permissions) return [];
    return role.permissions.map(p => {
      if (typeof p === 'string') {
        return { module: p, actions: [] };
      }
      return p;
    });
  }, [role?.permissions]);

  if (!role) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <ShieldCheck size={20} />
              </div>
              <div>
                <DialogPrimitive.Title className="text-xl font-bold text-slate-900 leading-none">
                  {role.name}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-slate-500 text-xs mt-1.5 uppercase tracking-widest font-bold opacity-70">
                  {t('view_permissions')}
                </DialogPrimitive.Description>
              </div>
            </div>
            <DialogPrimitive.Close asChild>
              <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {permissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissions.map((modulePerm, idx) => (
                  <div 
                    key={`${modulePerm.module}-${idx}`}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-sm transition-all"
                  >
                      <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <h4 className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                        {t(modulePerm?.module?.toLowerCase() || "") || modulePerm?.module}
                      </h4>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {modulePerm?.actions?.length > 0 ? (
                        modulePerm.actions.map((action, actionIdx) => (
                          <span 
                            key={`${action.id}-${actionIdx}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider"
                          >
                            {action.action}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">{t('no_actions')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Shield className="w-12 h-12 text-slate-100 mb-4" />
                <p className="text-slate-500 font-medium">{t('no_permissions_found')}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex justify-end">
             <Button
                variant="outline"
                onClick={onClose}
                className="h-9 px-6 border-slate-200 text-slate-600 font-bold text-sm rounded-xl"
              >
                {t('close')}
              </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default RolePermissionsDialog;
