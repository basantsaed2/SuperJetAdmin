// src/components/ui/custom/FormInput.jsx
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  ...props
}) => {
  const hasError = errors && errors[name];

  // دالة داخلية لتحديد المكون المطلوب بناءً على النوع
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
        return (
          <Select
            onValueChange={(value) =>
              register(name).onChange({ target: { value, name } })
            }
            defaultValue={props.defaultValue}
          >
            <SelectTrigger className={cn(hasError && "border-red-500")}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        // يشمل text, number, email, password, إلخ
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
          {errors[name]?.message || "This field is required"}
        </p>
      )}
    </div>
  );
};