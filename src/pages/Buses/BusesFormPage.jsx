import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, AlertCircle, Image as ImageIcon, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

// Components & UI
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/custom/FormInput";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import FormHeader from "@/components/ui/custom/FormHeader";

const busSchema = z.object({
  busTypeId: z.string().min(1, "Bus type is required"),
  plateNumber: z.string().min(3, "Plate number is required"),
  busNumber: z.string().min(2, "Bus number is required"),
  maxSeats: z.coerce.number().min(1, "Seats must be at least 1"),
  licenseNumber: z.string().min(3, "License number is required"),
  licenseExpiryDate: z.string().min(1, "Expiry date is required"),
  licenseImage: z.string().optional(),
  busImage: z.string().optional(),
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
  const { data: busResponse, isLoading: isFetching, error: fetchError } = useGet(
    ["bus", id],
    `/api/admin/buses/${id}`,
    { enabled: isEditMode }
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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
    },
  });

  React.useEffect(() => {
    if (isEditMode && busResponse?.data?.bus) {
      const bus = busResponse.data.bus;
      reset({
        busTypeId: bus.busTypeId,
        plateNumber: bus.plateNumber,
        busNumber: bus.busNumber,
        maxSeats: bus.maxSeats,
        licenseNumber: bus.licenseNumber,
        licenseExpiryDate: bus.licenseExpiryDate?.split('T')[0] || "",
        licenseImage: bus.licenseImage || "",
        busImage: bus.busImage || "",
      });
      setBusImagePreview(bus.busImage);
      setLicenseImagePreview(bus.licenseImage);
    }
  }, [busResponse, reset, isEditMode]);

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

  const onSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await axiosInstance.put(`/api/admin/buses/${id}`, formData);
        toast.success(t('updated_bus'));
      } else {
        await axiosInstance.post("/api/admin/buses", formData);
        toast.success(t('created_bus'));
      }
      navigate("/buses");
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
            errors={errors}
            options={busTypesOptions}
            placeholder={t('select_bus_type')}
            defaultValue={busResponse?.data?.bus?.busTypeId}
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
                      <p className="text-xs text-slate-400 font-medium">Click to upload bus photo</p>
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
                      <p className="text-xs text-slate-400 font-medium">Click to upload license scan</p>
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
            disabled={isSubmitting}
            size="sm"
            className={`min-w-[140px] h-10 text-sm font-bold transition-all text-white ${THEME.colors.primary} hover:opacity-90 shadow-md`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <Save className="mr-2" size={18} />
            )}
            {isEditMode ? t('save_changes') : t('create_type')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusesFormPage;
