// src/features/auth/components/AuthIllustration.jsx
const AuthIllustration = () => {
    return (
        <div className="relative group">
            {/* تأثير التوهج الخلفي */}
            <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

            <svg
                className="relative w-80 h-80 mb-8 drop-shadow-2xl"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* جسم الأتوبيس الأساسي بالأصفر الذهبي */}
                <path
                    d="M4 18h16a2 2 0 0 0 2-2V9a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v7a2 2 0 0 0 2 2z"
                    fill="#FFCC00"
                />

                {/* الزجاج الأمامي (لون أزرق داكن) */}
                <path
                    d="M16 6.5h2.2a2.8 2.8 0 0 1 2.8 2.8V11h-5V6.5z"
                    fill="#002855"
                />
                <path
                    d="M3 11V9.3A3.3 3.3 0 0 1 6.3 6H14v5H3z"
                    fill="#002855"
                    fillOpacity="0.8"
                />

                {/* النوافذ الجانبية */}
                <rect x="7" y="7.5" width="2" height="2" rx="0.5" fill="#003366" fillOpacity="0.4" />
                <rect x="10" y="7.5" width="2" height="2" rx="0.5" fill="#003366" fillOpacity="0.4" />

                {/* العجلات بتفاصيل أدق */}
                <circle cx="6.5" cy="18.5" r="2.8" fill="#111" />
                <circle cx="6.5" cy="18.5" r="1.2" fill="#666" />
                <circle cx="17.5" cy="18.5" r="2.8" fill="#111" />
                <circle cx="17.5" cy="18.5" r="1.2" fill="#666" />

                {/* خط زينة جانبي أبيض */}
                <path d="M2 14.5h20" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />

                {/* الكشافات الأمامية المضيئة */}
                <circle cx="20.5" cy="13.5" r="0.8" fill="white" className="animate-pulse" />
            </svg>
        </div>
    );
};

export default AuthIllustration;