// src/components/ui/custom/PageHeader.jsx
import React from "react";
import { THEME } from "@/utils/theme";

const PageHeader = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  actions,
  className = "" 
}) => {
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

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
