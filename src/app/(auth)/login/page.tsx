"use client"

import { LoginForm } from "@/components/auth/login-form"
import { motion } from "framer-motion"

export default function LoginPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-3xl" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <LoginForm />
            </motion.div>
        </div>
    )
}
