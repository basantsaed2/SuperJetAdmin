import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/custom/FormInput";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import { usePost } from "@/hooks/usePost";
import { useUpdate } from "@/hooks/useUpdate";
import { toast } from "sonner";
import FormHeader from "@/components/custom/FormHeader";
import { useTranslation } from "react-i18next";

const adminSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  phone: z.string().min(10, "Invalid phone number"),
  roleId: z.string().uuid("Please select a role"),
  type: z.string().min(1, "Please select type")
});

const AdminFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Fetch Admin Data
  const { data: adminResponse, isLoading: isFetchingAdmin } = useGet(
    ["admin", id],
    `/api/admin/admins/${id}`,
    { enabled: isEditMode }
  );

  // Fetch Roles
  const { data: rolesResponse } = useGet(["admin-roles"], "/api/admin/admins/roles");
  const roles = rolesResponse?.data?.roles || [];

  const roleOptions = React.useMemo(() => {
    return roles.map(r => ({ label: r.name, value: r.id }));
  }, [roles]);

  const typeOptions = [
    { label: "Super Admin", value: "superadmin" },
    { label: "Admin", value: "admin" }
  ];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      roleId: "",
      type: "admin"
    },
  });

  // Load data for editing
  React.useEffect(() => {
    if (isEditMode && adminResponse?.data) {
      const admin = adminResponse.data.admin || adminResponse.data;
      reset({
        name: admin.name || "",
        email: admin.email || "",
        password: "", // Don't load password
        phone: admin.phone || "",
        roleId: admin.roleId || admin.role?.id || "",
        type: admin.type || "admin"
      });
    }
  }, [adminResponse, reset, isEditMode]);

  const postMutation = usePost("/api/admin/admins", ["admins"]);
  const updateMutation = useUpdate(`/api/admin/admins/${id}`, ["admins"]);

  const onSubmit = async (data) => {
    if (isEditMode && !data.password) {
      delete data.password;
    }

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(data);
        toast.success(t('admin_updated_successfully'));
      } else {
        await postMutation.mutateAsync(data);
        toast.success(t('admin_added_successfully'));
      }
      navigate("/admins");
    } catch (error) {
      toast.error(error?.response?.data?.message || t('operation_failed'));
    }
  };

  if (isEditMode && isFetchingAdmin) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormHeader 
        title={isEditMode ? t('edit_admin') : t('add_new_admin')}
        subtitle={isEditMode ? `${t('updating_id')}: ${id}` : t('configure_admin')}
        onBackClick={() => navigate("/admins")}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput
              label={t('full_name')}
              placeholder={t('enter_full_name')}
              name="name"
              register={register}
              errors={errors}
            />

            <FormInput
              label={t('email')}
              type="email"
              placeholder={t('enter_email_address')}
              name="email"
              register={register}
              errors={errors}
            />

            <FormInput
                label={t('password')}
                type="password"
                placeholder={isEditMode ? t('leave_blank_to_keep_current') : t('enter_password')}
                name="password"
                register={register}
                errors={errors}
            />

            <FormInput
              label={t('phone')}
              placeholder={t('enter_phone_number')}
              name="phone"
              register={register}
              errors={errors}
            />

            <FormInput
              type="select"
              label={t('role')}
              options={roleOptions}
              register={register}
              value={watch("roleId")}
              onChange={(val) => setValue("roleId", val, { shouldValidate: true })}
              name="roleId"
              errors={errors}
              placeholder={t('select_role')}
            />

            <FormInput
                type="select"
                label={t('admin_type')}
                options={typeOptions}
                register={register}
                value={watch("type")}
                onChange={(val) => setValue("type", val, { shouldValidate: true })}
                name="type"
                errors={errors}
                placeholder={t('select_type')}
            />
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-50">
            <Button
              type="submit"
              disabled={postMutation.isPending || updateMutation.isPending}
              className={`${THEME.colors.secondary} ${THEME.colors.accent} min-w-[160px] h-12 font-bold shadow-lg shadow-yellow-400/20 rounded-xl`}
            >
              {postMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isEditMode ? t('save_changes') : t('add_admin')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFormPage;
