import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const icon_map = {
  user: UserIcon,
  lock: LockClosedIcon,
};

export default function InputField({
  type = 'text',
  placeholder,
  value,
  on_change,
  disabled = false,
  icon = 'user',
  auto_complete = 'off',
}) {
  const IconComponent = icon_map[icon];

  return (
    <div className="flex items-center mb-4 border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-green-500 transition-all">
      <div className="px-3 py-3 bg-green-600 text-white">
        {IconComponent && <IconComponent className="h-6 w-6" />}
      </div>
      <input
        type={type}
        className="w-full px-4 py-3 outline-none disabled:bg-gray-100 text-gray-800 placeholder-gray-500"
        placeholder={placeholder}
        value={value}
        onChange={on_change}
        disabled={disabled}
        autoComplete={auto_complete}
        required
      />
    </div>
  );
}