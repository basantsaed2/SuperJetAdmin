import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, AlertCircle, Image as ImageIcon, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

// Components & UI
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/custom/FormInput";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import { usePost } from "@/hooks/usePost";
import { useUpdate } from "@/hooks/useUpdate";
import axiosInstance from "@/api/axiosInstance";
import FormHeader from "@/components/custom/FormHeader";
import i18n from "@/i18n";

const busSchema = z.object({
  busTypeId: z.string().min(1, i18n.t("bus_type_required")),
  plateNumber: z.string().min(3, i18n.t("plate_number_required")),
  busNumber: z.string().min(2, i18n.t("bus_number_required")),
  maxSeats: z.coerce.number().min(1, i18n.t("seats_min")).max(100, i18n.t("seats_max")),
  licenseNumber: z.string().min(3, i18n.t("license_number_required")),
  licenseExpiryDate: z.string().min(1, i18n.t("expiry_date_required")),
  licenseImage: z.string().optional(),
  busImage: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

const BusesFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [busImagePreview, setBusImagePreview] = React.useState(null);
  const [licenseImagePreview, setLicenseImagePreview] = React.useState(null);

  // Fetch Bus Types for dropdown
  const { data: busTypesResponse } = useGet(["busTypes"], "/api/admin/busTypes");
  const busTypesOptions = React.useMemo(() => {
    const types = busTypesResponse?.data?.busTypes || busTypesResponse?.busTypes || [];
    return types.map(type => ({
      label: type.name,
      value: type.id
    }));
  }, [busTypesResponse]);

  // Fetch Bus details if in edit mode
  const { data: response, isLoading: isFetching, error: fetchError } = useGet(
    ["bus", id],
    `/api/admin/buses/${id}`,
    { enabled: isEditMode }
  );

  const postMutation = usePost("/api/admin/buses", ["buses"]);
  const updateMutation = useUpdate("/api/admin/buses", ["buses"]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(busSchema),
    defaultValues: {
      busTypeId: "",
      plateNumber: "",
      busNumber: "",
      maxSeats: "",
      licenseNumber: "",
      licenseExpiryDate: "",
      licenseImage: "",
      busImage: "",
      status: "active",
    },
  });

  React.useEffect(() => {
    if (isEditMode && response?.data?.bus) {
      const bus = response.data.bus;
      reset({
        busTypeId: bus.busTypeId || bus.busType?.id || "",
        plateNumber: bus.plateNumber,
        busNumber: bus.busNumber,
        maxSeats: bus.maxSeats,
        licenseNumber: bus.licenseNumber,
        licenseExpiryDate: bus.licenseExpiryDate?.split('T')[0] || "",
        licenseImage: bus.licenseImage || "",
        busImage: bus.busImage || "",
        status: bus.status || "active",
      });
      setBusImagePreview(bus.busImage);
      setLicenseImagePreview(bus.licenseImage);
    }
  }, [response, reset, isEditMode]);

  const handleFileChange = (e, fieldName, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setValue(fieldName, base64String);
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const payload = { ...data };

    // Only send the image if it's a new one (base64)
    // If it's a URL, it hasn't changed, so we can omit it to avoid unnecessary data
    if (typeof payload.busImage === 'string' && !payload.busImage.startsWith('data:')) {
      delete payload.busImage;
    }
    if (typeof payload.licenseImage === 'string' && !payload.licenseImage.startsWith('data:')) {
      delete payload.licenseImage;
    }

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: `${id}/data`,
          updatedData: payload
        });
      } else {
        await postMutation.mutateAsync(payload);
      }
      navigate("/buses");
    } catch (error) {
      // Error is handled by the hook's onError
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
        <Button variant="link" onClick={() => navigate("/buses")}>{t('back_to_list')}</Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormHeader
        title={isEditMode ? t('edit_bus') : t('add_new_bus')}
        subtitle={isEditMode ? `${t('updating_id')}: ${id}` : t('manage_buses')}
        onBackClick={() => navigate("/buses")}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormInput
            type="select"
            label={t('bus_type')}
            name="busTypeId"
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            options={busTypesOptions}
            placeholder={t('select_bus_type')}
          />

          <FormInput
            label={t('bus_number')}
            name="busNumber"
            register={register}
            errors={errors}
            placeholder={t('bus_number_placeholder')}
          />

          <FormInput
            label={t('plate_number')}
            name="plateNumber"
            register={register}
            errors={errors}
            placeholder={t('plate_placeholder')}
          />

          <FormInput
            label={t('max_seats')}
            name="maxSeats"
            type="number"
            register={register}
            errors={errors}
            placeholder={t('capacity_placeholder')}
          />

          <FormInput
            label={t('license_number')}
            name="licenseNumber"
            register={register}
            errors={errors}
            placeholder={t('license_placeholder')}
          />

          <FormInput
            label={t('license_expiry')}
            name="licenseExpiryDate"
            type="date"
            register={register}
            errors={errors}
          />

          <FormInput
            type="switch"
            label={t('status')}
            name="status"
            setValue={setValue}
            watch={watch}
            placeholder={t('status')}
          />
        </div>

        {/* Image Upload Checks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Bus Image */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 block">{t('bus_image')}</label>
            <div className="relative group">
              <div className="w-full h-48 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center transition-all group-hover:border-blue-300 group-hover:bg-blue-50 overflow-hidden">
                {busImagePreview ? (
                  <img src={busImagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-xs text-slate-400 font-medium">{t('click_to_upload_bus_photo')}</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, "busImage", setBusImagePreview)}
                />
              </div>
            </div>
          </div>

          {/* License Image */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 block">{t('license_image')}</label>
            <div className="relative group">
              <div className="w-full h-48 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center transition-all group-hover:border-blue-300 group-hover:bg-blue-50 overflow-hidden">
                {licenseImagePreview ? (
                  <img src={licenseImagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <FileText className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-xs text-slate-400 font-medium">{t('click_to_upload_license_scan')}</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, "licenseImage", setLicenseImagePreview)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            className="h-10 px-6 text-slate-500 hover:text-slate-800 text-sm font-medium"
            onClick={() => navigate("/buses")}
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
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <Save className="mr-2" size={18} />
            )}
            {isEditMode ? t('save_changes') : t('add_bus')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusesFormPage;
