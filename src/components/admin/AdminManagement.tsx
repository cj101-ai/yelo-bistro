
import { useCallback, useEffect, useState } from 'react'
import {
  ShieldCheck,
  UserPlus,
  Users,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

const availablePermissions = [
  { id: 'dashboard', label: 'Dashboard', description: 'View the dashboard' },
  { id: 'my-orders', label: 'My Orders', description: 'View personal orders' },
  {
    id: 'customer-management',
    label: 'Customer Management',
    description: 'View registered customers',
  },
  {
    id: 'customer-orders',
    label: "Customers' Orders",
    description: 'View and update customer orders',
  },
  {
    id: 'product-management',
    label: 'Product Management',
    description: 'Manage menu products and availability',
  },
] as const

type Permission = (typeof availablePermissions)[number]['id']

type SubAdmin = {
  id: string
  full_name: string
  email: string | null
  permissions: Permission[]
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<SubAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [newPermissions, setNewPermissions] = useState<Permission[]>([
    'dashboard',
  ])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingPermissions, setEditingPermissions] = useState<Permission[]>([])
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const loadAdmins = useCallback(async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'sub_admin')
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      const { data: assigned, error: permissionsError } = await supabase
        .from('admin_permissions')
        .select('profile_id, permission')

      if (permissionsError) throw permissionsError

      const validPermissions = availablePermissions.map((item) => item.id)

      const result: SubAdmin[] = (profiles ?? []).map((profile) => ({
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        permissions: (assigned ?? [])
          .filter((item) => item.profile_id === profile.id)
          .map((item) => item.permission)
          .filter(
            (permission): permission is Permission =>
              validPermissions.includes(permission as Permission),
          ),
      }))

      setAdmins(result)
    } catch (error) {
      console.error('Unable to load sub-admins:', error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to load sub-admin accounts.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAdmins()
  }, [loadAdmins])

  const togglePermission = (
    permission: Permission,
    selected: Permission[],
    setter: (permissions: Permission[]) => void,
  ) => {
    setter(
      selected.includes(permission)
        ? selected.filter((item) => item !== permission)
        : [...selected, permission],
    )
  }

  const createSubAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setErrorMessage('')

    if (!fullName.trim() || !email.trim()) {
      setErrorMessage('Enter the sub-admin’s name and email address.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('The password must contain at least 8 characters.')
      return
    }

    if (newPermissions.length === 0) {
      setErrorMessage('Select at least one dashboard permission.')
      return
    }

    setCreating(true)

    try {
      const { data, error } = await supabase.functions.invoke(
        'clever-handler',
        {
          body: {
            action: 'create',
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            password,
            permissions: newPermissions,
          },
        },
      )

      if (error) {
        let detail = error.message

        try {
          const response = error.context as Response | undefined
          if (response && typeof response.json === 'function') {
            const payload = await response.clone().json()
            if (payload?.error) detail = payload.error
          }
        } catch {
          // Keep the original function error message.
        }

        throw new Error(detail || 'Unable to create the sub-admin.')
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Unable to create the sub-admin.')
      }

      setFullName('')
      setEmail('')
      setPassword('')
      setShowPassword(false)
      setNewPermissions(['dashboard'])
      setMessage(
        'Sub-admin account created. Email verification may be required before the new account can sign in.',
      )

      await loadAdmins()
    } catch (error) {
      console.error('Sub-admin creation failed:', error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to create the sub-admin.',
      )
    } finally {
      setCreating(false)
    }
  }

  const beginEditing = (admin: SubAdmin) => {
    setMessage('')
    setErrorMessage('')
    setEditingId(admin.id)
    setEditingPermissions([...admin.permissions])
  }

  const savePermissions = async (admin: SubAdmin) => {
    setMessage('')
    setErrorMessage('')
    setSavingId(admin.id)

    try {
      // Remove the existing permission rows first.
      const { error: deleteError } = await supabase
        .from('admin_permissions')
        .delete()
        .eq('profile_id', admin.id)

      if (deleteError) throw deleteError

      // Insert the new selection. An empty selection revokes
      // dashboard access while keeping the account in the system.
      if (editingPermissions.length > 0) {
        const rows = editingPermissions.map((permission) => ({
          profile_id: admin.id,
          permission,
        }))

        const { error: insertError } = await supabase
          .from('admin_permissions')
          .insert(rows)

        if (insertError) {
          throw new Error(
            `Permissions could not be saved. The account may currently have no assigned sections. ${insertError.message}`,
          )
        }
      }

      setAdmins((current) =>
        current.map((item) =>
          item.id === admin.id
            ? { ...item, permissions: [...editingPermissions] }
            : item,
        ),
      )

      setEditingId(null)
      setEditingPermissions([])
      setMessage(
        editingPermissions.length === 0
          ? `Dashboard access revoked for ${admin.full_name}.`
          : `Permissions updated for ${admin.full_name}.`,
      )
    } catch (error) {
      console.error('Permission update failed:', error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to update permissions.',
      )
      await loadAdmins()
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
              <ShieldCheck size={25} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Create Admin
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-neutral-400">
                Create sub-admin accounts and control their access.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void loadAdmins()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-stone-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {message && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
        >
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <p>{message}</p>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p className="break-words">{errorMessage}</p>
        </div>
      )}

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
            <UserPlus size={21} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold">Create a sub-admin</h3>
            <p className="mt-1 text-sm text-stone-500 dark:text-neutral-400">
              Select every section this person is allowed to access.
            </p>
          </div>
        </div>

        <form onSubmit={createSubAdmin} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Full name
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 dark:border-neutral-700 dark:bg-neutral-950">
                <UserRound size={18} className="shrink-0 text-stone-400" />
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  required
                  maxLength={120}
                  placeholder="Enter full name"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Email address
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 dark:border-neutral-700 dark:bg-neutral-950">
                <Mail size={18} className="shrink-0 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                />
              </span>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold">
                Temporary password
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 dark:border-neutral-700 dark:bg-neutral-950">
                <LockKeyhole size={18} className="shrink-0 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  placeholder="At least 8 characters"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-200 dark:hover:bg-neutral-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
              <span className="mt-1 block text-xs text-stone-500 dark:text-neutral-400">
                Use a strong, unique password and share it securely.
              </span>
            </label>
          </div>

          <div>
            <div className="mb-3">
              <h4 className="text-sm font-bold">Dashboard permissions</h4>
              <p className="mt-1 text-xs text-stone-500 dark:text-neutral-400">
                You can select multiple sections. Admin Management is reserved
                for the main administrator.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {availablePermissions.map((permission) => {
                const checked = newPermissions.includes(permission.id)

                return (
                  <label
                    key={permission.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                      checked
                        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30'
                        : 'border-stone-200 hover:bg-stone-50 dark:border-neutral-800 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        togglePermission(
                          permission.id,
                          newPermissions,
                          setNewPermissions,
                        )
                      }
                      className="mt-1 h-4 w-4 accent-yellow-500"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">
                        {permission.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-stone-500 dark:text-neutral-400">
                        {permission.description}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-5 dark:border-neutral-800">
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              {newPermissions.length} permission
              {newPermissions.length === 1 ? '' : 's'} selected
            </p>

            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-neutral-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? (
                <RefreshCw size={17} className="animate-spin" />
              ) : (
                <UserPlus size={17} />
              )}
              {creating ? 'Creating account...' : 'Create sub-admin'}
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-5 dark:border-neutral-800 sm:p-6">
          <div className="flex items-center gap-3">
            <Users size={22} className="text-stone-500" />
            <div>
              <h3 className="text-lg font-extrabold">Sub-admin accounts</h3>
              <p className="mt-1 text-sm text-stone-500 dark:text-neutral-400">
                Edit permissions or revoke dashboard access.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-bold dark:bg-neutral-800">
            {admins.length} account{admins.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 p-10 text-sm text-stone-500">
            <RefreshCw size={18} className="animate-spin" />
            Loading sub-admin accounts...
          </div>
        ) : admins.length === 0 ? (
          <div className="p-10 text-center">
            <Users size={30} className="mx-auto text-stone-400" />
            <p className="mt-3 font-bold">No sub-admin accounts yet</p>
            <p className="mt-1 text-sm text-stone-500 dark:text-neutral-400">
              Create the first sub-admin using the form above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-neutral-800">
            {admins.map((admin) => {
              const editing = editingId === admin.id
              const selected = editing
                ? editingPermissions
                : admin.permissions

              return (
                <article key={admin.id} className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-neutral-300">
                        <UserRound size={21} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="break-words font-bold">
                          {admin.full_name}
                        </h4>
                        <p className="mt-1 break-all text-sm text-stone-500 dark:text-neutral-400">
                          {admin.email || 'No email recorded'}
                        </p>
                      </div>
                    </div>

                    {!editing ? (
                      <button
                        type="button"
                        onClick={() => beginEditing(admin)}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm font-bold hover:bg-stone-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      >
                        <ShieldCheck size={16} />
                        Edit access
                      </button>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null)
                            setEditingPermissions([])
                          }}
                          disabled={savingId === admin.id}
                          className="rounded-xl border border-stone-200 px-3 py-2 text-sm font-bold hover:bg-stone-50 disabled:opacity-60 dark:border-neutral-700 dark:hover:bg-neutral-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => void savePermissions(admin)}
                          disabled={savingId === admin.id}
                          className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-3 py-2 text-sm font-extrabold text-neutral-950 hover:bg-yellow-300 disabled:opacity-60"
                        >
                          {savingId === admin.id ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : (
                            <Save size={16} />
                          )}
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    {editing ? (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {availablePermissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-3 text-sm hover:bg-stone-50 dark:border-neutral-800 dark:hover:bg-neutral-800/60"
                          >
                            <input
                              type="checkbox"
                              checked={editingPermissions.includes(permission.id)}
                              onChange={() =>
                                togglePermission(
                                  permission.id,
                                  editingPermissions,
                                  setEditingPermissions,
                                )
                              }
                              className="h-4 w-4 accent-yellow-500"
                            />
                            <span>{permission.label}</span>
                          </label>
                        ))}
                      </div>
                    ) : admin.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {admin.permissions.map((permission) => {
                          const label = availablePermissions.find(
                            (item) => item.id === permission,
                          )?.label ?? permission

                          return (
                            <span
                              key={permission}
                              className="rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200"
                            >
                              {label}
                            </span>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-300">
                        <LockKeyhole size={15} />
                        No dashboard permissions assigned
                      </p>
                    )}

                    {editing && (
                      <p className="mt-3 text-xs text-stone-500 dark:text-neutral-400">
                        Uncheck every section to revoke dashboard access. The
                        account itself will remain in Supabase.
                      </p>
                    )}

                    {!editing && (
                      <p className="mt-3 text-xs text-stone-500 dark:text-neutral-400">
                        {admin.permissions.length} section
                        {admin.permissions.length === 1 ? '' : 's'} assigned
                      </p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
