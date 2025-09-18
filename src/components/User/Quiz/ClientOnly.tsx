"use client";
import React, { useState, useEffect } from "react";

interface ClientOnlyProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children, fallback }) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return (
            fallback || (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">
                            Đang tải...
                        </p>
                    </div>
                </div>
            )
        );
    }

    return <>{children}</>;
};

export default ClientOnly;
