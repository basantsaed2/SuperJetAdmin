// src/pages/BusTypes/components/BusTypesHeader.jsx
import React from "react";
import { Plus, BusFront, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { THEME } from "@/utils/theme";

const BusTypesHeader = ({ isLoading, refetch, onAddClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${THEME.colors.primary} text-white shadow-lg shadow-blue-900/20`}>
          <BusFront size={24} />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${THEME.colors.accent} tracking-tight`}>Bus Types</h1>
          <p className="text-slate-500 text-sm">Manage fleet categories and seating capacities</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={refetch}
          disabled={isLoading}
          className="border-slate-200 hover:bg-slate-50 h-9 w-9"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
        
        <Button 
          onClick={onAddClick}
          size="sm"
          className={`${THEME.colors.secondary} ${THEME.colors.accent} font-bold shadow-md hover:opacity-90 hover:text-white h-9`}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Type
        </Button>
      </div>
    </div>
  );
};

export default BusTypesHeader;
