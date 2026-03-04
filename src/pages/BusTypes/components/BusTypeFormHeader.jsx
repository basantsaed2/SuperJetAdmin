// src/pages/BusTypes/components/BusTypeFormHeader.jsx
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BusTypeFormHeader = ({ isEditMode, id, onBackClick }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full shadow-sm hover:bg-slate-50 h-9 w-9"
          onClick={onBackClick}
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#003366] tracking-tight">
            {isEditMode ? "Edit Bus Category" : "Add New Fleet Type"}
          </h1>
          <p className="text-sm text-slate-500 italic">
            {isEditMode ? `Updating ID: ${id}` : "Configure a new vehicle specification"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusTypeFormHeader;
