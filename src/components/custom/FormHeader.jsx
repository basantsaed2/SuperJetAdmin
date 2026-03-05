// src/components/ui/custom/FormHeader.jsx
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const FormHeader = ({ 
  title, 
  subtitle, 
  onBackClick,
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-4">
        {onBackClick && (
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full shadow-sm hover:bg-slate-50 h-9 w-9"
            onClick={onBackClick}
          >
            <ArrowLeft size={18} />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-[#003366] tracking-tight">
            {title}
          </h1>
          {/* {subtitle && (
            <p className="text-sm text-slate-500 italic">
              {subtitle}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
