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
import { useTranslation } from "react-i18next";

const maintenanceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  maintenanceTypeId: z.string().uuid("Please select a valid maintenance type"),
});

const MaintenancesFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { data: response, isLoading: isFetching, error: fetchError } = useGet(
    ["maintenance", id],
    `/api/admin/maintenances/${id}`,
    { enabled: isEditMode }
  );

  // Fetch Maintenance Types for dropdown
  const { data: typesResponse, isLoading: isLoadingTypes } = useGet(
    ["maintenanceTypes"],
    "/api/admin/maintenanceTypes"
  );

  const maintenanceTypesOptions = React.useMemo(() => {
    const typesData = typesResponse?.data?.maintenanceTypes || typesResponse?.maintenanceTypes || [];
    return typesData.map(type => ({
      label: type.name,
      value: type.id
    }));
  }, [typesResponse]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      name: "",
      maintenanceTypeId: "",
    },
  });

  React.useEffect(() => {
    if (isEditMode && response?.data?.maintenance) {
      const maintenance = response.data.maintenance;
      reset({
        name: maintenance.name,
        maintenanceTypeId: maintenance.maintenanceTypeId,
      });
    }
  }, [response, reset, isEditMode]);

  const onSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await axiosInstance.put(`/api/admin/maintenances/${id}`, formData);
        toast.success(t('updated_successfully'));
      } else {
        await axiosInstance.post("/api/admin/maintenances", formData);
        toast.success(t('created_successfully'));
      }
      navigate("/maintenances");
    } catch (error) {
      const msg = error.response?.data?.message || "An error occurred";
      toast.error(msg);
    }
  };

  if (isEditMode && isFetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-900" size={40} />
        <p className="text-slate-500 animate-pulse">{t('loading_details')}...</p>
      </div>
    );
  }

  if (isEditMode && fetchError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="text-red-500 mb-2" size={40} />
        <h2 className="text-xl font-bold">{t('failed_to_load')}</h2>
        <Button variant="link" onClick={() => navigate("/maintenances")}>{t('back_to_list')}</Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormHeader 
        title={isEditMode ? t('edit_maintenance') : t('add_new_maintenance')}
        subtitle={isEditMode ? `${t('updating_id')}: ${id}` : t('configure_maintenance')}
        onBackClick={() => navigate("/maintenances")} 
      />

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label={t('name')}
            name="name"
            register={register}
            errors={errors}
            placeholder={t('maintenance_name_placeholder')}
          />

          <FormInput
            label={t('maintenance_type')}
            name="maintenanceTypeId"
            type="select"
            register={register}
            errors={errors}
            options={maintenanceTypesOptions}
            placeholder={t('select_maintenance_type')}
            loading={isLoadingTypes}
            setValue={setValue}
            watch={watch}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
          <Button
            type="button"
            variant="ghost"
            className="h-9 px-6 text-slate-500 hover:text-slate-800 text-sm font-medium"
            onClick={() => navigate("/maintenances")}
          >
            {t('cancel')}
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
            {isEditMode ? t('save_changes') : t('create_maintenance')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MaintenancesFormPage;
