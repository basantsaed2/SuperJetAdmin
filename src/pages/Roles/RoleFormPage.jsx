import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, AlertCircle, ShieldCheck, CheckSquare, Square, Search, X, Check, Filter } from "lucide-react";

// Components & UI
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/custom/FormInput";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import FormHeader from "@/components/custom/FormHeader";
import { useTranslation } from "react-i18next";

const roleSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  permissions: z.array(z.object({
    module: z.string(),
    actions: z.array(z.object({
      id: z.string(),
      action: z.string()
    }))
  }))
});

const RoleFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Fetch Role Data (if editing)
  const { data: roleResponse, isLoading: isFetchingRole } = useGet(
    ["role", id],
    `/api/admin/roles/${id}`,
    { enabled: isEditMode }
  );

  // Fetch Available Permissions Structure
  const { data: permissionsResponse, isLoading: isFetchingPermissions } = useGet(
    ["permissions-structure"],
    "/api/admin/roles/permissions"
  );

  const modules = permissionsResponse?.data?.modules || [];
  const allActions = permissionsResponse?.data?.actions || [];

  // Build a structured permissions object for the UI
  const permissionsStructure = React.useMemo(() => {
    if (permissionsResponse?.data?.permissions) return permissionsResponse.data.permissions;

    // Fallback: Build from modules and actions arrays
    return modules.map(moduleName => ({
      module: moduleName,
      actions: allActions.map(actionName => ({
        // We might not have real IDs for all actions in "Add" mode structure,
        // but we'll use name as a temporary ID if needed.
        id: actionName,
        action: actionName
      }))
    }));
  }, [permissionsResponse, modules, allActions]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  const [searchTerm, setSearchTerm] = React.useState("");

  // Load data into form (EDIT MODE)
  React.useEffect(() => {
    if (isEditMode && roleResponse?.data) {
      // Handle both { data: { role } } and { data: { ...roleData } }
      const role = roleResponse.data.role || roleResponse.data;
      if (role && role.name) {
        reset({
          name: role.name,
          permissions: role.permissions || [],
        });
      }
    }
  }, [roleResponse, reset, isEditMode]);

  const currentPermissions = watch("permissions") || [];
  const selectedModuleNames = currentPermissions.map(p => p.module);

  const moduleOptions = React.useMemo(() => {
    return permissionsStructure.map(p => ({
      label: t(p.module.toLowerCase()) || p.module,
      value: p.module
    }));
  }, [permissionsStructure, t]);

  const handleModuleSelectionChange = (newModuleNames) => {
    const updatedPermissions = [...currentPermissions];

    // Add newly selected modules
    newModuleNames.forEach(name => {
      if (!updatedPermissions.some(p => p.module === name)) {
        updatedPermissions.push({
          module: name,
          actions: []
        });
      }
    });

    // Remove deselected modules
    const finalPermissions = updatedPermissions.filter(p => newModuleNames.includes(p.module));

    setValue("permissions", finalPermissions, { shouldValidate: true });
  };

  const handleTogglePermission = (moduleName, actionName, actionId) => {
    const updatedPermissions = JSON.parse(JSON.stringify(currentPermissions)); // Deep clone
    const moduleIndex = updatedPermissions.findIndex(p => p.module === moduleName);

    if (moduleIndex > -1) {
      // Find action by ID or Name (be robust)
      const actionIndex = updatedPermissions[moduleIndex].actions.findIndex(a =>
        (actionId && a.id === actionId) || (actionName && a.action === actionName)
      );

      if (actionIndex > -1) {
        // Remove action
        updatedPermissions[moduleIndex].actions.splice(actionIndex, 1);
      } else {
        // Add action
        updatedPermissions[moduleIndex].actions.push({ id: actionId, action: actionName });
      }
    }

    setValue("permissions", updatedPermissions, { shouldValidate: true });
  };

  const isActionSelected = (moduleName, actionId, actionName) => {
    const module = currentPermissions.find(p => p.module === moduleName);
    if (!module) return false;
    // Match by ID or Name for maximum compatibility between structure and saved data
    return module.actions.some(a =>
      (actionId && a.id === actionId) || (actionName && a.action === actionName)
    );
  };

  const onSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await axiosInstance.put(`/api/admin/roles/${id}`, formData);
        toast.success(t('updated_successfully'));
      } else {
        await axiosInstance.post("/api/admin/roles", formData);
        toast.success(t('created_successfully'));
      }
      navigate("/roles");
    } catch (error) {
      toast.error(error.response?.data?.message || t("an_error_occurred"));
    }
  };

  if ((isEditMode && isFetchingRole) || isFetchingPermissions) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-900" size={40} />
        <p className="text-slate-500 animate-pulse">{t('loading_permissions')}...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormHeader
        title={isEditMode ? t('edit_role') : t('add_new_role')}
        subtitle={isEditMode ? `${t('updating_id')}: ${id}` : t('configure_role')}
        onBackClick={() => navigate("/roles")}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Role Name */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5">
          <FormInput
            label={t('role_name')}
            name="name"
            register={register}
            errors={errors}
            placeholder={t('role_name_placeholder')}
          />
        </div>

        {/* Module Selection */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5 space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">{t('select_modules')}</h3>
          </div>
          <FormInput
            name="moduleSelection"
            type="select"
            multiple={true}
            options={moduleOptions}
            placeholder={t('search_modules')}
            watch={watch}
            setValue={(name, val) => handleModuleSelectionChange(val)}
            // Pass the current names since this is a virtual field
            defaultValue={selectedModuleNames}
            {...{ watch: () => selectedModuleNames }} // Mock watch for the internal MultiSelect
          />
        </div>

        {/* Selected Modules & Actions */}
        <div className="space-y-4">
          {currentPermissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPermissions.map((modulePerm) => {
                const structure = permissionsStructure.find(s => s.module === modulePerm.module);
                if (!structure) return null;

                return (
                  <div
                    key={modulePerm.module}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <h4 className="font-bold text-slate-800 uppercase tracking-tight text-sm">
                          {t(modulePerm.module.toLowerCase()) || modulePerm.module}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const allActions = structure.actions;
                            const currentActions = modulePerm.actions;
                            const isAllActive = allActions.every(a =>
                              currentActions.some(ma => (a.id && ma.id === a.id) || (a.action && ma.action === a.action))
                            );

                            const updatedPermissions = JSON.parse(JSON.stringify(currentPermissions));
                            const idx = updatedPermissions.findIndex(p => p.module === modulePerm.module);

                            if (isAllActive) {
                              updatedPermissions[idx].actions = [];
                            } else {
                              updatedPermissions[idx].actions = [...allActions];
                            }
                            setValue("permissions", updatedPermissions, { shouldValidate: true });
                          }}
                          className="h-7 px-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          {structure.actions.every(a =>
                            modulePerm.actions.some(ma => (a.id && ma.id === a.id) || (a.action && ma.action === a.action))
                          ) ? t('deselect_all') : t('select_all')}
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleModuleSelectionChange(selectedModuleNames.filter(n => n !== modulePerm.module))}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {structure.actions.map(action => {
                        const isSelected = isActionSelected(modulePerm.module, action.id, action.action);
                        return (
                          <button
                            key={action.id}
                            type="button"
                            onClick={() => handleTogglePermission(modulePerm.module, action.action, action.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 select-none ${isSelected
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-blue-200'
                              }`}
                          >
                            {isSelected ? (
                              <CheckSquare className="w-3.5 h-3.5" />
                            ) : (
                              <Square className="w-3.5 h-3.5" />
                            )}
                            <span className="text-[11px] font-bold uppercase tracking-wider">{action.action}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-3xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-slate-200" />
              </div>
              <h4 className="text-slate-500 font-bold">{t('no_modules_selected')}</h4>
              <p className="text-slate-400 text-sm mt-1">{t('select_modules_to_configure_permissions')}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
          <Button
            type="button"
            variant="ghost"
            className="h-9 px-6 text-slate-500 hover:text-slate-800 text-sm font-medium"
            onClick={() => navigate("/roles")}
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
            {isEditMode ? t('save_changes') : t('create_role')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoleFormPage;
