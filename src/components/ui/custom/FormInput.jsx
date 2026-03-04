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
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Search, X, Check, ChevronDown } from "lucide-react";
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
          // Focus input after a short delay for Radix to mount Content
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      }}
    >
      <SelectTrigger className={cn(hasError && "border-red-500", "w-full")}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent side="bottom" position="popper" className="w-[var(--radix-select-trigger-width)] z-[150] bg-white border-slate-200 p-0 shadow-2xl overflow-hidden">
        <div className="sticky top-0 bg-white p-2 border-b z-40">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              ref={inputRef}
              placeholder={t('search_by')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === ' ') e.stopPropagation();
              }}
              className="h-9 text-xs pl-8 pr-3 focus-visible:ring-0 focus-visible:ring-offset-0 bg-slate-50 border-slate-100"
            />
          </div>
        </div>
        <div className="p-1 max-h-[220px] overflow-y-auto bg-white">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-sm">
                {opt.label}
              </SelectItem>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
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
            "w-full justify-between h-auto min-h-[40px] px-3 py-2 font-normal hover:bg-transparent border-input text-left bg-white",
            hasError && "border-red-500",
            !value.length && "text-muted-foreground"
          )}
        >
          <div className="flex flex-wrap gap-1 items-center overflow-hidden">
            {value.length > 0 ? (
              value.length > 2 ? (
                <span className="text-sm text-slate-700 font-medium">{value.length} {t('selected')}</span>
              ) : (
                selectedLabels.map(label => (
                  <span key={label} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">
                    {label}
                  </span>
                ))
              )
            ) : (
              <span className="text-sm">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        side="bottom" 
        align="start" 
        className="w-[var(--radix-dropdown-menu-trigger-width)] z-[150] bg-white border-slate-200 p-0 shadow-2xl overflow-hidden"
      >
        <div className="sticky top-0 bg-white p-2 border-b z-40">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              ref={inputRef}
              placeholder={t('search_by')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === ' ') e.stopPropagation();
              }}
              className="h-9 text-xs pl-8 pr-3 focus-visible:ring-0 focus-visible:ring-offset-0 bg-slate-50 border-slate-100"
            />
          </div>
        </div>
        <div className="p-1 max-h-[220px] overflow-y-auto bg-white font-sans">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.value}
                checked={value.includes(opt.value)}
                onCheckedChange={() => toggleOption(opt.value)}
                onSelect={(e) => e.preventDefault()}
                className="text-sm py-2 cursor-pointer"
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
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
              "focus-visible:ring-[#FFCC00]",
              hasError && "border-red-500 focus-visible:ring-red-500"
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

      default:
        return (
          <Input
            type={type}
            {...register(name)}
            placeholder={placeholder}
            className={cn(
              "focus-visible:ring-[#FFCC00]",
              hasError && "border-red-500 focus-visible:ring-red-500"
            )}
            {...props}
          />
        );
    }
  };

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 ml-1">
          {label}
        </label>
      )}

      {renderInput()}

      {hasError && (
        <p className="text-[11px] text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
          {errors[name]?.message || t('this_field_is_required') || "This field is required"}
        </p>
      )}
    </div>
  );
};