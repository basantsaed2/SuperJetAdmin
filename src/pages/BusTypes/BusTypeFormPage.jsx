import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, AlertCircle } from "lucide-react";

// Components & UI
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/custom/FormInput";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import FormHeader from "@/components/ui/custom/FormHeader";

// 1. تعريف الـ Validation Schema باستخدام Zod
const busTypeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1 seat"),
  description: z.string().min(5, "Description is too short").optional().or(z.literal("")),
});

const BusTypeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // 2. استخدام useGet لجلب البيانات في حالة التعديل فقط
  const { data: response, isLoading: isFetching, error: fetchError } = useGet(
    ["busType", id],
    `/api/admin/busTypes/${id}`,
    { enabled: isEditMode }
  );

  // 3. إعداد React Hook Form مع Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(busTypeSchema),
    defaultValues: {
      name: "",
      capacity: "",
      description: "",
    },
  });

  // 4. تعبئة الفورم بالبيانات عند نجاح الـ Fetch (Edit Mode)
  React.useEffect(() => {
    if (isEditMode && response?.data?.busType) {
      const bus = response.data.busType;
      reset({
        name: bus.name,
        capacity: bus.capacity,
        description: bus.description || "",
      });
    }
  }, [response, reset, isEditMode]);

  // 5. دالة الإرسال (POST للـ Add و PUT للـ Edit)
  const onSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await axiosInstance.put(`/api/admin/busTypes/${id}`, formData);
        toast.success("Bus Type updated successfully!");
      } else {
        await axiosInstance.post("/api/admin/busTypes", formData);
        toast.success("New Bus Type created successfully!");
      }
      navigate("/bus_types"); // العودة للجدول
    } catch (error) {
      const msg = error.response?.data?.message || "An error occurred";
      toast.error(msg);
    }
  };

  if (isEditMode && isFetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-900" size={40} />
        <p className="text-slate-500 animate-pulse">Fetching bus type details...</p>
      </div>
    );
  }

  if (isEditMode && fetchError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="text-red-500 mb-2" size={40} />
        <h2 className="text-xl font-bold">Failed to load data</h2>
        <Button variant="link" onClick={() => navigate("/bus_types")}>Back to list</Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormHeader 
        title={isEditMode ? "Edit Bus Category" : "Add New Fleet Type"}
        subtitle={isEditMode ? `Updating ID: ${id}` : "Configure a new vehicle specification"}
        onBackClick={() => navigate("/bus_types")} 
      />

      {/* Form Container */}
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Bus Type Name"
            name="name"
            register={register}
            errors={errors}
            placeholder="Enter bus type name"
          />

          <FormInput
            label="Seating Capacity"
            name="capacity"
            type="number"
            register={register}
            errors={errors}
            placeholder="Enter seating capacity"
          />
        </div>

        <FormInput
          label="Detailed Description"
          name="description"
          type="textarea"
          register={register}
          errors={errors}
          placeholder="Enter vehicle amenities (AC, WiFi, USB, etc.)"
          rows={5}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
          <Button
            type="button"
            variant="ghost"
            className="h-9 px-6 text-slate-500 hover:text-slate-800 text-sm font-medium"
            onClick={() => navigate("/bus_types")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="sm"
            className={`min-w-[120px] h-9 text-sm font-bold transition-all text-white ${THEME.colors.primary} hover:opacity-90 shadow-md shadow-yellow-400/10`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : (
              <Save className="mr-2" size={16} />
            )}
            {isEditMode ? "Save Changes" : "Create Type"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusTypeFormPage;