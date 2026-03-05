import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, AlertCircle } from "lucide-react";

// Components & UI
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/custom/FormInput";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import FormHeader from "@/components/custom/FormHeader";
import { useTranslation } from "react-i18next";

const zoneSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  cityId: z.string().uuid("Please select a valid city"),
});

const ZoneFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { data: response, isLoading: isFetching, error: fetchError } = useGet(
    ["zone", id],
    `/api/admin/zones/${id}`,
    { enabled: isEditMode }
  );

  // Fetch Cities for dropdown
  const { data: citiesResponse, isLoading: isLoadingCities } = useGet(
    ["cities"],
    "/api/admin/cities"
  );

  const cityOptions = React.useMemo(() => {
    const citiesData = citiesResponse?.data?.cities || citiesResponse?.cities || [];
    return citiesData.map(city => ({
      label: city.name,
      value: city.id
    }));
  }, [citiesResponse]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      name: "",
      cityId: "",
    },
  });

  React.useEffect(() => {
    if (isEditMode && response?.data?.zone) {
      const zone = response.data.zone;
      reset({
        name: zone.name,
        cityId: zone.cityId,
      });
    }
  }, [response, reset, isEditMode]);

  const onSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await axiosInstance.put(`/api/admin/zones/${id}`, formData);
        toast.success(t('updated_successfully'));
      } else {
        await axiosInstance.post("/api/admin/zones", formData);
        toast.success(t('created_successfully'));
      }
      navigate("/zones");
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
        <Button variant="link" onClick={() => navigate("/zones")}>{t('back_to_list')}</Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormHeader 
        title={isEditMode ? t('edit_zone') : t('add_new_zone')}
        subtitle={isEditMode ? `${t('updating_id')}: ${id}` : t('configure_zone')}
        onBackClick={() => navigate("/zones")} 
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
            placeholder={t('zone_name_placeholder')}
          />

          <FormInput
            label={t('city')}
            name="cityId"
            type="select"
            register={register}
            errors={errors}
            options={cityOptions}
            placeholder={t('select_city')}
            loading={isLoadingCities}
            setValue={setValue}
            watch={watch}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
          <Button
            type="button"
            variant="ghost"
            className="h-9 px-6 text-slate-500 hover:text-slate-800 text-sm font-medium"
            onClick={() => navigate("/zones")}
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
            {isEditMode ? t('save_changes') : t('create_zone')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ZoneFormPage;
