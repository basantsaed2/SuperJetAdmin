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
import { usePost } from "@/hooks/usePost";
import { useUpdate } from "@/hooks/useUpdate";
import axiosInstance from "@/api/axiosInstance";
import FormHeader from "@/components/custom/FormHeader";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n";

const garageSchema = z.object({
  name: z.string().min(2, i18n.t("name_too_short")),
  cityId: z.string().min(1, i18n.t("invalid_city")),
  location: z.string().min(2, i18n.t("location_too_short")),
});

const GarageFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { data: response, isLoading: isFetching, error: fetchError } = useGet(
    ["garage", id],
    `/api/admin/garages/${id}`,
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
    resolver: zodResolver(garageSchema),
    defaultValues: {
      name: "",
      cityId: "",
      location: "",
    },
  });

  const postMutation = usePost("/api/admin/garages", ["garages"]);
  const updateMutation = useUpdate("/api/admin/garages", ["garages"]);

  React.useEffect(() => {
    if (isEditMode && response?.data?.garage) {
      const garage = response.data.garage;
      reset({
        name: garage.name,
        cityId: garage.cityId || garage.city?.id || "",
        location: garage.location || "",
      });
    }
  }, [response, reset, isEditMode]);

  const onSubmit = async (formData) => {
    if (isEditMode) {
      await updateMutation.mutateAsync({ id, updatedData: formData });
    } else {
      await postMutation.mutateAsync(formData);
    }
    navigate("/garages");
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
        <Button variant="link" onClick={() => navigate("/garages")}>{t('back_to_list')}</Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormHeader
        title={isEditMode ? t('edit_garage') : t('add_new_garage')}
        subtitle={isEditMode ? `${t('updating_id')}: ${id}` : t('configure_garage')}
        onBackClick={() => navigate("/garages")}
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
            placeholder={t('garage_name_placeholder')}
          />

          <FormInput
            label={t('city')}
            name="cityId"
            type="select"
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            options={cityOptions}
            placeholder={t('select_city')}
            loading={isLoadingCities}
          />

          <div className="md:col-span-2">
            <FormInput
              label={t('location')}
              name="location"
              register={register}
              errors={errors}
              placeholder={t('location_placeholder')}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
          <Button
            type="button"
            variant="ghost"
            className="h-9 px-6 text-slate-500 hover:text-slate-800 text-sm font-medium"
            onClick={() => navigate("/garages")}
          >
            {t('cancel')}
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || postMutation.isPending || updateMutation.isPending}
            size="sm"
            className={`min-w-[120px] h-9 text-sm font-bold transition-all text-white ${THEME.colors.primary} hover:opacity-90 shadow-md shadow-yellow-400/10`}
          >
            {isSubmitting || postMutation.isPending || updateMutation.isPending ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : (
              <Save className="mr-2" size={16} />
            )}
            {isEditMode ? t('save_changes') : t('create_garage')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GarageFormPage;
