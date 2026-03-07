import React from "react";
import { THEME } from "@/utils/theme";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";

const PageHeader = ({
  icon: Icon,
  title,
  subtitle,
  actions,
  addPath,
  addText,
  addIcon: AddIcon = Plus,
  moduleName,
  className = ""
}) => {
  const navigate = useNavigate();
  const { canAdd } = usePermissions();

  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`p-2 rounded-lg ${THEME.colors.primary} text-white shadow-lg shadow-blue-900/20`}>
            {React.isValidElement(Icon) ? Icon : <Icon size={24} />}
          </div>
        )}
        <div>
          <h1 className={`text-2xl font-bold ${THEME.colors.accent} tracking-tight`}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-500 text-sm">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {addPath && canAdd(moduleName) && (
          <Button
            onClick={() => navigate(addPath)}
            size="sm"
            className={`${THEME.colors.secondary} ${THEME.colors.accent} font-bold shadow-md hover:opacity-90 hover:text-white h-9`}
          >
            <AddIcon className="mr-2 h-4 w-4" /> {addText}
          </Button>
        )}
        {actions && actions}
      </div>
    </div>
  );
};

export default PageHeader;
