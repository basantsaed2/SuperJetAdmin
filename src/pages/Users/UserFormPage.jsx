import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, UserCircle, Key, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/custom/FormInput";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import { usePost } from "@/hooks/usePost";
import { useUpdate } from "@/hooks/useUpdate";
import { toast } from "sonner";
import FormHeader from "@/components/custom/FormHeader";
import { useTranslation } from "react-i18next";

const userSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().min(10, "Invalid phone number"),
  role: z.string().min(1, "Please select a role"),
  hasAccount: z.boolean().default(false),
  username: z.string().optional(),
  password: z.string().optional()
}).refine((data) => {
    if (data.hasAccount) {
        return !!data.username && !!data.password;
    }
    return true;
}, {
    message: "Username and password are required when creating an account",
    path: ["username"]
});

const UserFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Static Roles
  const roles = [
    { label: t('driver'), value: "driver" },
    { label: t('security'), value: "security" },
    { label: t('engineer'), value: "engineer" },
    { label: t('technical'), value: "technical" },
    { label: t('subadmin'), value: "subadmin" }
  ];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      phone: "",
      role: "",
      hasAccount: false,
      username: "",
      password: ""
    },
  });

  const hasAccount = watch("hasAccount");

  // Fetch User Data
  const { data: userResponse, isLoading: isFetchingUser } = useGet(
    ["user", id],
    `/api/admin/users/${id}`,
    { enabled: isEditMode }
  );

  // Load data for editing
  React.useEffect(() => {
    if (isEditMode && userResponse?.data) {
      const user = userResponse.data.user || userResponse.data;
      reset({
        name: user.name || "",
        phone: user.phone || "",
        role: user.role || "",
        hasAccount: !!user.hasAccount,
        username: user.username || "",
        password: "" // Don't load password
      });
    }
  }, [userResponse, reset, isEditMode]);

  const postMutation = usePost("/api/admin/users", ["users"]);
  const updateMutation = useUpdate(`/api/admin/users/${id}`, ["users"]);

  const onSubmit = async (data) => {
    // If hasAccount is false, ensure we don't send username/password
    if (!data.hasAccount) {
      delete data.username;
      delete data.password;
    } else if (isEditMode && !data.password) {
        delete data.password;
    }

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(data);
        toast.success(t('updated_successfully'));
      } else {
        await postMutation.mutateAsync(data);
        toast.success(t('created_successfully'));
      }
      navigate("/users");
    } catch (error) {
      toast.error(error?.response?.data?.message || t('operation_failed'));
    }
  };

  if (isEditMode && isFetchingUser) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormHeader 
        title={isEditMode ? t('edit_user') : t('add_new_user')}
        subtitle={isEditMode ? `${t('updating_id')}: ${id}` : t('configure_user')}
        onBackClick={() => navigate("/users")}
      />

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-slate-50">
          
          {/* Basic Information */}
          <div className="p-6 md:p-8 space-y-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <UserCircle size={20} />
                </div>
                <h3 className="font-bold text-slate-800 tracking-tight">{t('basic_information')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormInput
                    label={t('full_name')}
                    placeholder={t('enter_full_name')}
                    name="name"
                    register={register}
                    errors={errors}
                />

                <FormInput
                    label={t('staff_phone')}
                    placeholder={t('enter_phone_number')}
                    name="phone"
                    register={register}
                    errors={errors}
                />

                <FormInput
                    type="searchable-select"
                    label={t('role_label')}
                    options={roles}
                    value={watch("role")}
                    onChange={(val) => setValue("role", val, { shouldValidate: true })}
                    name="role"
                    errors={errors}
                    placeholder={t('select_role')}
                />
            </div>
          </div>

          {/* Account Settings */}
          <div className="p-6 md:p-8 space-y-8 bg-slate-50/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                        <UserCheck size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 tracking-tight">{t('account_settings')}</h3>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{t('enable_login_access')}</p>
                    </div>
                </div>
                <FormInput
                    type="switch"
                    name="hasAccount"
                    setValue={setValue}
                    watch={watch}
                    className="mt-0"
                />
            </div>

            {hasAccount && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 animate-in slide-in-from-top-4 duration-500">
                    <FormInput
                        label={t('username')}
                        placeholder={t('enter_username')}
                        name="username"
                        register={register}
                        errors={errors}
                        icon={<Key size={14} />}
                    />

                    <FormInput
                        label={t('password')}
                        type="password"
                        placeholder={isEditMode ? t('leave_blank_to_keep_current') : t('enter_password')}
                        name="password"
                        register={register}
                        errors={errors}
                    />
                </div>
            )}
          </div>

          <div className="p-6 md:p-8 bg-white flex justify-end">
            <Button
              type="submit"
              disabled={postMutation.isPending || updateMutation.isPending}
              className={`${THEME.colors.secondary} ${THEME.colors.accent} min-w-[180px] h-12 font-black shadow-lg shadow-yellow-400/20 rounded-xl uppercase tracking-widest text-[11px]`}
            >
              {postMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isEditMode ? t('save_changes') : t('create_user')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormPage;
