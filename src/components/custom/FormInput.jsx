import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Search, X, Check, ChevronDown, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Searchable Single Select ---
const SearchableSelect = ({ options, onValueChange, defaultValue, placeholder, t, hasError }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const inputRef = React.useRef(null);

  const filteredOptions = React.useMemo(() => 
    options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase())),
    [options, searchTerm]
  );

  return (
    <Select 
      onValueChange={onValueChange} 
      defaultValue={defaultValue}
      onOpenChange={(open) => {
        if (open) {
          setSearchTerm("");
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      }}
    >
      <SelectTrigger className={cn(
        "w-full min-h-[48px] h-[48px] px-4 bg-slate-50/50 border-slate-200 transition-all duration-300 rounded-xl shadow-sm",
        "hover:border-blue-300 hover:bg-white hover:shadow-md",
        "focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:shadow-lg focus:bg-white data-[state=open]:bg-white data-[state=open]:border-blue-500",
        hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/10"
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent side="bottom" position="popper" className="w-[var(--radix-select-trigger-width)] z-[150] bg-white/80 backdrop-blur-xl border-slate-200 p-0 shadow-2xl overflow-hidden rounded-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white/50 backdrop-blur-md p-2 border-b border-slate-100 z-40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              ref={inputRef}
              placeholder={t('search_by')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === ' ') e.stopPropagation();
              }}
              className="h-9 text-xs pl-9 pr-3 focus-visible:ring-0 focus-visible:ring-offset-0 bg-slate-100/50 border-transparent rounded-lg"
            />
          </div>
        </div>
        <div className="p-1.5 max-h-[220px] overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-sm rounded-lg py-2 focus:bg-blue-50 focus:text-blue-700 transition-colors">
                {opt.label}
              </SelectItem>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 font-medium">
              {t('no_records_found')}
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
};

// --- Searchable Multi Select ---
const MultiSelect = ({ options, value = [], onChange, placeholder, t, hasError }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const inputRef = React.useRef(null);

  const filteredOptions = React.useMemo(() => 
    options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase())),
    [options, searchTerm]
  );

  const toggleOption = (val) => {
    const newValue = value.includes(val)
      ? value.filter(v => v !== val)
      : [...value, val];
    onChange(newValue);
  };

  const selectAll = () => {
    const allValues = filteredOptions.map(opt => opt.value);
    const areAllSelected = allValues.every(val => value.includes(val));
    
    if (areAllSelected) {
      // If all filtered are selected, unselect them
      onChange(value.filter(val => !allValues.includes(val)));
    } else {
      // Otherwise, select all filtered
      const combined = [...new Set([...value, ...allValues])];
      onChange(combined);
    }
  };

  const selectedLabels = options
    .filter(opt => value.includes(opt.value))
    .map(opt => opt.label);

  return (
    <DropdownMenu onOpenChange={(open) => {
      if (open) {
        setSearchTerm("");
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between h-auto min-h-[48px] px-4 py-2 bg-slate-50/50 border-slate-200 transition-all duration-300 rounded-xl font-normal shadow-sm",
            "hover:bg-white hover:border-blue-300 hover:shadow-md",
            "focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:shadow-lg focus:bg-white data-[state=open]:bg-white data-[state=open]:border-blue-500",
            hasError && "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500/10",
            !value.length && "text-slate-500"
          )}
        >
          <div className="flex flex-wrap gap-1.5 items-center overflow-hidden">
            {value.length > 0 ? (
              value.length > 5 ? (
                <span className="text-sm text-slate-700 font-semibold">{value.length} {t('selected')}</span>
              ) : (
                selectedLabels.map(label => (
                  <span key={label} className="bg-blue-50/80 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-100/50 backdrop-blur-sm">
                    {label}
                  </span>
                ))
              )
            ) : (
              <span className="text-sm">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-40 shrink-0 ml-2 group-data-[state=open]:rotate-180 transition-transform" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        side="bottom" 
        align="start" 
        className="w-[var(--radix-dropdown-menu-trigger-width)] z-[150] bg-white/80 backdrop-blur-xl border-slate-200 p-0 shadow-2xl overflow-hidden rounded-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="sticky top-0 bg-white/50 backdrop-blur-md p-2 border-b border-slate-100 z-40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              ref={inputRef}
              placeholder={t('search_by')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === ' ') e.stopPropagation();
              }}
              className="h-9 text-xs pl-9 pr-3 focus-visible:ring-0 focus-visible:ring-offset-0 bg-slate-100/50 border-transparent rounded-lg"
            />
          </div>
          {filteredOptions.length > 0 && (
            <div className="px-1 mt-1.5 pt-1.5 border-t border-slate-100/50">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  selectAll();
                }}
                className="w-full justify-start text-[10px] h-8 font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg px-2"
              >
                <CheckSquare className="w-3.5 h-3.5 mr-2" />
                {filteredOptions.every(opt => value.includes(opt.value)) ? t('deselect_all') : t('select_all')}
              </Button>
            </div>
          )}
        </div>
        <div className="p-1.5 max-h-[220px] overflow-y-auto font-sans">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.value}
                checked={value.includes(opt.value)}
                onCheckedChange={() => toggleOption(opt.value)}
                onSelect={(e) => e.preventDefault()}
                className="text-sm py-2.5 rounded-lg focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
              >
                <div className="flex-1 font-medium">{opt.label}</div>
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 font-medium">
              {t('no_records_found')}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const FormInput = ({
  label,
  name,
  register,
  errors,
  type = "text",
  placeholder,
  options = [],
  className,
  rows = 3,
  multiple = false,
  setValue,
  watch,
  ...props
}) => {
  const { t } = useTranslation();
  const hasError = errors && errors[name];

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            {...register(name)}
            placeholder={placeholder}
            rows={rows}
            className={cn(
              "bg-slate-50/50 border-slate-200 shadow-sm transition-all duration-300 rounded-xl p-4 min-h-[120px]",
              "hover:border-blue-300 hover:bg-white hover:shadow-md",
              "focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:shadow-lg focus:bg-white",
              hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/10"
            )}
            {...props}
          />
        );

      case "select":
        if (multiple && setValue && watch) {
          const currentValue = watch(name) || [];
          return (
            <MultiSelect
              options={options}
              value={currentValue}
              onChange={(val) => setValue(name, val, { shouldValidate: true })}
              placeholder={placeholder}
              t={t}
              hasError={hasError}
            />
          );
        }
        return (
          <SearchableSelect
            options={options}
            onValueChange={(value) => register(name).onChange({ target: { value, name } })}
            defaultValue={props.defaultValue}
            placeholder={placeholder}
            t={t}
            hasError={hasError}
          />
        );

      case "switch":
        const currentValue = watch(name);
        // If the value is a boolean, treat it as true/false. 
        // If it's the string "active" or "inactive", or something else, use the existing logic.
        const isChecked = typeof currentValue === "boolean" ? currentValue : currentValue === "active";
        
        return (
          <div className={cn(
            "flex items-center gap-4 py-3.5 px-5 transition-all duration-300 rounded-2xl border",
            isChecked 
              ? "bg-green-50/20 border-green-100/50 shadow-sm" 
              : "bg-slate-50/50 border-slate-100 shadow-inner",
            "hover:shadow-md hover:bg-white active:scale-[0.98]"
          )}>
            <Switch
              checked={isChecked}
              onCheckedChange={(checked) => {
                // Determine what value to set: boolean or string "active"/"inactive"
                const newValue = typeof currentValue === "boolean" ? checked : (checked ? "active" : "inactive");
                setValue(name, newValue, { shouldValidate: true });
              }}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-slate-300 shadow-lg"
              {...props}
            />
            <div className="flex flex-col">
              {placeholder && (
                <span className="text-sm font-bold text-slate-700 tracking-tight leading-none mb-1">
                  {placeholder}
                </span>
              )}
              <span className={cn(
                "text-[10px] uppercase font-black tracking-widest transition-colors",
                isChecked ? "text-green-600" : "text-amber-600"
              )}>
                {isChecked ? t('active') : t('inactive')}
              </span>
            </div>
          </div>
        );

      default:
        return (
          <Input
            type={type}
            {...register(name)}
            placeholder={placeholder}
            className={cn(
              "w-full min-h-[48px] h-[48px] px-4 bg-slate-50/50 border-slate-200 shadow-sm transition-all duration-300 rounded-xl",
              "hover:border-blue-300 hover:bg-white hover:shadow-md",
              "focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:shadow-lg focus:bg-white",
              hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/10"
            )}
            {...props}
          />
        );
    }
  };

  return (
    <div className={cn("space-y-2.5 w-full group", className)}>
      {label && (
        <div className="flex items-center gap-1.5 ml-1 select-none">
          <div className="w-0.5 h-3 bg-slate-300 rounded-full group-focus-within:h-4 group-focus-within:bg-blue-500 transition-all duration-300" />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest opacity-80 group-focus-within:text-blue-600 group-focus-within:opacity-100 transition-all">
            {label}
          </label>
        </div>
      )}

      <div className="relative">
        {renderInput()}
      </div>

      {hasError && (
        <p className="text-[10px] text-red-500 font-bold ml-1.5 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <span className="w-1 h-1 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          {errors[name]?.message || t('this_field_is_required')}
        </p>
      )}
    </div>
  );
};