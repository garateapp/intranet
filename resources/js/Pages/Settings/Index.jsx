import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ settings }) {
    const { data, setData, put, processing, errors } = useForm({
        settings: flattenSettings(settings),
    });

    function flattenSettings(settingsGroups) {
        const flattened = {};
        Object.values(settingsGroups).forEach(group => {
            group.forEach(setting => {
                let value = setting.value;
                
                // Handle JSON values
                if (setting.type === 'json' && typeof value === 'string') {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        value = '';
                    }
                }
                
                // Handle boolean values
                if (setting.type === 'boolean') {
                    value = value === true || value === '1' || value === 1;
                }
                
                flattened[setting.key] = value;
            });
        });
        return flattened;
    }

    function handleSubmit(e) {
        e.preventDefault();
        put(route('settings.update'), {
            data: {
                settings: data.settings,
            },
        });
    }

    function renderSettingInput(setting, value) {
        const key = setting.key;

        switch (setting.type) {
            case 'boolean':
                return (
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={value === true || value === '1' || value === 1}
                            onChange={(e) => setData('settings', { ...data.settings, [key]: e.target.checked })}
                            className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                        />
                        <span className="ms-2 text-sm text-gray-600">Enabled</span>
                    </label>
                );

            case 'text':
            default:
                if (key.includes('description') || key.includes('content')) {
                    return (
                        <textarea
                            value={value || ''}
                            onChange={(e) => setData('settings', { ...data.settings, [key]: e.target.value })}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                    );
                }

                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => setData('settings', { ...data.settings, [key]: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                );
        }
    }

    const groupLabels = {
        general: 'General Settings',
        appearance: 'Appearance Settings',
        features: 'Feature Toggles',
        seo: 'SEO Settings',
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    System Settings
                </h2>
            }
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {Object.entries(settings).map(([group, settingsArray]) => (
                            <div
                                key={group}
                                className="overflow-hidden bg-white shadow-sm sm:rounded-lg"
                            >
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        {groupLabels[group] || group.charAt(0).toUpperCase() + group.slice(1)}
                                    </h3>

                                    <div className="space-y-6">
                                        {settingsArray.map((setting) => (
                                            <div key={setting.key}>
                                                <InputLabel
                                                    htmlFor={setting.key}
                                                    value={setting.description || setting.key}
                                                />
                                                <div className="mt-1">
                                                    {renderSettingInput(setting, data.settings[setting.key])}
                                                </div>
                                                <InputError
                                                    message={errors.settings?.[setting.key]}
                                                    className="mt-2"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-end space-x-4">
                            <PrimaryButton disabled={processing}>
                                Save Settings
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
